-- Migration to allow Firebase UIDs (TEXT) instead of Supabase UUIDs
-- We need to drop foreign keys first, then change types

-- 1. Drop existing foreign keys
ALTER TABLE shops DROP CONSTRAINT shops_vendor_id_fkey;
ALTER TABLE orders DROP CONSTRAINT orders_customer_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;

-- 2. Change id column types in all related tables
ALTER TABLE profiles ALTER COLUMN id TYPE TEXT;
ALTER TABLE shops ALTER COLUMN vendor_id TYPE TEXT;
ALTER TABLE orders ALTER COLUMN customer_id TYPE TEXT;

-- 3. Restore foreign keys with local references only
ALTER TABLE shops ADD CONSTRAINT shops_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE orders ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- 4. Update the Trigger if it exists to be compatible with Firebase (optional, but keep it clean)
-- Actually, the handle_new_user trigger was for Supabase Auth, we can disable it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
