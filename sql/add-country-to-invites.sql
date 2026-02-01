-- Add country column to invites table

ALTER TABLE invites ADD COLUMN country VARCHAR(2) DEFAULT 'US';

CREATE INDEX idx_country ON invites(country);
