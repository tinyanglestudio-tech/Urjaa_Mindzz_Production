/*
  # Enable Realtime on site_settings table

  1. Changes
    - Enable Supabase Realtime publication on `site_settings` table
    - This allows the public website to subscribe to live changes
      whenever the admin panel saves updates

  2. Why
    - The admin panel writes to `site_settings` on every edit
    - The public website needs to reflect those changes instantly
    - Supabase Realtime broadcasts row-level changes via WebSocket
*/

ALTER PUBLICATION supabase_realtime ADD TABLE site_settings;
