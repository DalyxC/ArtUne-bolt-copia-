/*
  # Create Artist Profiles Table

  ## Overview
  Creates the artist_profiles table to store detailed information about artists on the ArtUne platform.

  ## Tables Created
  
  ### `artist_profiles`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References profiles.id
  - `display_name` (text, not null) - Public artist name
  - `bio` (text, nullable) - Artist biography/description
  - `profile_image_url` (text, nullable) - Profile photo URL
  - `portfolio_images` (text[], nullable) - Array of portfolio image URLs
  - `location` (text, nullable) - Geographic location
  - `years_experience` (integer, nullable) - Years of professional experience
  - `hourly_rate` (numeric, nullable) - Base hourly rate
  - `availability_status` (text, default 'available') - Current availability status
  - `verified` (boolean, default false) - Platform verification status
  - `last_active` (timestamptz, nullable) - Last activity timestamp
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Row Level Security (RLS) enabled
  - Artists can view and update their own profile
  - All authenticated users can view artist profiles (public discovery)
  - Only artists can create artist profiles

  ## Notes
  - One-to-one relationship with profiles table
  - Availability status helps clients know when artists are free
  - Verified badge builds trust in the platform
*/

-- Create artist_profiles table
CREATE TABLE IF NOT EXISTS artist_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  bio text,
  profile_image_url text,
  portfolio_images text[],
  location text,
  years_experience integer CHECK (years_experience >= 0),
  hourly_rate numeric(10,2) CHECK (hourly_rate >= 0),
  availability_status text DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable')),
  verified boolean DEFAULT false,
  last_active timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_artist_profiles_user_id ON artist_profiles(user_id);

-- Create index on availability for filtering
CREATE INDEX IF NOT EXISTS idx_artist_profiles_availability ON artist_profiles(availability_status);

-- Enable RLS
ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;

-- Artists can view their own profile
CREATE POLICY "Artists can view own profile"
  ON artist_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Artists can update their own profile
CREATE POLICY "Artists can update own profile"
  ON artist_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Artists can create their own profile
CREATE POLICY "Artists can create own profile"
  ON artist_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'artist'
    )
  );

-- All authenticated users can view artist profiles
CREATE POLICY "Authenticated users can view artist profiles"
  ON artist_profiles FOR SELECT
  TO authenticated
  USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_artist_profiles_updated_at
  BEFORE UPDATE ON artist_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
