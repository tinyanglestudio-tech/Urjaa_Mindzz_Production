/*
  # Create leads table for CTA form submissions

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Full name of the parent
      - `phone` (text, not null) - WhatsApp number with country code
      - `country_code` (text, default '+91') - Country dial code
      - `child_age` (text, not null) - Child's age (e.g. "6 months", "2 years")
      - `location` (text, not null) - City or area
      - `source` (text) - Which page the form was submitted from
      - `created_at` (timestamptz) - When the lead was submitted

  2. Security
    - Enable RLS on `leads` table
    - Add INSERT policy for anonymous users (public form submissions)
    - Add SELECT policy for authenticated users (admin access)
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  country_code text DEFAULT '+91',
  child_age text NOT NULL,
  location text NOT NULL,
  source text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);
