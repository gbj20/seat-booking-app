// // // import React, { useState, useEffect, useRef } from 'react';
// // // import { MapPin, Clock, Search, Share2, ChevronLeft, ZoomIn, ZoomOut, Star, Calendar, Film, Users, Tag, Award, TrendingUp, Sparkles, CreditCard, Ticket, X, Check, Bell, Heart } from 'lucide-react';
// // // import './App.css';

// // // const API_URL = 'http://localhost:5000';
// // // const WS_URL = 'ws://localhost:5000';
// // // const USER_ID = 'USER_' + Math.random().toString(36).substr(2, 9);

// // // // Header Component
// // // const Header = ({ selectedCity, onCityClick }) => {
// // //   return (
// // //     <header className="main-header">
// // //       <div className="header-wrap">
// // //         <div className="brand-area">
// // //           <div className="brand-logo">
// // //             <Film className="logo-svg" size={30} />
// // //             <div className="brand-info">
// // //               <span className="brand-title">CinePass</span>
// // //               <span className="brand-sub">Book Smarter</span>
// // //             </div>
// // //           </div>
// // //         </div>
        
// // //         <div className="header-actions">
// // //           <button className="location-selector" onClick={onCityClick}>
// // //             <MapPin size={17} />
// // //             <span>{selectedCity || 'Choose Location'}</span>
// // //           </button>
// // //           <button className="notify-btn">
// // //             <Bell size={18} />
// // //           </button>
// // //           <button className="auth-btn">Login</button>
// // //         </div>
// // //       </div>
// // //     </header>
// // //   );
// // // };

// // // // City Selector Modal
// // // const CitySelector = ({ isOpen, onClose, onSelectCity }) => {
// // //   const [searchTerm, setSearchTerm] = useState('');
  
// // //   const cities = [
// // //     { name: 'San Francisco', icon: '🌉', popular: true },
// // //     { name: 'New York', icon: '🗽', popular: true },
// // //     { name: 'Los Angeles', icon: '🌴', popular: true },
// // //     { name: 'Chicago', icon: '🏙️', popular: true },
// // //     { name: 'Seattle', icon: '☕', popular: true },
// // //     { name: 'Austin', icon: '🎸', popular: true },
// // //     { name: 'Miami', icon: '🏖️', popular: false },
// // //     { name: 'Boston', icon: '🦞', popular: false },
// // //     { name: 'Portland', icon: '🌲', popular: false },
// // //     { name: 'Denver', icon: '⛰️', popular: false }
// // //   ];

// // //   const filteredCities = cities.filter(city =>
// // //     city.name.toLowerCase().includes(searchTerm.toLowerCase())
// // //   );

// // //   if (!isOpen) return null;

// // //   return (
// // //     <div className="modal-backdrop">
// // //       <div className="city-selector">
// // //         <div className="selector-header">
// // //           <h2 className="selector-title">Select Your City</h2>
// // //           <button className="close-modal" onClick={onClose}>
// // //             <X size={22} />
// // //           </button>
// // //         </div>
        
// // //         <div className="search-box">
// // //           <Search className="search-ico" size={19} />
// // //           <input
// // //             type="text"
// // //             placeholder="Search cities..."
// // //             value={searchTerm}
// // //             onChange={(e) => setSearchTerm(e.target.value)}
// // //             className="search-input"
// // //           />
// // //         </div>
        
// // //         <button className="detect-location">
// // //           <MapPin size={17} />
// // //           Use My Location
// // //         </button>

// // //         <div className="cities-block">
// // //           <h3 className="block-title">
// // //             <TrendingUp size={15} />
// // //             Popular Cities
// // //           </h3>
// // //           <div className="cities-grid">
// // //             {filteredCities.filter(c => c.popular).map((city) => (
// // //               <button
// // //                 key={city.name}
// // //                 onClick={() => {
// // //                   onSelectCity(city.name);
// // //                   onClose();
// // //                 }}
// // //                 className="city-card"
// // //               >
// // //                 <span className="city-emoji">{city.icon}</span>
// // //                 <span className="city-text">{city.name}</span>
// // //               </button>
// // //             ))}
// // //           </div>
// // //         </div>

// // //         {filteredCities.filter(c => !c.popular).length > 0 && (
// // //           <div className="cities-block">
// // //             <h3 className="block-title">Other Cities</h3>
// // //             <div className="cities-simple">
// // //               {filteredCities.filter(c => !c.popular).map((city) => (
// // //                 <button
// // //                   key={city.name}
// // //                   onClick={() => {
// // //                     onSelectCity(city.name);
// // //                     onClose();
// // //                   }}
// // //                   className="city-simple-item"
// // //                 >
// // //                   <span className="city-emoji">{city.icon}</span>
// // //                   <span>{city.name}</span>
// // //                 </button>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // Movie Details Component
// // // const MovieDetails = ({ movie, onBookTickets, selectedCity }) => {
// // //   const [isCityModalOpen, setIsCityModalOpen] = useState(false);
// // //   const [isFavorite, setIsFavorite] = useState(false);
  
