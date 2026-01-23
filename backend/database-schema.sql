-- Create shows table
CREATE TABLE shows (
    show_id SERIAL PRIMARY KEY,
    show_name VARCHAR(255) NOT NULL,
    show_time TIMESTAMP NOT NULL,
    total_seats INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create seats table
CREATE TABLE seats (
    seat_id SERIAL PRIMARY KEY,
    show_id INTEGER REFERENCES shows(show_id),
    seat_number VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'LOCKED', 'BOOKED')),
    locked_by VARCHAR(100),
    lock_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(show_id, seat_number)
);

-- Create bookings table
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    show_id INTEGER REFERENCES shows(show_id),
    seat_ids INTEGER[] NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED')),
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample show data
INSERT INTO shows (show_name, show_time, total_seats) 
VALUES ('Avengers: Endgame', '2026-02-01 18:00:00', 50);

-- Insert sample seats (50 seats for the show)
DO $$
DECLARE
    i INTEGER;
    show_id_val INTEGER;
BEGIN
    SELECT show_id INTO show_id_val FROM shows WHERE show_name = 'Avengers: Endgame';
    
    FOR i IN 1..50 LOOP
        INSERT INTO seats (show_id, seat_number, status) 
        VALUES (show_id_val, 'S' || LPAD(i::TEXT, 2, '0'), 'AVAILABLE');
    END LOOP;
END $$;