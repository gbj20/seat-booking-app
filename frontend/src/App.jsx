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

  // Group seats by row
  const groupedSeats = seats.reduce((acc, seat) => {
    const row = seat.row_name || seat.seat_number.charAt(0);
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  // Group rows by section
  const sections = {
    RECLINER: ['L', 'K'],
    PRIME_PLUS: ['J', 'H', 'G', 'F', 'E', 'D', 'C'],
    CLASSIC: ['B', 'A']
  };

  // Get section info
  const getSectionInfo = (sectionName) => {
    const sectionSeats = seats.filter(s => s.section === sectionName);
    if (sectionSeats.length === 0) return null;
    const price = sectionSeats[0].price || 0;
    return { price, name: sectionName };
  };

  // Render a single row with proper spacing
  const renderRow = (row) => {
    const rowSeats = groupedSeats[row] || [];
    if (rowSeats.length === 0) return null;

    // Sort seats by number
    const sortedSeats = rowSeats.sort((a, b) => {
      const numA = parseInt(a.seat_number.replace(/[A-Z]/g, ''));
      const numB = parseInt(b.seat_number.replace(/[A-Z]/g, ''));
      return numA - numB;
    });

    // Find gaps in seat numbers for spacing
    const seatElements = [];
    let prevNum = 0;

    sortedSeats.forEach((seat, index) => {
      const currentNum = parseInt(seat.seat_number.replace(/[A-Z]/g, ''));
      
      // Add gap if there's a jump in seat numbers
      if (prevNum > 0 && currentNum - prevNum > 1) {
        const gapSize = currentNum - prevNum - 1;
        seatElements.push(
          <div 
            key={`gap-${row}-${prevNum}`} 
            className="seat-gap"
            style={{ width: `${gapSize * 58}px` }}
          />
        );
      }

      seatElements.push(
        <button
          key={seat.seat_id}
          onClick={() => onSeatClick(seat)}
          disabled={
            seat.status === 'BOOKED' ||
            (seat.status === 'LOCKED' && seat.locked_by !== userId)
          }
          className={`seat-button ${getSeatClass(seat)}`}
          title={`${seat.seat_number} - ₹${seat.price || 0}`}
        >
          {seat.seat_number.replace(/[A-Z]/g, '')}
        </button>
      );

      prevNum = currentNum;
    });

    return (
      <div key={row} className="seat-row">
        <div className="row-label">{row}</div>
        <div className="seats-container">
          {seatElements}
        </div>
      </div>
    );
  };

  return (
    <div className="seat-grid-container">
      <div className="screen-section">
        <div className="screen-wrapper">
          <div className="screen-text">SCREEN</div>
        </div>
      </div>

      <div className="seats-wrapper">
        {/* RECLINER SECTION */}
        {getSectionInfo('RECLINER') && (
          <div className="section-group">
            <div className="section-header">
              <span className="section-name">₹{getSectionInfo('RECLINER').price} RECLINER ROWS</span>
            </div>
            {sections.RECLINER.map(row => renderRow(row))}
          </div>
        )}

        {/* PRIME PLUS SECTION */}
        {getSectionInfo('PRIME_PLUS') && (
          <div className="section-group">
            <div className="section-header">
              <span className="section-name">₹{getSectionInfo('PRIME_PLUS').price} PRIME PLUS ROWS</span>
            </div>
            {sections.PRIME_PLUS.map(row => renderRow(row))}
          </div>
        )}

        {/* CLASSIC SECTION */}
        {getSectionInfo('CLASSIC') && (
          <div className="section-group">
            <div className="section-header">
              <span className="section-name">₹{getSectionInfo('CLASSIC').price} CLASSIC ROWS</span>
            </div>
            {sections.CLASSIC.map(row => renderRow(row))}
          </div>
        )}
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

function BookingSummary({ summary, seats, onConfirm, onCancel, showDetails }) {
  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        <h2 className="modal-title">Booking Summary</h2>
        <p className="modal-subtitle">Review your seat selection</p>

        {/* Show Details */}
        {showDetails && (
          <div className="show-details-box">
            <h4 className="show-details-heading">🎬 {showDetails.show_name}</h4>
            <p className="show-time">📅 {new Date(showDetails.show_time).toLocaleString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        )}

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
            <span>Seats ({summary.seatCount}):</span>
            <span className="price-value">₹{summary.subtotal.toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span>Tax ({summary.taxPercent}%):</span>
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
  const previousShowRef = useRef(null);

  useEffect(() => {
    fetchShows();
  }, []);

  // Socket.IO Connection
  useEffect(() => {
    if (!selectedShow) return;

    const connectSocket = () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

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
        socket.emit('register-user', { userId });
        socket.emit('join-show', selectedShow);
        socket.emit('get-seats', selectedShow);
      });

      socket.on('seats-data', (eventData) => {
        setSeats(eventData);
      });

      socket.on('seat-locked', (eventData) => {
        setSeats(prev => prev.map(s =>
          s.seat_id === eventData.seatId
            ? { ...s, status: 'LOCKED', locked_by: eventData.userId }
            : s
        ));

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

      socket.on('seats-booked', (eventData) => {
        setSeats(prev => prev.map(s =>
          eventData.seatIds.includes(s.seat_id)
            ? { ...s, status: 'BOOKED', locked_by: null, lock_expiry: null }
            : s
        ));

        if (eventData.userId === userId) {
          setSelectedSeats([]);
        }
      });

      socket.on('lock-seat-success', (eventData) => {
        console.log('Seat locked successfully:', eventData.seatId);
      });

      socket.on('lock-seat-error', (eventData) => {
        showMessage(eventData.error || 'Failed to lock seat', 'error');
        setSeats(prev => prev.map(s =>
          s.seat_id === eventData.seatId
            ? { ...s, status: 'AVAILABLE', locked_by: null }
            : s
        ));
        setSelectedSeats(prev => prev.filter(id => id !== eventData.seatId));
      });

      socket.on('unlock-seat-success', (eventData) => {
        console.log('Seat unlocked successfully:', eventData.seatId);
      });

      socket.on('unlock-seat-error', (eventData) => {
        showMessage(eventData.error || 'Failed to unlock seat', 'error');
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
      });

      socket.on('reconnect', (attemptNumber) => {
        console.log('Reconnected after', attemptNumber, 'attempts');
        showMessage('Reconnected to server', 'success');
      });

      socket.on('reconnect_failed', () => {
        showMessage('Connection lost. Please refresh the page.', 'error');
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
      // Leave previous show room if exists
      if (previousShowRef.current && socketRef.current?.connected) {
        socketRef.current.emit('leave-show', previousShowRef.current);
      }

      setSelectedShow(showId);
      previousShowRef.current = showId;

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

    if (seat.status === 'LOCKED' && seat.locked_by === userId) {
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
      
      if (response.ok) {
        setSummary(data);
        setShowSummary(true);
      } else {
        showMessage(data.error || 'Failed to generate summary', 'error');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      showMessage('Failed to generate summary', 'error');
    }
  };

  const handleConfirmBooking = async (paymentSuccess) => {
    try {
      const response = await fetch(`${API_URL}/book-seats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          seatIds: selectedSeats, 
          userId, 
          paymentSuccess 
        })
      });
      
      const data = await response.json();

      if (data.success) {
        showMessage(`✅ ${data.message}`, 'success');
        setSelectedSeats([]);
        setShowSummary(false);
        setSummary(null);
        
        if (socketRef.current?.connected) {
          socketRef.current.emit('get-seats', selectedShow);
        }
      } else {
        showMessage(`❌ ${data.message}`, 'error');
        setShowSummary(false);
        setSummary(null);
      }
    } catch (error) {
      console.error('Error booking seats:', error);
      showMessage('Booking failed', 'error');
      setShowSummary(false);
      setSummary(null);
    }
  };

  const handleCancelBooking = () => {
    setShowSummary(false);
    setSummary(null);
  };

  // Get current show details
  const getCurrentShowDetails = () => {
    return shows.find(show => show.show_id === selectedShow);
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
            onCancel={handleCancelBooking}
            showDetails={getCurrentShowDetails()}
          />
        )}
      </div>
    </div>
  );
}

export default App;