// // //   return (
// // //     <>
// // //       <Header selectedCity={selectedCity} onCityClick={() => setIsCityModalOpen(true)} />
      
// // //       <div className="hero-section">
// // //         <div className="hero-bg">
// // //           <img src={movie.poster} alt={movie.name} />
// // //           <div className="hero-grad"></div>
// // //         </div>
        
// // //         <div className="hero-content">
// // //           <div className="poster-area">
// // //             <div className="poster-frame">
// // //               <img src={movie.poster} alt={movie.name} />
// // //               <div className="now-showing">
// // //                 <Sparkles size={13} />
// // //                 Now Showing
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="movie-info">
// // //             <div className="info-header">
// // //               <h1 className="movie-name">{movie.name}</h1>
// // //               <div className="action-btns">
// // //                 <button 
// // //                   className={`fav-btn ${isFavorite ? 'active' : ''}`}
// // //                   onClick={() => setIsFavorite(!isFavorite)}
// // //                 >
// // //                   <Heart size={17} fill={isFavorite ? '#ef4444' : 'none'} />
// // //                 </button>
// // //                 <button className="share-icon">
// // //                   <Share2 size={17} />
// // //                 </button>
// // //               </div>
// // //             </div>
            
// // //             <div className="rating-bar">
// // //               <div className="rating-badge">
// // //                 <Star className="star-fill" size={17} fill="#f59e0b" />
// // //                 <span className="rating-val">8.9</span>
// // //                 <span className="rating-cnt">/10 (187K)</span>
// // //               </div>
// // //               <div className="watching-badge">
// // //                 <Users size={15} />
// // //                 <span>{movie.interested} Watching</span>
// // //               </div>
// // //             </div>

// // //             <div className="meta-info">
// // //               <div className="meta-item">
// // //                 <Clock size={15} />
// // //                 <span>{movie.duration}</span>
// // //               </div>
// // //               <div className="meta-item">
// // //                 <Tag size={15} />
// // //                 <span>{movie.certificate}</span>
// // //               </div>
// // //               <div className="meta-item">
// // //                 <Calendar size={15} />
// // //                 <span>{movie.releaseDate}</span>
// // //               </div>
// // //             </div>

// // //             <div className="genres-wrap">
// // //               {movie.genres.map((genre) => (
// // //                 <span key={genre} className="genre-badge">{genre}</span>
// // //               ))}
// // //             </div>

// // //             <div className="formats-wrap">
// // //               <span className="formats-label">Available in:</span>
// // //               <div className="formats-list">
// // //                 {movie.formats.map((format) => (
// // //                   <span key={format} className="format-tag">{format}</span>
// // //                 ))}
// // //                 <span className="format-tag language">{movie.language}</span>
// // //               </div>
// // //             </div>

// // //             <button className="book-btn" onClick={onBookTickets}>
// // //               <Ticket size={19} />
// // //               Book Tickets Now
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>
      
// // //       <CitySelector
// // //         isOpen={isCityModalOpen}
// // //         onClose={() => setIsCityModalOpen(false)}
// // //         onSelectCity={() => {}}
// // //       />
// // //     </>
// // //   );
// // // };

// // // // Seat Count Selector
// // // const SeatCountSelector = ({ isOpen, onClose, onSelectSeats, pricingTiers }) => {
// // //   const [count, setCount] = useState(2);

// // //   if (!isOpen) return null;

// // //   return (
// // //     <div className="modal-backdrop">
// // //       <div className="seat-selector-modal">
// // //         <button className="close-modal" onClick={onClose}>
// // //           <X size={22} />
// // //         </button>
        
// // //         <div className="selector-icon">
// // //           <Users size={50} className="users-svg" />
// // //         </div>
        
// // //         <h2 className="selector-title">Select Number of Seats</h2>
// // //         <p className="selector-subtitle">How many tickets do you need?</p>

// // //         <div className="count-selector">
// // //           {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
// // //             <button
// // //               key={num}
// // //               onClick={() => setCount(num)}
// // //               className={`count-btn ${count === num ? 'selected' : ''}`}
// // //             >
// // //               {num}
// // //             </button>
// // //           ))}
// // //         </div>

