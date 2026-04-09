-- Add extra context columns to the shops table for enhanced vendor information

ALTER TABLE shops ADD COLUMN IF NOT EXISTS manager_name TEXT;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS personal_phone TEXT;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS sector TEXT;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS address TEXT;
