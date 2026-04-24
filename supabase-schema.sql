-- ResumeCraft Professional Database Schema

-- Users metadata table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  paypal_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_plan TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume templates (admin managed)
CREATE TABLE IF NOT EXISTS resume_templates (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  template_data JSONB,
  category TEXT DEFAULT 'general',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User resumes
CREATE TABLE IF NOT EXISTS resumes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id INTEGER REFERENCES resume_templates(id),
  title TEXT NOT NULL,
  data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  share_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Download logs
CREATE TABLE IF NOT EXISTS download_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Email logs
CREATE TABLE IF NOT EXISTS email_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  email_to TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent',
  error_message TEXT
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  paypal_subscription_id TEXT,
  paypal_plan_id TEXT,
  status TEXT DEFAULT 'inactive',
  plan_type TEXT DEFAULT 'free',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for resumes
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_templates ENABLE ROW LEVEL SECURITY;

-- Policies for resumes (users can only access their own)
CREATE POLICY "Users can view own resumes" ON resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resumes" ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resumes" ON resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resumes" ON resumes FOR DELETE USING (auth.uid() = user_id);

-- Public can view templates
CREATE POLICY "Anyone can view active templates" ON resume_templates FOR SELECT USING (is_active = TRUE);

-- Users can view own profile
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default templates
INSERT INTO resume_templates (name, description, is_premium, category, sort_order, is_active) VALUES
  ('Modern', 'Clean and professional with a contemporary design', FALSE, 'modern', 1, TRUE),
  ('Classic', 'Traditional and elegant resume format', FALSE, 'classic', 2, TRUE),
  ('Creative', 'Bold and creative design for creative roles', FALSE, 'creative', 3, TRUE),
  ('Executive', 'Premium template for senior professionals', TRUE, 'executive', 4, TRUE),
  ('Minimal', 'Simple and distraction-free design', FALSE, 'minimal', 5, TRUE),
  ('Bold', 'Eye-catching design with strong typography', TRUE, 'bold', 6, TRUE),
  ('Tech', 'Perfect for software engineers and developers', FALSE, 'tech', 7, TRUE),
  ('Corporate', 'Professional corporate style template', TRUE, 'corporate', 8, TRUE),
  ('Academic', 'Ideal for researchers and academics', FALSE, 'academic', 9, TRUE),
  ('Creative Pro', 'Premium creative template with unique layout', TRUE, 'creative-pro', 10, TRUE)
ON CONFLICT DO NOTHING;