// // //         <div className="pricing-box">
// // //           <div className="pricing-title">
// // //             <Award size={17} />
// // //             <span>Ticket Pricing</span>
// // //           </div>
// // //           {pricingTiers.map((tier) => (
// // //             <div key={tier.name} className="pricing-row">
// // //               <div className="tier-details">
// // //                 <span className="tier-label">{tier.name}</span>
// // //                 <span className={`tier-badge ${tier.status.toLowerCase().replace(' ', '-')}`}>
// // //                   {tier.status}
// // //                 </span>
// // //               </div>
// // //               <span className="tier-cost">${tier.price}</span>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         <button className="proceed-selection" onClick={() => onSelectSeats(count)}>
// // //           Continue
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // Seat Layout Component
// // // const SeatLayout = ({ seats, myLockedSeats, onSeatClick, pricingTiers, timeRemaining, onProceed }) => {
// // //   const [zoom, setZoom] = useState(1);

// // //   const groupedSeats = seats.reduce((acc, seat) => {
// // //     const row = seat.seat_number[0];
// // //     if (!acc[row]) acc[row] = [];
// // //     acc[row].push(seat);
// // //     return acc;
// // //   }, {});

// // //   const getSeatClass = (seat) => {
// // //     if (seat.status === 'BOOKED') return 'seat-taken';
// // //     if (myLockedSeats.has(seat.seat_number)) return 'seat-mine';
// // //     if (seat.status === 'LOCKED') return 'seat-hold';
// // //     return 'seat-free';
// // //   };

// // //   const getTierForRow = (row) => {
// // //     if (['L', 'K'].includes(row)) return pricingTiers[0];
// // //     if (['J', 'I', 'H', 'G', 'F', 'E', 'D', 'C'].includes(row)) return pricingTiers[1];
// // //     return pricingTiers[2];
// // //   };

// // //   return (
// // //     <div className="seating-page">
// // //       <div className="seating-header">
// // //         <div className="seating-header-content">
// // //           <button className="nav-button">
// // //             <ChevronLeft size={21} />
// // //           </button>
// // //           <div className="current-show">
// // //             <h2 className="show-name">Stellar Odyssey - English</h2>
// // //             <p className="show-info">Regal Cinema Downtown • Fri, 25 Jan 2026 • 02:30 PM</p>
// // //           </div>
// // //           {myLockedSeats.size > 0 && (
// // //             <div className="time-counter">
// // //               <Clock size={17} />
// // //               <span className="counter-text">
// // //                 {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
// // //               </span>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       <div className="times-strip">
// // //         <div className="times-scroll">
// // //           {['11:00 AM', '02:30 PM', '03:45 PM', '05:00 PM', '06:30 PM', '07:45 PM', '09:15 PM', '10:30 PM'].map((time, idx) => (
// // //             <button
// // //               key={time}
// // //               className={`time-button ${idx === 1 ? 'active' : ''}`}
// // //             >
// // //               {time}
// // //             </button>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       <div className="zoom-panel">
// // //         <div className="zoom-label">Zoom View</div>
// // //         <button onClick={() => setZoom(Math.min(zoom + 0.1, 1.5))} className="zoom-button">
// // //           <ZoomIn size={19} />
// // //         </button>
// // //         <button onClick={() => setZoom(Math.max(zoom - 0.1, 0.7))} className="zoom-button">
// // //           <ZoomOut size={19} />
// // //         </button>
// // //       </div>

// // //       <div className="theater-area">
// // //         <div className="theater-seating" style={{ transform: `scale(${zoom})` }}>
// // //           <div className="screen-area">
// // //             <div className="screen-indicator">
// // //               <div className="screen-label">SCREEN</div>
// // //               <div className="screen-bar"></div>
// // //             </div>
// // //           </div>

// // //           {pricingTiers.map((tier) => {
// // //             const tierRows = Object.entries(groupedSeats).filter(([row]) => {
// // //               const t = getTierForRow(row);
// // //               return t.name === tier.name;
// // //             });

// // //             if (tierRows.length === 0) return null;

// // //             return (
// // //               <div key={tier.name} className="seating-tier">
// // //                 <div className="tier-heading">
// // //                   <span className="tier-info">${tier.price} • {tier.name}</span>
// // //                 </div>

// // //                 {tierRows.map(([row, rowSeats]) => (
// // //                   <div key={row} className="seat-row-container">
// // //                     <div className="row-marker">{row}</div>
// // //                     <div className="seats-in-row">
// // //                       {rowSeats.sort((a, b) => {
// // //                         const numA = parseInt(a.seat_number.slice(1));
// // //                         const numB = parseInt(b.seat_number.slice(1));
// // //                         return numA - numB;
// // //                       }).map((seat) => (
// // //                         <button
// // //                           key={seat.seat_id}
// // //                           onClick={() => onSeatClick(seat)}
// // //                           disabled={seat.status === 'BOOKED' || (seat.status === 'LOCKED' && !myLockedSeats.has(seat.seat_number))}
// // //                           className={`single-seat ${getSeatClass(seat)}`}
// // //                           title={`${seat.seat_number} - $${seat.price}`}
// // //                         >
// // //                           {seat.seat_number.slice(1)}
// // //                         </button>
// // //                       ))}
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             );
// // //           })}

