import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const API_URL = 'http://localhost:5000/api';
const WS_URL = 'http://localhost:5000';

function SeatGrid({ seats, onSeatClick, userId }) {
  const getSeatClass = (seat) => {
    if (seat.status === 'AVAILABLE') return 'seat-available';
    if (seat.status === 'LOCKED' && seat.locked_by === userId) return 'seat-selected';
    if (seat.status === 'LOCKED') return 'seat-locked';
    if (seat.status === 'BOOKED') return 'seat-booked';
    return 'seat-default';
  };

  const groupedSeats = seats.reduce((acc, seat) => {
    const row = seat.seat_number.charAt(0);
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  return (
    <div className="seat-grid-container">
      <div className="screen-section">
        <div className="screen-wrapper">
          <div className="screen-text">SCREEN</div>
        </div>
      </div>

      <div className="seats-wrapper">
        {Object.keys(groupedSeats).sort().map((row) => (
          <div key={row} className="seat-row">
            <div className="row-label">{row}</div>
            <div className="seats-container">
              {groupedSeats[row]
                .sort((a, b) => {
                  const numA = parseInt(a.seat_number.slice(1));
                  const numB = parseInt(b.seat_number.slice(1));
                  return numA - numB;
                })
                .map(seat => (
                  <button
                    key={seat.seat_id}
                    onClick={() => onSeatClick(seat)}
                    disabled={
                      seat.status === 'BOOKED' ||
                      (seat.status === 'LOCKED' && seat.locked_by !== userId)
                    }
                    className={`seat-button ${getSeatClass(seat)}`}
                  >
                    {seat.seat_number.slice(1)}
                  </button>
                ))}
            </div>
            <div className="row-spacer"></div>
          </div>
        ))}
      </div>

      <div className="legend-container">
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-box legend-available"></div>
            <span className="legend-label">Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-box legend-selected"></div>
            <span className="legend-label">Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-box legend-sold"></div>
            <span className="legend-label">Sold</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingSummary({ summary, seats, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        <h2 className="modal-title">Booking Summary</h2>
        <p className="modal-subtitle">Review your seat selection</p>

        <div className="selected-seats-box">
          <h4 className="seats-heading">Selected Seats:</h4>
          <div className="seats-badges">
            {seats.map(s => (
              <span key={s.seat_id} className="seat-badge">
                {s.seat_number}
              </span>
            ))}
          </div>
        </div>

        <div className="pricing-details">
          <div className="price-row">
            <span>Ticket Price (₹{summary.ticketPrice} × {summary.seatCount}):</span>
            <span className="price-value">₹{summary.subtotal.toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span>Tax ({((summary.tax / summary.subtotal) * 100).toFixed(0)}%):</span>
            <span className="price-value">₹{summary.tax.toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span>Convenience Fee:</span>
            <span className="price-value">₹{summary.convenienceFee.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Total Amount:</span>
            <span className="total-amount">₹{summary.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={() => onConfirm(true)} className="btn-confirm">
            Confirm Payment
          </button>
          <button onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
        </div>

        <p className="payment-note">
          Click "Confirm Payment" to simulate successful payment
        </p>
      </div>
    </div>
  );
}

function App() {
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    fetchShows();
  }, []);

  // Socket.IO Connection
  useEffect(() => {
    if (!selectedShow) return;

    const connectSocket = () => {
      // Clean up existing connection
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      // Create Socket.IO connection
      const socket = io(WS_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: maxReconnectAttempts,
        timeout: 20000,
        autoConnect: true,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Socket.IO Connected:', socket.id);
        reconnectAttempts.current = 0;

        // Register user
        socket.emit('register-user', { userId });

        // Join show room
        socket.emit('join-show', selectedShow);
        console.log('Joined show:', selectedShow);

        // Request current seats
        socket.emit('get-seats', selectedShow);
      });

      socket.on('seats-data', (eventData) => {
        setSeats(eventData);
      });

      socket.on('seat-locked', (eventData) => {
        // Immediately update UI
        setSeats(prev => prev.map(s =>
          s.seat_id === eventData.seatId
            ? { ...s, status: 'LOCKED', locked_by: eventData.userId }
            : s
        ));

        // If current user locked it, add to selectedSeats
        if (eventData.userId === userId) {
          setSelectedSeats(prev =>
            prev.includes(eventData.seatId) ? prev : [...prev, eventData.seatId]
          );
        }
      });

      socket.on('seat-unlocked', (eventData) => {
        setSeats(prev => prev.map(s =>
          s.seat_id === eventData.seatId
            ? { ...s, status: 'AVAILABLE', locked_by: null }
            : s
        ));

        setSelectedSeats(prev => prev.filter(id => id !== eventData.seatId));
      });

      socket.on('seats-unlocked-bulk', (eventData) => {
        setSeats(prev => prev.map(s =>
          eventData.seatIds.includes(s.seat_id)
            ? { ...s, status: 'AVAILABLE', locked_by: null }
            : s
        ));

        setSelectedSeats(prev =>
          prev.filter(id => !eventData.seatIds.includes(id))
        );
      });

      socket.on('lock-seat-success', (eventData) => {
        // Seat already updated optimistically
        console.log('Seat locked successfully:', eventData.seatId);
      });

      socket.on('lock-seat-error', (eventData) => {
        showMessage(eventData.error || 'Failed to lock seat', 'error');
        // Revert optimistic update
        setSeats(prev => prev.map(s =>
          s.seat_id === eventData.seatId
            ? { ...s, status: 'AVAILABLE', locked_by: null }
            : s
        ));
        setSelectedSeats(prev => prev.filter(id => id !== eventData.seatId));
      });

      socket.on('unlock-seat-success', (eventData) => {
        // Seat already updated optimistically
        console.log('Seat unlocked successfully:', eventData.seatId);
      });

      socket.on('unlock-seat-error', (eventData) => {
        showMessage(eventData.error || 'Failed to unlock seat', 'error');
        // Revert optimistic update
        setSeats(prev => prev.map(s =>
          s.seat_id === eventData.seatId
            ? { ...s, status: 'LOCKED', locked_by: userId }
            : s
        ));
        setSelectedSeats(prev => 
          prev.includes(eventData.seatId) ? prev : [...prev, eventData.seatId]
        );
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket.IO disconnected:', reason);
        
        // Only try to reconnect if it wasn't a manual disconnect
        if (reason === 'io server disconnect' || reason === 'io client disconnect') {
          // Manual disconnect, don't reconnect
          console.log('Manual disconnect, not reconnecting');
        } else {
          // Network issue or other problem, will auto-reconnect
          console.log('Connection lost, will attempt to reconnect...');
        }
      });

      socket.on('reconnect', (attemptNumber) => {
        console.log('Reconnected after', attemptNumber, 'attempts');
        showMessage('Reconnected to server', 'success');
      });

      socket.on('reconnect_attempt', (attemptNumber) => {
        console.log('Reconnection attempt:', attemptNumber);
        reconnectAttempts.current = attemptNumber;
      });

      socket.on('reconnect_error', (error) => {
        console.error('Reconnection error:', error);
      });

      socket.on('reconnect_failed', () => {
        console.error('Failed to reconnect after maximum attempts');
        showMessage('Connection lost. Please refresh the page.', 'error');
      });

      socket.on('seats-error', (eventData) => {
        console.error('Seats error:', eventData.error);
        showMessage('Failed to fetch seats', 'error');
      });
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedShow, userId]);

  const fetchShows = async () => {
    try {
      const response = await fetch(`${API_URL}/shows`);
      const data = await response.json();
      setShows(data);
      if (data.length > 0) {
        selectShow(data[0].show_id);
      }
    } catch (error) {
      console.error('Error fetching shows:', error);
      showMessage('Failed to load shows', 'error');
    }
  };

  const selectShow = async (showId) => {
    try {
      setSelectedShow(showId);
      const response = await fetch(`${API_URL}/seats/${showId}`);
      const data = await response.json();
      setSeats(data);
      setSelectedSeats([]);
      setShowSummary(false);
    } catch (error) {
      console.error('Error fetching seats:', error);
      showMessage('Failed to load seats', 'error');
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleSeatClick = async (seat) => {
    if (!socketRef.current || !socketRef.current.connected) {
      showMessage('Not connected to server. Reconnecting...', 'error');
      return;
    }

    if (seat.status === 'BOOKED') {
      showMessage('This seat is already booked', 'error');
      return;
    }

    if (seat.status === 'LOCKED' && seat.locked_by !== userId) {
      showMessage('This seat is locked by another user', 'warning');
      return;
    }

    // Optimistic UI update - immediately show as selected/unlocked
    if (seat.status === 'LOCKED' && seat.locked_by === userId) {
      // Unlock seat
      setSeats(prev => prev.map(s =>
        s.seat_id === seat.seat_id
          ? { ...s, status: 'AVAILABLE', locked_by: null }
          : s
      ));
      setSelectedSeats(prev => prev.filter(id => id !== seat.seat_id));

      socketRef.current.emit('unlock-seat', {
        seatId: seat.seat_id,
        userId: userId,
        showId: selectedShow
      });
    } else if (seat.status === 'AVAILABLE') {
      // Lock seat
      setSeats(prev => prev.map(s =>
        s.seat_id === seat.seat_id
          ? { ...s, status: 'LOCKED', locked_by: userId }
          : s
      ));
      setSelectedSeats(prev => [...prev, seat.seat_id]);

      socketRef.current.emit('lock-seat', {
        seatId: seat.seat_id,
        userId: userId,
        showId: selectedShow
      });
    }
  };

  const handleProceedToSummary = async () => {
    if (selectedSeats.length === 0) {
      showMessage('Please select at least one seat', 'warning');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/booking-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatIds: selectedSeats })
      });
      const data = await response.json();
      setSummary(data);
      setShowSummary(true);
    } catch (error) {
      showMessage('Failed to generate summary', 'error');
    }
  };

  const handleConfirmBooking = async (paymentSuccess) => {
    try {
      const response = await fetch(`${API_URL}/book-seats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatIds: selectedSeats, userId, paymentSuccess })
      });
      const data = await response.json();

      if (data.success) {
        showMessage(`✅ ${data.message}`, 'success');
        setSelectedSeats([]);
        setShowSummary(false);
      } else {
        showMessage(`❌ ${data.message}`, 'error');
        setSelectedSeats([]);
        setShowSummary(false);
      }
    } catch (error) {
      showMessage('Booking failed', 'error');
    }
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <h1 className="app-title">🎬 Cinema Seat Booking</h1>
        <p className="user-info">
          User ID: <span className="user-id-badge">{userId}</span>
        </p>

        {message && (
          <div className={`notification notification-${messageType}`}>
            {message}
          </div>
        )}

        <div className="show-selection">
          <h3 className="section-title">Select Show:</h3>
          <div className="show-buttons">
            {shows.map(show => (
              <button
                key={show.show_id}
                onClick={() => selectShow(show.show_id)}
                className={`show-button ${selectedShow === show.show_id ? 'active' : ''}`}
              >
                {show.show_name} - {new Date(show.show_time).toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {!showSummary ? (
          <>
            <SeatGrid
              seats={seats}
              onSeatClick={handleSeatClick}
              userId={userId}
            />

            {selectedSeats.length > 0 && (
              <div className="proceed-section">
                <p className="seats-count">
                  {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected
                </p>
                <button onClick={handleProceedToSummary} className="proceed-button">
                  Proceed to Payment →
                </button>
              </div>
            )}
          </>
        ) : (
          <BookingSummary
            summary={summary}
            seats={seats.filter(s => selectedSeats.includes(s.seat_id))}
            onConfirm={handleConfirmBooking}
            onCancel={() => setShowSummary(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;