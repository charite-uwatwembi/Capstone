/*
  # Create soil analyses table

  1. New Tables
    - `soil_analyses`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `user_id` (uuid, references users, nullable for anonymous usage)
      - Soil chemistry fields (phosphorus, potassium, nitrogen, etc.)
      - Environmental factors (rainfall, elevation)
      - Crop information
      - ML prediction results (fertilizer, rate, confidence, yield)

  2. Security
    - Enable RLS on `soil_analyses` table
    - Add policies for users to manage their own analyses
    - Allow anonymous users to create analyses (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS soil_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  
  -- Soil chemistry parameters
  phosphorus numeric NOT NULL,
  potassium numeric NOT NULL,
  nitrogen numeric NOT NULL,
  organic_carbon numeric NOT NULL,
  cation_exchange numeric NOT NULL,
  
  -- Soil texture
  sand_percent numeric NOT NULL,
  clay_percent numeric NOT NULL,
  silt_percent numeric NOT NULL,
  
  -- Environmental factors
  rainfall numeric NOT NULL,
  elevation numeric NOT NULL,
  
  -- Crop information
  crop_type text NOT NULL,
  
  -- ML prediction results
  recommended_fertilizer text NOT NULL,
  application_rate numeric NOT NULL,
  confidence_score numeric NOT NULL,
  expected_yield_increase numeric NOT NULL
);

ALTER TABLE soil_analyses ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own analyses
CREATE POLICY "Users can read own analyses"
  ON soil_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to create their own analyses
CREATE POLICY "Users can create own analyses"
  ON soil_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow anonymous users to create analyses (for demo)
CREATE POLICY "Anonymous users can create analyses"
  ON soil_analyses
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Allow anonymous users to read their own analyses (session-based)
CREATE POLICY "Anonymous users can read analyses"
  ON soil_analyses
  FOR SELECT
  TO anon
  USING (user_id IS NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS soil_analyses_user_id_idx ON soil_analyses(user_id);
CREATE INDEX IF NOT EXISTS soil_analyses_created_at_idx ON soil_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS soil_analyses_crop_type_idx ON soil_analyses(crop_type);