import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import pg from 'pg';
import redis from 'redis';
import cors from 'cors';

dotenv.config();

const { Pool } = pg;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000, // 60 seconds - increased to prevent disconnection on tab switch
  pingInterval: 25000, // 25 seconds
  upgradeTimeout: 30000,
  maxHttpBufferSize: 1e8,
  transports: ['websocket', 'polling'],
});


app.use(cors());
app.use(express.json());

// PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Redis
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on('error', (err) => console.error('Redis Error:', err));
await redisClient.connect();

// ==================== CONSTANTS ====================
const SEAT_LOCK_DURATION = Number(process.env.SEAT_LOCK_DURATION);
const TICKET_PRICE = Number(process.env.TICKET_PRICE);
const TAX_PERCENT = Number(process.env.TAX_PERCENT);
const CONVENIENCE_FEE = Number(process.env.CONVENIENCE_FEE);
const DISCONNECT_UNLOCK_DELAY = 3000; // 3 seconds

// Track user sessions and their locked seats
const userSessions = new Map(); // socketId -> { userId, lockedSeats: Set }

// ==================== ROUTES ====================

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    database: 'connected',
    redis: 'connected',
    timestamp: new Date().toISOString()
  });
});

// Get all shows
app.get('/api/shows', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM shows ORDER BY show_time'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch shows' });
  }
});

// Get seats for a show
app.get('/api/seats/:showId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM seats WHERE show_id = $1 ORDER BY seat_number',
      [req.params.showId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch seats' });
  }
});

// Lock seat
app.post('/api/lock-seat', async (req, res) => {
  const client = await pool.connect();

  try {
    const { seatId, userId } = req.body;
    await client.query('BEGIN');

    const seatCheck = await client.query(
      'SELECT * FROM seats WHERE seat_id = $1 FOR UPDATE',
      [seatId]
    );

    if (!seatCheck.rows.length || seatCheck.rows[0].status !== 'AVAILABLE') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Seat not available' });
    }

    const lockExpiry = new Date(Date.now() + SEAT_LOCK_DURATION * 1000);

    await client.query(
      `UPDATE seats 
       SET status='LOCKED', locked_by=$1, lock_expiry=$2 
       WHERE seat_id=$3`,
      [userId, lockExpiry, seatId]
    );

    await client.query('COMMIT');

    await redisClient.setEx(
      `seat_lock:${seatId}`,
      SEAT_LOCK_DURATION,
      userId
    );

    io.emit('seat-locked', { seatId, userId, lockExpiry });

    res.json({ success: true, lockExpiry });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to lock seat' });
  } finally {
    client.release();
  }
});

// Unlock seat
app.post('/api/unlock-seat', async (req, res) => {
  const { seatId, userId } = req.body;

  const result = await pool.query(
    `UPDATE seats 
     SET status='AVAILABLE', locked_by=NULL, lock_expiry=NULL
     WHERE seat_id=$1 AND locked_by=$2
     RETURNING *`,
    [seatId, userId]
  );

  if (!result.rows.length) {
    return res.status(400).json({ error: 'Cannot unlock seat' });
  }

  await redisClient.del(`seat_lock:${seatId}`);
  io.emit('seat-unlocked', { seatId });

  res.json({ success: true });
});

// ==================== HELPER FUNCTIONS ====================

// Unlock all seats for a user after disconnect
async function unlockUserSeats(userId, lockedSeats, showId) {
  if (!lockedSeats || lockedSeats.size === 0) return;

  const seatIds = Array.from(lockedSeats);

  try {
    const result = await pool.query(
      `UPDATE seats 
       SET status='AVAILABLE', locked_by=NULL, lock_expiry=NULL
       WHERE seat_id = ANY($1) AND locked_by=$2
       RETURNING seat_id`,
      [seatIds, userId]
    );

    if (result.rows.length > 0) {
      const unlockedIds = result.rows.map(r => r.seat_id);

      // Remove from Redis
      for (const seatId of unlockedIds) {
        await redisClient.del(`seat_lock:${seatId}`);
      }

      // Emit to all clients in the show room
      if (showId) {
        io.to(`show-${showId}`).emit('seats-unlocked-bulk', { seatIds: unlockedIds });
      } else {
        io.emit('seats-unlocked-bulk', { seatIds: unlockedIds });
      }

      console.log(`Unlocked ${unlockedIds.length} seats for user ${userId}`);
    }
  } catch (err) {
    console.error('Error unlocking user seats:', err);
  }
}

