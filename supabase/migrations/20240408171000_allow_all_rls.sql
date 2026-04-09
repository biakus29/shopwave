-- Allow everything for now so Firebase Auth works flawlessly during dev
CREATE POLICY "Allow all actions on profiles for development" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all actions on shops for development" ON shops FOR ALL USING (true) WITH CHECK (true);
