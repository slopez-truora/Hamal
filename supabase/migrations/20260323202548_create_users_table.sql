/*
  # Create users table for phone validation

  ## 1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique identifier for each user
      - `country_code` (text) - Phone country code (e.g., +57)
      - `phone_number` (text) - User's phone number
      - `validation_status` (text) - Status of Truora validation (pending, processing, success, failed)
      - `created_at` (timestamptz) - When the user record was created
      - `updated_at` (timestamptz) - Last update timestamp

  ## 2. Security
    - Enable RLS on `users` table
    - Add policy for authenticated users to read their own data
    - Add policy for service role to insert and update data

  ## 3. Indexes
    - Add unique index on country_code + phone_number combination
    - Add index on validation_status for filtering
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL,
  phone_number text NOT NULL,
  validation_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_phone UNIQUE (country_code, phone_number)
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Service role can insert users"
  ON users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update users"
  ON users
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_users_validation_status ON users(validation_status);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(country_code, phone_number);