// ==================== BACKGROUND JOB ====================
setInterval(async () => {
  const result = await pool.query(
    `UPDATE seats 
     SET status='AVAILABLE', locked_by=NULL, lock_expiry=NULL
     WHERE status='LOCKED' AND lock_expiry < NOW()
     RETURNING seat_id`
  );

  if (result.rows.length) {
    const seatIds = result.rows.map((r) => r.seat_id);

    for (const id of seatIds) {
      await redisClient.del(`seat_lock:${id}`);
    }

    io.emit('seats-unlocked-bulk', { seatIds });
  }
}, 10000);

// ==================== SOCKET.IO ====================
io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  // Initialize session tracking
  userSessions.set(socket.id, {
    userId: null,
    lockedSeats: new Set(),
    showId: null
  });

  // Register user
  socket.on('register-user', ({ userId }) => {
    const session = userSessions.get(socket.id);
    if (session) {
      session.userId = userId;
    }
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  // Join a specific show room
  socket.on('join-show', (showId) => {
    socket.join(`show-${showId}`);
    const session = userSessions.get(socket.id);
    if (session) {
      session.showId = showId;
    }
    console.log(`Socket ${socket.id} joined show-${showId}`);
  });

  // Leave a show room
  socket.on('leave-show', (showId) => {
    socket.leave(`show-${showId}`);
    console.log(`Socket ${socket.id} left show-${showId}`);
  });

  // Lock seat via WebSocket
  socket.on('lock-seat', async ({ seatId, userId, showId }) => {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const seatCheck = await client.query(
        'SELECT * FROM seats WHERE seat_id = $1 FOR UPDATE',
        [seatId]
      );

      if (!seatCheck.rows.length || seatCheck.rows[0].status !== 'AVAILABLE') {
        await client.query('ROLLBACK');
        socket.emit('lock-seat-error', { error: 'Seat not available', seatId });
        return;
      }

      const lockExpiry = new Date(Date.now() + SEAT_LOCK_DURATION * 1000);

      await client.query(
        `UPDATE seats 
         SET status='LOCKED', locked_by=$1, lock_expiry=$2 
         WHERE seat_id=$3`,
        [userId, lockExpiry, seatId]
      );

      await client.query('COMMIT');

      await redisClient.setEx(
        `seat_lock:${seatId}`,
        SEAT_LOCK_DURATION,
        userId
      );

      // Track this seat in user session
      const session = userSessions.get(socket.id);
      if (session) {
        session.lockedSeats.add(seatId);
      }

      // Emit to all clients in the show room
      io.to(`show-${showId}`).emit('seat-locked', { seatId, userId, lockExpiry });

      socket.emit('lock-seat-success', { seatId, lockExpiry });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      socket.emit('lock-seat-error', { error: 'Failed to lock seat', seatId });
    } finally {
      client.release();
    }
  });

  // Unlock seat via WebSocket
  socket.on('unlock-seat', async ({ seatId, userId, showId }) => {
    try {
      const result = await pool.query(
        `UPDATE seats 
         SET status='AVAILABLE', locked_by=NULL, lock_expiry=NULL
         WHERE seat_id=$1 AND locked_by=$2
         RETURNING *`,
        [seatId, userId]
      );

      if (!result.rows.length) {
        socket.emit('unlock-seat-error', { error: 'Cannot unlock seat', seatId });
        return;
      }

      await redisClient.del(`seat_lock:${seatId}`);

      // Remove from session tracking
      const session = userSessions.get(socket.id);
      if (session) {
        session.lockedSeats.delete(seatId);
      }

      // Emit to all clients in the show room
      io.to(`show-${showId}`).emit('seat-unlocked', { seatId });

      socket.emit('unlock-seat-success', { seatId });
    } catch (err) {
      console.error(err);
      socket.emit('unlock-seat-error', { error: 'Failed to unlock seat', seatId });
    }
  });

  // Request current seat status
  socket.on('get-seats', async (showId) => {
    try {
      const result = await pool.query(
        'SELECT * FROM seats WHERE show_id = $1 ORDER BY seat_number',
        [showId]
      );
      socket.emit('seats-data', result.rows);
    } catch (err) {
      console.error(err);
      socket.emit('seats-error', { error: 'Failed to fetch seats' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);

    const session = userSessions.get(socket.id);

    // Unlock seats after 3 seconds of disconnect
    if (session && session.lockedSeats.size > 0) {
      console.log(`Scheduling seat unlock for disconnected user ${session.userId}`);
      setTimeout(() => {
        unlockUserSeats(session.userId, session.lockedSeats, session.showId);
      }, DISCONNECT_UNLOCK_DELAY);
    }

    // Clean up session
    userSessions.delete(socket.id);
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});