// // //           <div className="legend-area">
// // //             <div className="legend-entry">
// // //               <div className="legend-box free"></div>
// // //               <span>Available</span>
// // //             </div>
// // //             <div className="legend-entry">
// // //               <div className="legend-box mine"></div>
// // //               <span>Selected</span>
// // //             </div>
// // //             <div className="legend-entry">
// // //               <div className="legend-box taken"></div>
// // //               <span>Booked</span>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {myLockedSeats.size > 0 && (
// // //         <div className="booking-footer">
// // //           <div className="booking-summary">
// // //             <div className="summary-details">
// // //               <div className="summary-label">
// // //                 {myLockedSeats.size} Seat{myLockedSeats.size > 1 ? 's' : ''} Selected
// // //               </div>
// // //               <div className="summary-seats">
// // //                 {Array.from(myLockedSeats).join(', ')}
// // //               </div>
// // //             </div>
// // //             <button className="payment-btn" onClick={onProceed}>
// // //               <CreditCard size={18} />
// // //               Pay ${myLockedSeats.size * 32}
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // // Main App
// // // export default function App() {
// // //   const [view, setView] = useState('city');
// // //   const [selectedCity, setSelectedCity] = useState('');
// // //   const [seatCount, setSeatCount] = useState(0);
// // //   const [seats, setSeats] = useState([]);
// // //   const [myLockedSeats, setMyLockedSeats] = useState(new Set());
// // //   const [timeRemaining, setTimeRemaining] = useState(600);
// // //   const [isConnected, setIsConnected] = useState(false);

// // //   const socketRef = useRef(null);
// // //   const timerRef = useRef(null);

// // //   const movie = {
// // //     name: 'Stellar Odyssey',
// // //     poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400',
// // //     interested: '425K+',
// // //     duration: '2h 38m',
// // //     genres: ['Sci-Fi', 'Adventure', 'Action'],
// // //     certificate: 'PG-13',
// // //     releaseDate: '25 Jan, 2026',
// // //     formats: ['IMAX 3D', 'Dolby Atmos', '4DX'],
// // //     language: 'English'
// // //   };

// // //   const pricingTiers = [
// // //     { name: 'VIP DELUXE', price: 50, status: 'SOLD OUT' },
// // //     { name: 'PREMIUM SEATS', price: 32, status: 'FILLING FAST' },
// // //     { name: 'STANDARD SEATS', price: 20, status: 'AVAILABLE' }
// // //   ];

// // //   const SHOW_ID = 'SHOW101';

// // //   useEffect(() => {
// // //     if (view !== 'seatLayout') return;

// // //     let reconnectTimeout;
// // //     let pingInterval;

// // //     const connectWebSocket = () => {
// // //       const ws = new WebSocket(`${WS_URL}/socket.io/?EIO=4&transport=websocket`);
// // //       socketRef.current = ws;

// // //       ws.onopen = () => {
// // //         setIsConnected(true);
// // //         ws.send('40');
// // //         setTimeout(() => ws.send(`42${JSON.stringify(['join_show', SHOW_ID])}`), 100);
        
// // //         pingInterval = setInterval(() => {
// // //           if (ws.readyState === WebSocket.OPEN) ws.send('2');
// // //         }, 25000);
// // //       };

// // //       ws.onmessage = (event) => {
// // //         const data = event.data;
// // //         if (data === '3' || data === '40') return;
        
// // //         if (data.startsWith('42')) {
// // //           try {
// // //             const [eventName, eventData] = JSON.parse(data.substring(2));
            
// // //             if (eventName === 'initial_seats') {
// // //               setSeats(eventData.seats);
// // //             } else if (eventName === 'seat_locked') {
// // //               setSeats(prev => prev.map(s =>
// // //                 s.seat_number === eventData.seat_number
// // //                   ? { ...s, status: 'LOCKED', locked_by: eventData.locked_by }
// // //                   : s
// // //               ));
// // //             } else if (eventName === 'seat_unlocked') {
// // //               setSeats(prev => prev.map(s =>
// // //                 s.seat_number === eventData.seat_number
// // //                   ? { ...s, status: 'AVAILABLE', locked_by: null }
// // //                   : s
// // //               ));
// // //             } else if (eventName === 'lock_success') {
// // //               setMyLockedSeats(prev => new Set([...prev, eventData.seat_number]));
// // //             } else if (eventName === 'unlock_success') {
// // //               setMyLockedSeats(prev => {
// // //                 const newSet = new Set(prev);
// // //                 newSet.delete(eventData.seat_number);
// // //                 return newSet;
// // //               });
// // //             }
// // //           } catch (e) {
// // //             console.error('Parse error:', e);
// // //           }
// // //         }
// // //       };

