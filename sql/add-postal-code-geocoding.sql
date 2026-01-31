-- Add postal code geocoding cache table

CREATE TABLE postal_code_geocoding (
    postal_code VARCHAR(20) PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    country_code VARCHAR(2) DEFAULT 'US',
    geocoded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_postal_code ON postal_code_geocoding(postal_code);
