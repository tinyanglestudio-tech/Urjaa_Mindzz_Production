/*
  # Create site_settings table

  1. New Tables
    - `site_settings`
      - `id` (text, primary key) - settings key (e.g. "admin_state")
      - `data` (jsonb) - settings payload
      - `updated_at` (timestamptz) - last modified time

  2. Security
    - Enable RLS on `site_settings`
    - Public read policy so frontend pages can load settings
    - Public insert/update policies so admin panel (client-only, no auth) can persist changes
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='site_settings_read') THEN
    CREATE POLICY "site_settings_read" ON site_settings FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='site_settings_insert') THEN
    CREATE POLICY "site_settings_insert" ON site_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='site_settings_update') THEN
    CREATE POLICY "site_settings_update" ON site_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;
