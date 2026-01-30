-- ==================== SHOWS TABLE ====================
CREATE TABLE IF NOT EXISTS shows (
    show_id SERIAL PRIMARY KEY,
    show_name VARCHAR(255) NOT NULL,
    show_time TIMESTAMP NOT NULL,
    total_seats INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== SEATS TABLE ====================
CREATE TABLE IF NOT EXISTS seats (
    seat_id SERIAL PRIMARY KEY,
    show_id INTEGER REFERENCES shows(show_id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'LOCKED', 'BOOKED')),
    
    -- Locking information (temporary holds)
    locked_by VARCHAR(100),
    lock_expiry TIMESTAMP,
    
    -- Booking information (permanent bookings)
    booked_by VARCHAR(100),
    booked_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(show_id, seat_number)
);

-- ==================== BOOKINGS TABLE ====================
CREATE TABLE IF NOT EXISTS bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    show_id INTEGER REFERENCES shows(show_id) ON DELETE CASCADE,
    seat_ids INTEGER[] NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED')),
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Additional booking details
    ticket_price DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    convenience_fee DECIMAL(10,2)
);

-- ==================== INDEXES ====================
-- Improve query performance
CREATE INDEX IF NOT EXISTS idx_seats_show_id ON seats(show_id);
CREATE INDEX IF NOT EXISTS idx_seats_status ON seats(status);
CREATE INDEX IF NOT EXISTS idx_seats_locked_by ON seats(locked_by);
CREATE INDEX IF NOT EXISTS idx_seats_booked_by ON seats(booked_by);
CREATE INDEX IF NOT EXISTS idx_seats_lock_expiry ON seats(lock_expiry);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_show_id ON bookings(show_id);

-- ==================== COMMENTS ====================
-- Document the schema
COMMENT ON TABLE shows IS 'Stores movie show information';
COMMENT ON TABLE seats IS 'Stores seat information with locking and booking status';
COMMENT ON TABLE bookings IS 'Stores confirmed booking records';

COMMENT ON COLUMN seats.status IS 'AVAILABLE: seat can be selected, LOCKED: temporarily held, BOOKED: permanently booked';
COMMENT ON COLUMN seats.locked_by IS 'User ID who has temporarily locked this seat';
COMMENT ON COLUMN seats.lock_expiry IS 'When the temporary lock expires';
COMMENT ON COLUMN seats.booked_by IS 'User ID who permanently booked this seat';
COMMENT ON COLUMN seats.booked_at IS 'Timestamp when seat was permanently booked';

-- ==================== SAMPLE DATA ====================
-- Insert sample shows
INSERT INTO shows (show_name, show_time, total_seats) 
VALUES 
    ('Avengers: Endgame', '2026-02-01 18:00:00', 50),
    ('Spider-Man: No Way Home', '2026-02-01 21:00:00', 50),
    ('The Dark Knight', '2026-02-02 19:00:00', 50)
ON CONFLICT DO NOTHING;

-- Insert sample seats for all shows
DO $$
DECLARE
    show_record RECORD;
    i INTEGER;
    row_letter CHAR(1);
    seat_num INTEGER;
BEGIN
    -- Loop through each show
    FOR show_record IN SELECT show_id, total_seats FROM shows LOOP
        -- Generate seats with row letters (A, B, C, etc.)
        FOR i IN 1..show_record.total_seats LOOP
            -- Calculate row letter (A-J for 50 seats, 5 seats per row)
            row_letter := CHR(65 + ((i - 1) / 5));
            -- Calculate seat number within the row (1-5)
            seat_num := ((i - 1) % 5) + 1;
            
            -- Insert seat with format like "A1", "A2", "B1", etc.
            INSERT INTO seats (show_id, seat_number, status) 
            VALUES (show_record.show_id, row_letter || seat_num, 'AVAILABLE')
            ON CONFLICT (show_id, seat_number) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;


CREATE OR REPLACE FUNCTION unlock_expired_seats()
RETURNS INTEGER AS $$
DECLARE
    unlocked_count INTEGER;
BEGIN
    UPDATE seats 
    SET status = 'AVAILABLE', 
        locked_by = NULL, 
        lock_expiry = NULL
    WHERE status = 'LOCKED' 
      AND lock_expiry < NOW();
    
    GET DIAGNOSTICS unlocked_count = ROW_COUNT;
    RETURN unlocked_count;
END;
$$ LANGUAGE plpgsql;



DO $$
DECLARE
    shows_count INTEGER;
    seats_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO shows_count FROM shows;
    SELECT COUNT(*) INTO seats_count FROM seats;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Database Setup Complete!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Shows created: %', shows_count;
    RAISE NOTICE 'Seats created: %', seats_count;
    RAISE NOTICE '========================================';
    
    IF shows_count = 0 THEN
        RAISE WARNING 'No shows found! Run the INSERT statements above.';
    END IF;
    
    IF seats_count = 0 THEN
        RAISE WARNING 'No seats found! Run the seat generation script above.';
    END IF;
END $$;