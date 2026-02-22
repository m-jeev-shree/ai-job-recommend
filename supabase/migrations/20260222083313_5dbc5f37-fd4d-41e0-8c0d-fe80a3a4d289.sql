
-- User profiles table for AI-extracted career data
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  full_name TEXT,
  experience_text TEXT,
  skills_text TEXT,
  goals_text TEXT,
  ai_extracted_skills JSONB DEFAULT '[]'::jsonb,
  skill_levels JSONB DEFAULT '{}'::jsonb,
  career_cluster TEXT,
  career_trajectory TEXT,
  skill_vector JSONB DEFAULT '[]'::jsonb,
  ai_confidence NUMERIC DEFAULT 0,
  raw_ai_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access (no auth required for demo)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.user_profiles FOR UPDATE USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
