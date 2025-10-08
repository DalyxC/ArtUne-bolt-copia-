/*
  # Create Artist Services Table

  ## Overview
  Creates the artist_services table to store services offered by artists on the ArtUne platform.

  ## Tables Created
  
  ### `artist_services`
  - `id` (uuid, primary key) - Unique identifier
  - `artist_id` (uuid, foreign key) - References artist_profiles.id
  - `category` (text, not null) - Service category (e.g., "Live Performance", "Studio Recording")
  - `title` (text, not null) - Service title
  - `description` (text, nullable) - Detailed service description
  - `price` (numeric, nullable) - Service price
  - `price_type` (text, default 'fixed') - Pricing model: fixed, hourly, or negotiable
  - `duration_minutes` (integer, nullable) - Expected service duration
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Row Level Security (RLS) enabled
  - Artists can manage their own services
  - All authenticated users can view services (for booking)

  ## Notes
  - Artists can offer multiple services with different pricing models
  - Flexible pricing supports fixed rates, hourly rates, or negotiable pricing
  - Duration helps clients understand time commitment
*/

-- Create artist_services table
CREATE TABLE IF NOT EXISTS artist_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
  category text NOT NULL,
  title text NOT NULL,
  description text,
  price numeric(10,2) CHECK (price IS NULL OR price >= 0),
  price_type text DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'hourly', 'negotiable')),
  duration_minutes integer CHECK (duration_minutes IS NULL OR duration_minutes > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on artist_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_artist_services_artist_id ON artist_services(artist_id);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_artist_services_category ON artist_services(category);

-- Enable RLS
ALTER TABLE artist_services ENABLE ROW LEVEL SECURITY;

-- Artists can view their own services
CREATE POLICY "Artists can view own services"
  ON artist_services FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artist_profiles
      WHERE artist_profiles.id = artist_services.artist_id
      AND artist_profiles.user_id = auth.uid()
    )
  );

-- Artists can create their own services
CREATE POLICY "Artists can create own services"
  ON artist_services FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artist_profiles
      WHERE artist_profiles.id = artist_services.artist_id
      AND artist_profiles.user_id = auth.uid()
    )
  );

-- Artists can update their own services
CREATE POLICY "Artists can update own services"
  ON artist_services FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artist_profiles
      WHERE artist_profiles.id = artist_services.artist_id
      AND artist_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artist_profiles
      WHERE artist_profiles.id = artist_services.artist_id
      AND artist_profiles.user_id = auth.uid()
    )
  );

-- Artists can delete their own services
CREATE POLICY "Artists can delete own services"
  ON artist_services FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM artist_profiles
      WHERE artist_profiles.id = artist_services.artist_id
      AND artist_profiles.user_id = auth.uid()
    )
  );

-- All authenticated users can view services
CREATE POLICY "Authenticated users can view services"
  ON artist_services FOR SELECT
  TO authenticated
  USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_artist_services_updated_at
  BEFORE UPDATE ON artist_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
