-- CareerSpark AI: Production Database Schema & Security Migrations
-- Target: Supabase PostgreSQL with Row Level Security (RLS)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  headline TEXT,
  bio TEXT,
  avatar_url TEXT,
  default_language TEXT DEFAULT 'en' CHECK (default_language IN ('en', 'ta')),
  default_tone TEXT DEFAULT 'professional' CHECK (default_tone IN ('professional', 'friendly', 'concise')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'published', 'failed')),
  image_url TEXT NOT NULL,
  destinations TEXT[] DEFAULT ARRAY['linkedin']::TEXT[],
  current_version_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Post Versions Table (Immutable content versions)
CREATE TABLE IF NOT EXISTS public.post_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  version_number INT NOT NULL,
  image_url TEXT NOT NULL,
  context_input JSONB NOT NULL DEFAULT '{}'::JSONB,
  image_analysis JSONB,
  selected_caption TEXT NOT NULL,
  caption_options JSONB DEFAULT '[]'::JSONB,
  hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
  platform_variations JSONB NOT NULL DEFAULT '{}'::JSONB,
  quality_check JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_post_version UNIQUE (post_id, version_number)
);

-- Foreign key for current_version_id in posts
ALTER TABLE public.posts 
  ADD CONSTRAINT fk_posts_current_version 
  FOREIGN KEY (current_version_id) 
  REFERENCES public.post_versions(id) 
  ON DELETE SET NULL;

-- 5. Post Approvals Table (Mandatory Server-Side Approval Gate)
CREATE TABLE IF NOT EXISTS public.post_approvals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  post_version_id UUID REFERENCES public.post_versions(id) ON DELETE CASCADE NOT NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  approved_destinations TEXT[] NOT NULL,
  approval_timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_valid BOOLEAN DEFAULT TRUE NOT NULL,
  invalidation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Connected Accounts Table (Encrypted credentials on server, never client-exposed)
CREATE TABLE IF NOT EXISTS public.connected_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'instagram', 'facebook')),
  account_name TEXT NOT NULL,
  account_identifier TEXT NOT NULL,
  is_connected BOOLEAN DEFAULT FALSE NOT NULL,
  token_status TEXT DEFAULT 'requires_setup' CHECK (token_status IN ('valid', 'expired', 'missing', 'requires_setup')),
  encrypted_access_token TEXT, -- server-side only encryption
  token_expires_at TIMESTAMPTZ,
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  connected_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_user_platform UNIQUE (user_id, platform)
);

-- 7. Publishing Attempts Table (Idempotency & Reconciliations)
CREATE TABLE IF NOT EXISTS public.publishing_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  post_version_id UUID REFERENCES public.post_versions(id) ON DELETE CASCADE NOT NULL,
  destination TEXT NOT NULL CHECK (destination IN ('linkedin', 'instagram', 'facebook')),
  idempotency_key TEXT NOT NULL UNIQUE,
  provider_post_id TEXT,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'success', 'failed', 'uncertain')),
  payload_snapshot JSONB NOT NULL,
  response_data JSONB,
  error_message TEXT,
  attempt_count INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =======================================================
-- INDEXES FOR PERFORMANCE
-- =======================================================
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_post_versions_post_id ON public.post_versions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_approvals_post_id ON public.post_approvals(post_id);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_user_id ON public.connected_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_publishing_attempts_post_id ON public.publishing_attempts(post_id);
CREATE INDEX IF NOT EXISTS idx_publishing_attempts_idempotency ON public.publishing_attempts(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);

-- =======================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publishing_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can select and update their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Posts: Users can manage only their own posts
CREATE POLICY "Users can view own posts" 
  ON public.posts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own posts" 
  ON public.posts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" 
  ON public.posts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" 
  ON public.posts FOR DELETE 
  USING (auth.uid() = user_id);

-- Post Versions: Accessible if the user owns the parent post
CREATE POLICY "Users can view versions of own posts" 
  ON public.post_versions FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.posts WHERE id = post_versions.post_id AND user_id = auth.uid()));

CREATE POLICY "Users can insert versions for own posts" 
  ON public.post_versions FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.posts WHERE id = post_versions.post_id AND user_id = auth.uid()));

-- Post Approvals:
CREATE POLICY "Users can view approvals for own posts" 
  ON public.post_approvals FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.posts WHERE id = post_approvals.post_id AND user_id = auth.uid()));

CREATE POLICY "Users can create approvals for own posts" 
  ON public.post_approvals FOR INSERT 
  WITH CHECK (auth.uid() = approved_by AND EXISTS (SELECT 1 FROM public.posts WHERE id = post_approvals.post_id AND user_id = auth.uid()));

-- Connected Accounts: Exclude encrypted_access_token in client views or protect through API
CREATE POLICY "Users can view own connected accounts metadata" 
  ON public.connected_accounts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own connected accounts" 
  ON public.connected_accounts FOR ALL 
  USING (auth.uid() = user_id);

-- Publishing Attempts:
CREATE POLICY "Users can view own publishing attempts" 
  ON public.publishing_attempts FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.posts WHERE id = publishing_attempts.post_id AND user_id = auth.uid()));

-- Activity Logs:
CREATE POLICY "Users can view own activity logs" 
  ON public.activity_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs" 
  ON public.activity_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- =======================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- =======================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', NOW(), NOW());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