// // //       ws.onclose = () => {
// // //         setIsConnected(false);
// // //         clearInterval(pingInterval);
// // //         reconnectTimeout = setTimeout(connectWebSocket, 3000);
// // //       };
// // //     };

// // //     connectWebSocket();

// // //     return () => {
// // //       clearTimeout(reconnectTimeout);
// // //       clearInterval(pingInterval);
// // //       if (socketRef.current) socketRef.current.close();
// // //     };
// // //   }, [view]);

// // //   useEffect(() => {
// // //     if (myLockedSeats.size > 0) {
// // //       setTimeRemaining(600);
// // //       timerRef.current = setInterval(() => {
// // //         setTimeRemaining(prev => {
// // //           if (prev <= 1) {
// // //             clearInterval(timerRef.current);
// // //             return 0;
// // //           }
// // //           return prev - 1;
// // //         });
// // //       }, 1000);
// // //     } else {
// // //       if (timerRef.current) clearInterval(timerRef.current);
// // //     }

// // //     return () => {
// // //       if (timerRef.current) clearInterval(timerRef.current);
// // //     };
// // //   }, [myLockedSeats.size]);

// // //   const handleSeatClick = (seat) => {
// // //     if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

// // //     if (myLockedSeats.has(seat.seat_number)) {
// // //       socketRef.current.send(`42${JSON.stringify(['unlock_seat', {
// // //         show_id: SHOW_ID,
// // //         seat_number: seat.seat_number,
// // //         user_id: USER_ID
// // //       }])}`);
// // //     } else if (seat.status === 'AVAILABLE') {
// // //       socketRef.current.send(`42${JSON.stringify(['lock_seat', {
// // //         show_id: SHOW_ID,
// // //         seat_number: seat.seat_number,
// // //         user_id: USER_ID
// // //       }])}`);
// // //     }
// // //   };

// // //   return (
// // //     <div className="application">
// // //       {view === 'city' && (
// // //         <CitySelector
// // //           isOpen={true}
// // //           onClose={() => {}}
// // //           onSelectCity={(city) => {
// // //             setSelectedCity(city);
// // //             setView('movie');
// // //           }}
// // //         />
// // //       )}

// // //       {view === 'movie' && (
// // //         <MovieDetails
// // //           movie={movie}
// // //           selectedCity={selectedCity}
// // //           onBookTickets={() => setView('seatCount')}
// // //         />
// // //       )}

// // //       {view === 'seatCount' && (
// // //         <SeatCountSelector
// // //           isOpen={true}
// // //           onClose={() => setView('movie')}
// // //           onSelectSeats={(count) => {
// // //             setSeatCount(count);
// // //             setView('seatLayout');
// // //           }}
// // //           pricingTiers={pricingTiers}
// // //         />
// // //       )}

// // //       {view === 'seatLayout' && (
// // //         <SeatLayout
// // //           seats={seats}
// // //           myLockedSeats={myLockedSeats}
// // //           onSeatClick={handleSeatClick}
// // //           pricingTiers={pricingTiers}
// // //           timeRemaining={timeRemaining}
// // //           onProceed={() => alert('Redirecting to payment...')}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // import React, { useEffect, useState } from "react";
// // import socket from "./socket";
// // import { lockSeat, confirmBooking } from "./api";
// // import SeatGrid from "./SeatGrid";

// // const userId = Math.random().toString(36).slice(2);
// // const showId = "show1";

// // export default function App() {
// //   const [seats, setSeats] = useState(
// //     Array.from({ length: 20 }).map((_, i) => ({
// //       seatId: `A${i + 1}`,
// //       status: "AVAILABLE"
// //     }))
// //   );

// //   useEffect(() => {
// //     socket.emit("joinShow", showId);

// //     socket.on("seatLocked", ({ seatId }) =>
// //       updateSeat(seatId, "LOCKED")
// //     );

// //     socket.on("seatUnlocked", ({ seatId }) =>
// //       updateSeat(seatId, "AVAILABLE")
// //     );

// //     socket.on("seatBooked", ({ seatId }) =>
// //       updateSeat(seatId, "BOOKED")
// //     );
// //   }, []);

// //   const updateSeat = (seatId, status) => {
// //     setSeats(prev =>
// //       prev.map(s => (s.seatId === seatId ? { ...s, status } : s))
// //     );
// //   };

// //   const selectSeat = async seatId => {
// //     await lockSeat({ showId, seatId, userId });
// //     setTimeout(() => {
// //       confirmBooking({ showId, seatId, userId });
// //     }, 3000); // simulate payment
// //   };

