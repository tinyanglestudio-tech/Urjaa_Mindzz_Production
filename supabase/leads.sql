-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS public.leads (
  id           BIGSERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  phone        TEXT NOT NULL,
  country_code TEXT,
  child_age    TEXT,
  location     TEXT,
  source       TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Allow the anon key to insert (form submissions) and read (admin panel)
GRANT INSERT, SELECT ON public.leads TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.leads_id_seq TO anon;
