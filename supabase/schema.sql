-- ==============================================================================
-- CHAMONVIN LIMITED — SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================
-- This script configures the complete relational schema, custom enums,
-- tables (with TEXT primary keys), owner profile card, media gallery,
-- indexes, triggers, and Row Level Security.
--
-- HOW TO APPLY IN SUPABASE:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your Project -> SQL Editor -> New Query
-- 3. Paste this script and click "Run".
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM TYPES & ENUMS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'player_position_enum') THEN
    CREATE TYPE player_position_enum AS ENUM (
      'Goalkeeper',
      'Center Back',
      'Right Back',
      'Left Back',
      'Defensive Midfielder',
      'Central Midfielder',
      'Attacking Midfielder',
      'Winger',
      'Forward',
      'Striker'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'playing_level_enum') THEN
    CREATE TYPE playing_level_enum AS ENUM (
      'Academy',
      'Amateur',
      'Semi-Professional',
      'Professional'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'preferred_foot_enum') THEN
    CREATE TYPE preferred_foot_enum AS ENUM (
      'Left',
      'Right',
      'Both'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inquiry_type_enum') THEN
    CREATE TYPE inquiry_type_enum AS ENUM (
      'player_representation',
      'sports_management',
      'general_contact',
      'travel_tours',
      'visa_consultation',
      'flight_services'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inquiry_status_enum') THEN
    CREATE TYPE inquiry_status_enum AS ENUM (
      'new',
      'in_progress',
      'awaiting_client',
      'completed',
      'closed'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'news_category_enum') THEN
    CREATE TYPE news_category_enum AS ENUM (
      'Football Management',
      'Player Announcements',
      'Sports Opportunities',
      'Travel & Visa Updates',
      'Company News'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status_enum') THEN
    CREATE TYPE content_status_enum AS ENUM (
      'published',
      'draft',
      'archived'
    );
  END IF;
END $$;

-- 3. TRIGGER FUNCTION FOR UPDATED_AT
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. TABLE CREATION (Safe and Idempotent - Does NOT overwrite existing player data)
-- ==============================================================================

-- A. Company Settings
CREATE TABLE IF NOT EXISTS public.company_settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  company_name TEXT NOT NULL DEFAULT 'CHAMONVIN LIMITED',
  logo_url TEXT NOT NULL DEFAULT 'https://i.ibb.co/Kp7HY9pp/Whats-App-Image-2026-10-17-at-15-09-07.jpg',
  hero_tagline TEXT NOT NULL DEFAULT 'Your vision and Goal is our Priority',
  hero_interval INTEGER NOT NULL DEFAULT 5000,
  hero_slides JSONB NOT NULL DEFAULT '[]'::jsonb,
  hero_buttons JSONB NOT NULL DEFAULT '[]'::jsonb,
  contact_email TEXT NOT NULL DEFAULT 'info@Chamonvin.com',
  contact_phone TEXT NOT NULL DEFAULT '+1(909)-991-3946',
  contact_whatsapp TEXT DEFAULT '+2348145656705',
  office_address TEXT DEFAULT 'Address: California, USA',
  business_hours TEXT DEFAULT 'Monday – Sunday: 24 Hours (24/7 Service)',
  socials JSONB DEFAULT '{"twitter":"","instagram":"","linkedin":"","facebook":""}'::jsonb,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- B. Players Directory
CREATE TABLE IF NOT EXISTS public.players (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  full_name TEXT NOT NULL,
  primary_position player_position_enum NOT NULL,
  nationality TEXT NOT NULL,
  year_of_birth INTEGER,
  date_of_birth DATE,
  playing_level playing_level_enum NOT NULL DEFAULT 'Professional',
  status content_status_enum NOT NULL DEFAULT 'published',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  photo_url TEXT,
  bio TEXT,
  career_details TEXT[] DEFAULT '{}',
  video_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- C. Travel Packages
CREATE TABLE IF NOT EXISTS public.travel_packages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT,
  inclusions TEXT[] DEFAULT '{}',
  exclusions TEXT[] DEFAULT '{}',
  price TEXT,
  currency TEXT DEFAULT 'GBP',
  travel_dates TEXT,
  status content_status_enum NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- D. News Articles
CREATE TABLE IF NOT EXISTS public.news_articles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cover_image TEXT NOT NULL,
  category news_category_enum NOT NULL DEFAULT 'Football Management',
  publication_date DATE NOT NULL DEFAULT CURRENT_DATE,
  author TEXT NOT NULL DEFAULT 'Chamonvin Directorate',
  content TEXT NOT NULL,
  status content_status_enum NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- E. Inquiries & Leads Central
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ref_number TEXT UNIQUE NOT NULL,
  type inquiry_type_enum NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  country_of_residence TEXT,
  status inquiry_status_enum NOT NULL DEFAULT 'new',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  follow_up_date DATE,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- F. Internal Notes for Inquiries
CREATE TABLE IF NOT EXISTS public.inquiry_notes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  inquiry_id TEXT NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  author_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- G. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  action TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  details TEXT
);

-- H. Executive Leadership & Owner Profile Card
CREATE TABLE IF NOT EXISTS public.owner_profile (
  id TEXT PRIMARY KEY DEFAULT 'owner_main',
  full_name TEXT NOT NULL DEFAULT '',
  role_title TEXT NOT NULL DEFAULT 'Founder & Managing Director',
  secondary_title TEXT,
  photo_url TEXT,
  bio TEXT,
  quote TEXT,
  credentials TEXT[] DEFAULT '{}',
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- I. Home Media Gallery Items
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Scouting & Matches',
  image_url TEXT NOT NULL,
  description TEXT DEFAULT '',
  location TEXT,
  date TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- J. Client & Athlete Testimonials / Reviews
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Client',
  category TEXT NOT NULL DEFAULT 'sports',
  location TEXT DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 5,
  content TEXT NOT NULL,
  date TEXT DEFAULT '2026 Season',
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Convenient views for singular 'testimonial' or typo 'testimonia'
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'testimonial') AND
     NOT EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'testimonial') THEN
    CREATE VIEW public.testimonial AS SELECT * FROM public.testimonials;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'testimonia') AND
     NOT EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'testimonia') THEN
    CREATE VIEW public.testimonia AS SELECT * FROM public.testimonials;
  END IF;