// //   return (
// //     <div>
// //       <h2>Real-Time Seat Booking</h2>
// //       <SeatGrid seats={seats} onSelect={selectSeat} />
// //     </div>
// //   );
// // }
// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const API_URL = 'http://localhost:5000/api';
// const socket = io('http://localhost:5000');

// function SeatGrid({ seats, onSeatClick, userId }) {
//   const getSeatColor = (seat) => {
//     if (seat.status === 'AVAILABLE') return '#28a745';
//     if (seat.status === 'LOCKED' && seat.locked_by === userId) return '#ffc107';
//     if (seat.status === 'LOCKED') return '#ff9800';
//     if (seat.status === 'BOOKED') return '#dc3545';
//     return '#6c757d';
//   };

//   return (
//     <div style={{ marginTop: '20px' }}>
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(10, 1fr)',
//         gap: '10px',
//         maxWidth: '600px',
//         margin: '0 auto'
//       }}>
//         {seats.map(seat => (
//           <div
//             key={seat.seat_id}
//             onClick={() => onSeatClick(seat)}
//             style={{
//               width: '50px',
//               height: '50px',
//               backgroundColor: getSeatColor(seat),
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               borderRadius: '5px',
//               cursor: seat.status === 'BOOKED' ? 'not-allowed' : 'pointer',
//               fontWeight: 'bold',
//               fontSize: '12px',
//               transition: 'transform 0.2s'
//             }}
//             onMouseEnter={(e) => {
//               if (seat.status !== 'BOOKED') {
//                 e.currentTarget.style.transform = 'scale(1.1)';
//               }
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = 'scale(1)';
//             }}
//           >
//             {seat.seat_number}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function BookingSummary({ summary, seats, onConfirm, onCancel }) {
//   return (
//     <div style={{
//       maxWidth: '500px',
//       margin: '40px auto',
//       padding: '30px',
//       backgroundColor: 'white',
//       border: '2px solid #007bff',
//       borderRadius: '10px',
//       boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
//     }}>
//       <h2 style={{ textAlign: 'center', color: '#007bff' }}>Booking Summary</h2>

//       <div style={{ marginTop: '20px' }}>
//         <h4>Selected Seats:</h4>
//         <p>{seats.map(s => s.seat_number).join(', ')}</p>
//       </div>

//       <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//           <span>Ticket Price (₹{summary.ticketPrice} × {summary.seatCount}):</span>
//           <span>₹{summary.subtotal.toFixed(2)}</span>
//         </div>
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//           <span>Tax ({summary.tax / summary.subtotal * 100}%):</span>
//           <span>₹{summary.tax.toFixed(2)}</span>
//         </div>
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//           <span>Convenience Fee:</span>
//           <span>₹{summary.convenienceFee.toFixed(2)}</span>
//         </div>
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           marginTop: '15px',
//           paddingTop: '15px',
//           borderTop: '2px solid #007bff',
//           fontSize: '18px',
//           fontWeight: 'bold'
//         }}>
//           <span>Total Amount:</span>
//           <span>₹{summary.totalAmount.toFixed(2)}</span>
//         </div>
//       </div>

//       <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
//         <button
//           onClick={() => onConfirm(true)}
//           style={{
//             flex: 1,
//             padding: '15px',
//             backgroundColor: '#28a745',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             fontSize: '16px',
//             cursor: 'pointer',
//             fontWeight: 'bold'
//           }}
//         >
//           Confirm Payment
//         </button>
//         <button
//           onClick={onCancel}
//           style={{
//             flex: 1,
//             padding: '15px',
//             backgroundColor: '#6c757d',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             fontSize: '16px',
//             cursor: 'pointer'
//           }}
//         >
//           Cancel
//         </button>
//       </div>

//       <p style={{ marginTop: '15px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
//         Click "Confirm Payment" to simulate successful payment
//       </p>
//     </div>
//   );
// }

// function App() {
//   const [shows, setShows] = useState([]);
//   const [selectedShow, setSelectedShow] = useState(null);
//   const [seats, setSeats] = useState([]);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
//   const [showSummary, setShowSummary] = useState(false);
//   const [summary, setSummary] = useState(null);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     fetchShows();
//   }, []);

//   useEffect(() => {
//     socket.on('seat-locked', (data) => {
//       updateSeatStatus(data.seatId, 'LOCKED', data.userId);
//     });

//     socket.on('seat-unlocked', (data) => {
//       updateSeatStatus(data.seatId, 'AVAILABLE', null);
//     });

//     socket.on('seats-booked', (data) => {
//       data.seatIds.forEach(seatId => {
//         updateSeatStatus(seatId, 'BOOKED', null);
//       });
//     });

//     socket.on('seats-unlocked-bulk', (data) => {
//       data.seatIds.forEach(seatId => {
//         updateSeatStatus(seatId, 'AVAILABLE', null);
//       });
//     });

