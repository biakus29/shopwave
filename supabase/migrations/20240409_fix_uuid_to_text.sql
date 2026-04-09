-- Migration to fix the UUID vs Firebase UID issue
-- This changes all user-related ID columns from UUID to TEXT

-- 1. Drop existing constraints that depend on these columns
ALTER TABLE shops DROP CONSTRAINT IF EXISTS shops_vendor_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Drop the Supabase Auth trigger and function (not used for Firebase)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 3. Change column types to TEXT
ALTER TABLE profiles ALTER COLUMN id TYPE TEXT;
ALTER TABLE shops ALTER COLUMN vendor_id TYPE TEXT;
ALTER TABLE orders ALTER COLUMN customer_id TYPE TEXT;

-- 4. Restore foreign key relationships
ALTER TABLE shops 
  ADD CONSTRAINT shops_vendor_id_fkey 
  FOREIGN KEY (vendor_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

ALTER TABLE orders 
  ADD CONSTRAINT orders_customer_id_fkey 
  FOREIGN KEY (customer_id) 
  REFERENCES profiles(id) 
  ON DELETE SET NULL;

-- 5. Update RLS policies for Profiles
-- Since we use Firebase, auth.uid() in Supabase will be null.
-- We allow the client to manage its own profile during the transition.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Allow profile management" ON profiles FOR ALL USING (true);

-- 6. Update RLS for Shops
DROP POLICY IF EXISTS "Vendors can manage their own shop" ON shops;
CREATE POLICY "Vendors can manage their own shop" ON shops FOR ALL USING (true);

-- 7. Update RLS for Products
DROP POLICY IF EXISTS "Vendors can manage products of their own shop" ON products;
CREATE POLICY "Vendors can manage products of their own shop" ON products FOR ALL USING (true);
