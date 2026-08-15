-- PostgreSQL schema for Sisu Health & Wellness Application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Mood Check-Ins Table
CREATE TABLE IF NOT EXISTS public.mood_checkins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mood TEXT NOT NULL, -- Calm, Happy, Anxious, Overwhelmed, Exhausted, Hopeful
  energy_level INT DEFAULT 3, -- 1 to 5 scale
  tags TEXT[] DEFAULT '{}',
  reflection TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Core Values Table
CREATE TABLE IF NOT EXISTS public.user_values (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  value_name TEXT NOT NULL, -- Resilience, Mindfulness, Compassion, Courage, Balance
  description TEXT,
  alignment_score INT DEFAULT 5, -- 1 to 10
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Value Logs Table
CREATE TABLE IF NOT EXISTS public.value_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  value_id UUID REFERENCES public.user_values(id) ON DELETE CASCADE,
  action_description TEXT NOT NULL,
  reflection TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Completed Resources Table
CREATE TABLE IF NOT EXISTS public.completed_resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.value_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_resources ENABLE ROW LEVEL SECURITY;

-- Policies: Users can manage their own data
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own mood checkins" ON public.mood_checkins FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own values" ON public.user_values FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own value logs" ON public.value_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own completed resources" ON public.completed_resources FOR ALL USING (auth.uid() = user_id);