//     return () => {
//       socket.off('seat-locked');
//       socket.off('seat-unlocked');
//       socket.off('seats-booked');
//       socket.off('seats-unlocked-bulk');
//     };
//   }, []);

//   const fetchShows = async () => {
//     try {
//       const response = await fetch(`${API_URL}/shows`);
//       const data = await response.json();
//       setShows(data);
//       if (data.length > 0) {
//         selectShow(data[0].show_id);
//       }
//     } catch (error) {
//       console.error('Error fetching shows:', error);
//       setMessage('Failed to load shows');
//     }
//   };

//   const selectShow = async (showId) => {
//     try {
//       setSelectedShow(showId);
//       const response = await fetch(`${API_URL}/seats/${showId}`);
//       const data = await response.json();
//       setSeats(data);
//       setSelectedSeats([]);
//       setShowSummary(false);
//     } catch (error) {
//       console.error('Error fetching seats:', error);
//       setMessage('Failed to load seats');
//     }
//   };

//   const updateSeatStatus = (seatId, status, lockedBy) => {
//     setSeats(prevSeats =>
//       prevSeats.map(seat =>
//         seat.seat_id === seatId
//           ? { ...seat, status, locked_by: lockedBy }
//           : seat
//       )
//     );
//   };

//   const handleSeatClick = async (seat) => {
//     if (seat.status === 'BOOKED') {
//       setMessage('This seat is already booked');
//       return;
//     }

//     if (seat.status === 'LOCKED' && seat.locked_by !== userId) {
//       setMessage('This seat is currently locked by another user');
//       return;
//     }

//     if (seat.status === 'LOCKED' && seat.locked_by === userId) {
//       try {
//         const response = await fetch(`${API_URL}/unlock-seat`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ seatId: seat.seat_id, userId })
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setSelectedSeats(prev => prev.filter(id => id !== seat.seat_id));
//           setMessage('Seat unlocked');
//         } else {
//           setMessage(data.error || 'Failed to unlock seat');
//         }
//       } catch (error) {
//         setMessage('Failed to unlock seat');
//       }
//       return;
//     }

//     if (seat.status === 'AVAILABLE') {
//       try {
//         const response = await fetch(`${API_URL}/lock-seat`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ seatId: seat.seat_id, userId })
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setSelectedSeats(prev => [...prev, seat.seat_id]);
//           setMessage('Seat locked! Complete booking within 5 minutes');
//         } else {
//           setMessage(data.error || 'Failed to lock seat');
//         }
//       } catch (error) {
//         setMessage('Failed to lock seat');
//       }
//     }
//   };

//   const handleProceedToSummary = async () => {
//     if (selectedSeats.length === 0) {
//       setMessage('Please select at least one seat');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/booking-summary`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ seatIds: selectedSeats })
//       });
//       const data = await response.json();
//       setSummary(data);
//       setShowSummary(true);
//     } catch (error) {
//       setMessage('Failed to generate summary');
//     }
//   };

//   const handleConfirmBooking = async (paymentSuccess) => {
//     try {
//       const response = await fetch(`${API_URL}/book-seats`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ seatIds: selectedSeats, userId, paymentSuccess })
//       });
//       const data = await response.json();

//       if (data.success) {
//         setMessage(`✅ ${data.message}`);
//         setSelectedSeats([]);
//         setShowSummary(false);
//       } else {
//         setMessage(`❌ ${data.message}`);
//         setSelectedSeats([]);
//         setShowSummary(false);
//       }
//     } catch (error) {
//       setMessage('Booking failed');
//     }
//   };

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
//       <h1 style={{ textAlign: 'center' }}>🎬 Real-Time Seat Booking System</h1>
//       <p style={{ color: '#666', fontSize: '14px', textAlign: 'center' }}>User ID: {userId}</p>

//       {message && (
//         <div style={{
//           padding: '10px',
//           marginBottom: '20px',
//           backgroundColor: message.includes('✅') ? '#d4edda' : message.includes('❌') ? '#f8d7da' : '#fff3cd',
//           border: '1px solid #ccc',
//           borderRadius: '5px',
//           maxWidth: '600px',
//           margin: '20px auto'
//         }}>
//           {message}
//         </div>
//       )}

//       <div style={{ marginBottom: '20px', textAlign: 'center' }}>
//         <h3>Select Show:</h3>
//         {shows.map(show => (
//           <button
//             key={show.show_id}
//             onClick={() => selectShow(show.show_id)}
//             style={{
//               padding: '10px 20px',
//               margin: '5px',
//               backgroundColor: selectedShow === show.show_id ? '#007bff' : '#f0f0f0',
//               color: selectedShow === show.show_id ? 'white' : 'black',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer'
//             }}
//           >
//             {show.show_name} - {new Date(show.show_time).toLocaleString()}
//           </button>
//         ))}
//       </div>