END $$;

-- 5. ATTACH UPDATED_AT TRIGGERS
DROP TRIGGER IF EXISTS trg_company_settings_updated_at ON public.company_settings;
CREATE TRIGGER trg_company_settings_updated_at
BEFORE UPDATE ON public.company_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_players_updated_at ON public.players;
CREATE TRIGGER trg_players_updated_at
BEFORE UPDATE ON public.players
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_travel_packages_updated_at ON public.travel_packages;
CREATE TRIGGER trg_travel_packages_updated_at
BEFORE UPDATE ON public.travel_packages
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_news_articles_updated_at ON public.news_articles;
CREATE TRIGGER trg_news_articles_updated_at
BEFORE UPDATE ON public.news_articles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER trg_inquiries_updated_at
BEFORE UPDATE ON public.inquiries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_owner_profile_updated_at ON public.owner_profile;
CREATE TRIGGER trg_owner_profile_updated_at
BEFORE UPDATE ON public.owner_profile
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_players_status ON public.players(status);
CREATE INDEX IF NOT EXISTS idx_players_level ON public.players(playing_level);
CREATE INDEX IF NOT EXISTS idx_players_position ON public.players(primary_position);
CREATE INDEX IF NOT EXISTS idx_travel_packages_status ON public.travel_packages(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON public.news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_slug ON public.news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_inquiries_type ON public.inquiries(type);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiry_notes_inquiry_id ON public.inquiry_notes(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON public.gallery_items(category);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiry_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Allow full access for company_settings
DROP POLICY IF EXISTS "Allow all for company_settings" ON public.company_settings;
CREATE POLICY "Allow all for company_settings"
ON public.company_settings FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Allow full access for players
DROP POLICY IF EXISTS "Allow all for players" ON public.players;
CREATE POLICY "Allow all for players"
ON public.players FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Allow full access for travel_packages
DROP POLICY IF EXISTS "Allow all for travel_packages" ON public.travel_packages;
CREATE POLICY "Allow all for travel_packages"
ON public.travel_packages FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Allow full access for news_articles
DROP POLICY IF EXISTS "Allow all for news_articles" ON public.news_articles;
CREATE POLICY "Allow all for news_articles"
ON public.news_articles FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Allow full access for inquiries
DROP POLICY IF EXISTS "Allow all for inquiries" ON public.inquiries;
CREATE POLICY "Allow all for inquiries"
ON public.inquiries FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Allow full access for inquiry_notes
DROP POLICY IF EXISTS "Allow all for inquiry_notes" ON public.inquiry_notes;
CREATE POLICY "Allow all for inquiry_notes"
ON public.inquiry_notes FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Allow full access for audit_logs
DROP POLICY IF EXISTS "Allow all for audit_logs" ON public.audit_logs;
CREATE POLICY "Allow all for audit_logs"
ON public.audit_logs FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Allow full access for owner_profile
DROP POLICY IF EXISTS "Allow all for owner_profile" ON public.owner_profile;
CREATE POLICY "Allow all for owner_profile"
ON public.owner_profile FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Allow full access for gallery_items
DROP POLICY IF EXISTS "Allow all for gallery_items" ON public.gallery_items;
CREATE POLICY "Allow all for gallery_items"
ON public.gallery_items FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Allow full access for testimonials
DROP POLICY IF EXISTS "Allow all for testimonials" ON public.testimonials;
CREATE POLICY "Allow all for testimonials"
ON public.testimonials FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Explicit Permissions for all client roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.owner_profile TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.gallery_items TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.testimonials TO anon, authenticated, service_role;

-- ==============================================================================
-- 8. INITIAL DEFAULT SETTINGS & OWNER SEED
-- ==============================================================================
INSERT INTO public.company_settings (
  id,
  company_name,
  logo_url,
  hero_tagline,
  hero_interval,
  contact_email,
  contact_phone,
  contact_whatsapp,
  office_address,
  business_hours
) VALUES (
  'settings_main',
  'CHAMONVIN LIMITED',
  'https://i.ibb.co/Kp7HY9pp/Whats-App-Image-2026-10-17-at-15-09-07.jpg',
  'Your vision and Goal is our Priority',
  5000,
  'info@Chamonvin.com',
  '+1(909)-991-3946',
  '+2348145656705',
  'Address: California, USA',
  'Monday – Sunday: 24 Hours (24/7 Service)'
)
ON CONFLICT (id) DO UPDATE SET
  logo_url = EXCLUDED.logo_url,
  hero_interval = EXCLUDED.hero_interval;

-- Seed Owner Profile
INSERT INTO public.owner_profile (
  id,
  full_name,
  role_title,
  secondary_title,
  photo_url,
  bio,
  quote,
  credentials,
  email,
  phone,
  whatsapp,
  is_published
) VALUES (
  'owner_main',
  'Adekunle O.',
  'Founder & Managing Director',
  'International Sports Management Director & Licensed Football Intermediary',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
  'With extensive experience bridging African football talents with prominent European, UK, and international football structures, the Managing Directorate established Chamonvin Limited on foundational principles of client priority, rigorous ethical representation, and sustainable career stewardship.',
  'At Chamonvin Limited, your vision and goal is our priority. Every player and client deserves genuine advocacy, complete transparency, and relentless dedication to their long-term longevity on and off the pitch.',
  ARRAY['International Football Management & Player Representation', 'FIFA & Global Intermediary Network Relations', 'International Travel Logistics & Visa Advisory Liaison', 'West Africa & European Football Scouting Director'],
  'info@Chamonvin.com',
  '+1(909)-991-3946',
  '+2348145656705',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Gallery Items
INSERT INTO public.gallery_items (id, title, category, image_url, description, location, date, is_featured)
VALUES 
  ('gal-1', 'European Scouting Match & Technical Assessment', 'Scouting & Matches', '/src/assets/images/hero_football_pitch_stands_1792410704308.jpg', '', 'Lisbon, Portugal', '2026 Season', true),
  ('gal-2', 'Elite Training Pitch & Athletic Conditioning', 'Training & Performance', '/src/assets/images/hero_field_goalposts_1792410719341.jpg', '', 'Madrid, Spain', '2026 Season', true),
  ('gal-3', 'International Stadium Match Atmosphere', 'Scouting & Matches', '/src/assets/images/hero_stadium_match_atmosphere_1792410733883.jpg', '', 'London, United Kingdom', '2026 Season', true),
  ('gal-4', 'Tactical Analysis & Video Scouting Review', 'Management & Events', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', '', 'Chamonvin HQ, London', '2026 Season', false),
  ('gal-5', 'Player Contract Advisory & Management Consultation', 'Management & Events', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80', '', 'Victoria Island, Lagos', '2026 Season', true),
  ('gal-6', 'International Travel & Sports Delegation Gateway', 'Travel & Tours', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80', '', 'Heathrow Airport, UK', '2026 Season', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Testimonials / Reviews
INSERT INTO public.testimonials (id, name, role, category, location, rating, content, date, is_published)
VALUES
  ('rev-1', 'Tunde Bakare', 'Professional Footballer · Forward', 'sports', 'Lisbon, Portugal', 5, 'Chamonvin Limited transformed my athletic journey. Their direct European scouting network secured me elite exposure in Portugal. What stands out most is their integrity—no empty promises, just authentic representation and genuine care for my long-term career.', '2026 Season', true),
  ('rev-2', 'Dr. Nkemdilim Eze', 'Medical Research Delegate · Schengen Visa Client', 'travel', 'London, United Kingdom', 5, 'Navigating international visa requirements for our 8-person conference delegation seemed daunting until we hired Chamonvin. Their travel team scrutinized our documentation with immense precision and arranged flights seamlessly. Highly recommended!', '2026 Season', true),
  ('rev-3', 'Emmanuel Oduro', 'Midfielder · Representation Client', 'sports', 'Madrid, Spain', 5, 'The athletic conditioning roadmap and tactical video analysis provided by Chamonvin gave me the edge I needed during scouting assessments. They treat players with respect, protect our welfare, and offer transparent career advisory.', '2026 Season', true),
  ('rev-4', 'Coach Julian Martins', 'European Football Academy Technical Scout', 'sports', 'Porto, Portugal', 5, 'Working with Chamonvin as licensed intermediaries has been exemplary. Their player dossiers are authentic, thoroughly vetted, and backed by accurate technical footage. A trustworthy agency that respects international compliance.', '2026 Season', true),
  ('rev-5', 'Folashade Adeleke', 'Postgraduate Student · UK Student Visa', 'travel', 'Manchester, United Kingdom', 5, 'From university documentation review to mock visa interview prep and airport itinerary booking, Chamonvin guided me step-by-step. Their 24/7 responsiveness gave my family tremendous peace of mind throughout the entire process.', '2026 Season', true),
  ('rev-6', 'Kelvin Mensah', 'Center Back · Elite Trials Participant', 'sports', 'Paris, France', 5, 'Unlike other scouts who make grand claims without results, Chamonvin delivered tangible trial invitations, real contract advisory, and full logistical support. They are the benchmark for football management.', '2026 Season', true)
ON CONFLICT (id) DO NOTHING;

