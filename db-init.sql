-- Use these commands to create the database and tables

CREATE DATABASE wedding_db;
CREATE USER wedding_user IDENTIFIED BY 'securepassword'; -- replace 'securepassword' with a strong password
GRANT ALL PRIVILEGES ON wedding_db.* TO wedding_user;
FLUSH PRIVILEGES;

-- Create tables
USE wedding_db;

CREATE TABLE invites (
    invite_id UUID PRIMARY KEY DEFAULT SYS_GUID(),
    household_name VARCHAR(255) NOT NULL,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guests (
    guest_id UUID PRIMARY KEY DEFAULT SYS_GUID(),
    invite_id UUID,
    given_name VARCHAR(100) NOT NULL,
    family_name VARCHAR(100) NOT NULL,
    rsvp_status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    is_adult BOOLEAN DEFAULT TRUE,
    seat_requested BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invite_id) REFERENCES invites(invite_id)
);