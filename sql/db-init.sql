-- Use these commands to create the database and tables

CREATE DATABASE wedding_db COLLATE utf8mb4_unicode_ci;
CREATE USER wedding_user IDENTIFIED BY 'securepassword'; -- replace 'securepassword' with a strong password
GRANT ALL PRIVILEGES ON wedding_db.* TO wedding_user;
FLUSH PRIVILEGES;

-- Create tables
USE wedding_db;

CREATE TABLE invites (
    invite_id UUID PRIMARY KEY DEFAULT SYS_GUID(),
    household_name VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20),
    rsvp_deadline DATE,
    note VARCHAR(255),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guests (
    guest_id UUID PRIMARY KEY DEFAULT SYS_GUID(),
    invite_id UUID,
    title VARCHAR(50),
    given_name VARCHAR(100) NOT NULL,
    family_name VARCHAR(100) NOT NULL,
    rsvp_status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    is_adult BOOLEAN DEFAULT TRUE,
    meal BOOLEAN DEFAULT FALSE,
    rehearsal_guest BOOLEAN DEFAULT FALSE,
    rehearsal_meal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invite_id) REFERENCES invites(invite_id)
);

CREATE TABLE IF NOT EXISTS rsvp_change_log (
  id SERIAL PRIMARY KEY,
  ts TIMESTAMP DEFAULT NOW(),
  guest_id TEXT NOT NULL,
  new_value TEXT
);

CREATE TABLE IF NOT EXISTS `system_settings` (
  `setting_id` uuid not null default sys_guid (),
  `created_at` TIMESTAMP null default CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP null default CURRENT_TIMESTAMP,
  `name` varchar(255) not null,
  `value` varchar(255) null,
  primary key (`setting_id`)
)