//       {!showSummary ? (
//         <>
//           <SeatGrid
//             seats={seats}
//             onSeatClick={handleSeatClick}
//             userId={userId}
//           />

//           {selectedSeats.length > 0 && (
//             <div style={{ marginTop: '20px', textAlign: 'center' }}>
//               <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Selected Seats: {selectedSeats.length}</p>
//               <button
//                 onClick={handleProceedToSummary}
//                 style={{
//                   padding: '15px 30px',
//                   backgroundColor: '#28a745',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '5px',
//                   fontSize: '16px',
//                   cursor: 'pointer',
//                   fontWeight: 'bold'
//                 }}
//               >
//                 Proceed to Payment
//               </button>
//             </div>
//           )}
//         </>
//       ) : (
//         <BookingSummary
//           summary={summary}
//           seats={seats.filter(s => selectedSeats.includes(s.seat_id))}
//           onConfirm={handleConfirmBooking}
//           onCancel={() => setShowSummary(false)}
//         />
//       )}

//       <div style={{ marginTop: '40px', padding: '15px', backgroundColor: '#fff', borderRadius: '5px', maxWidth: '600px', margin: '40px auto' }}>
//         <h4>Legend:</h4>
//         <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//             <div style={{ width: '30px', height: '30px', backgroundColor: '#28a745', borderRadius: '5px' }}></div>
//             <span>Available</span>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//             <div style={{ width: '30px', height: '30px', backgroundColor: '#ffc107', borderRadius: '5px' }}></div>
//             <span>Locked (by you)</span>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//             <div style={{ width: '30px', height: '30px', backgroundColor: '#ff9800', borderRadius: '5px' }}></div>
//             <span>Locked (others)</span>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//             <div style={{ width: '30px', height: '30px', backgroundColor: '#dc3545', borderRadius: '5px' }}></div>
//             <span>Booked</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// export default App;

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const API_URL = 'http://localhost:5000/api';
const socket = io('http://localhost:5000');

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
      {/* Screen */}
      <div className="screen-section">
        <div className="screen-wrapper">
          <div className="screen-text">SCREEN</div>
        </div>
      </div>

      {/* Seat Grid */}
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

      {/* Legend */}
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

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    socket.on('seat-locked', (data) => {
      updateSeatStatus(data.seatId, 'LOCKED', data.userId);
    });

    socket.on('seat-unlocked', (data) => {
      updateSeatStatus(data.seatId, 'AVAILABLE', null);
    });

    socket.on('seats-booked', (data) => {
      data.seatIds.forEach(seatId => {
        updateSeatStatus(seatId, 'BOOKED', null);
      });
    });

    socket.on('seats-unlocked-bulk', (data) => {
      data.seatIds.forEach(seatId => {
        updateSeatStatus(seatId, 'AVAILABLE', null);
      });
    });

    return () => {
      socket.off('seat-locked');
      socket.off('seat-unlocked');
      socket.off('seats-booked');
      socket.off('seats-unlocked-bulk');
    };
  }, []);

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

  const updateSeatStatus = (seatId, status, lockedBy) => {
    setSeats(prevSeats =>
      prevSeats.map(seat =>
        seat.seat_id === seatId
          ? { ...seat, status, locked_by: lockedBy }
          : seat
      )
    );
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
    if (seat.status === 'BOOKED') {
      showMessage('This seat is already booked', 'error');
      return;
    }

    if (seat.status === 'LOCKED' && seat.locked_by !== userId) {
      showMessage('This seat is currently locked by another user', 'warning');
      return;
    }

    if (seat.status === 'LOCKED' && seat.locked_by === userId) {
      try {
        const response = await fetch(`${API_URL}/unlock-seat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seatId: seat.seat_id, userId })
        });
        const data = await response.json();
        if (response.ok) {
          setSelectedSeats(prev => prev.filter(id => id !== seat.seat_id));
          showMessage('Seat unlocked', 'info');
        } else {
          showMessage(data.error || 'Failed to unlock seat', 'error');
        }
      } catch (error) {
        showMessage('Failed to unlock seat', 'error');
      }
      return;
    }

    if (seat.status === 'AVAILABLE') {
      try {
        const response = await fetch(`${API_URL}/lock-seat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seatId: seat.seat_id, userId })
        });
        const data = await response.json();
        if (response.ok) {
          setSelectedSeats(prev => [...prev, seat.seat_id]);
          showMessage('Seat locked! Complete booking within 10 minutes', 'success');
        } else {
          showMessage(data.error || 'Failed to lock seat', 'error');
        }
      } catch (error) {
        showMessage('Failed to lock seat', 'error');
      }
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