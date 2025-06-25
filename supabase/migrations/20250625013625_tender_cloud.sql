/*
  # Initial Dytto Database Schema

  1. New Tables
    - `profiles` - User profiles and preferences
    - `categories` - Relationship categories (Friend, Business, etc.)
    - `relationships` - Core relationship data
    - `relationship_categories` - Many-to-many relationship categories
    - `interactions` - Interaction logs with AI analysis
    - `quests` - Relationship quests and challenges
    - `achievements` - User achievements and milestones
    - `insights` - AI-generated relationship insights
    - `level_history` - Track level progression
    - `category_history` - Track category changes

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Secure foreign key relationships

  3. Features
    - AI analysis integration
    - Leveling system with XP tracking
    - Quest generation and completion
    - Comprehensive insights system
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  preferences jsonb DEFAULT '{
    "theme": "light",
    "notifications": true,
    "reminder_frequency": "weekly",
    "ai_insights": true
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text NOT NULL DEFAULT '#84BABF',
  icon text NOT NULL DEFAULT 'Users',
  description text,
  created_at timestamptz DEFAULT now()
);

-- Relationships table
CREATE TABLE IF NOT EXISTS relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  bio text,
  photo_url text,
  level integer DEFAULT 1 CHECK (level >= 1 AND level <= 10),
  xp integer DEFAULT 0 CHECK (xp >= 0),
  relationship_type text,
  reminder_interval text DEFAULT 'weekly',
  contact_info jsonb DEFAULT '{}'::jsonb,
  tags text[] DEFAULT '{}',
  last_interaction timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Relationship categories junction table
CREATE TABLE IF NOT EXISTS relationship_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id uuid NOT NULL REFERENCES relationships(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(relationship_id, category_id)
);

-- Interactions table
CREATE TABLE IF NOT EXISTS interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id uuid NOT NULL REFERENCES relationships(id) ON DELETE CASCADE,
  content text NOT NULL,
  sentiment_score decimal,
  xp_gained integer DEFAULT 0,
  ai_analysis jsonb,
  tags text[] DEFAULT '{}',
  is_milestone boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Quests table
CREATE TABLE IF NOT EXISTS quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id uuid REFERENCES relationships(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL DEFAULT 'custom',
  difficulty text NOT NULL DEFAULT 'medium',
  xp_reward integer DEFAULT 10,
  status text DEFAULT 'pending',
  deadline timestamptz,
  milestone_level integer,
  completion_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Award',
  category text NOT NULL DEFAULT 'relationship',
  unlocked_at timestamptz DEFAULT now()
);

-- Insights table
CREATE TABLE IF NOT EXISTS insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id uuid NOT NULL REFERENCES relationships(id) ON DELETE CASCADE,
  interaction_trends jsonb,
  emotional_summary jsonb,
  relationship_forecasts jsonb,
  smart_suggestions jsonb,
  generated_at timestamptz DEFAULT now(),
  UNIQUE(relationship_id)
);

-- Level history table
CREATE TABLE IF NOT EXISTS level_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id uuid NOT NULL REFERENCES relationships(id) ON DELETE CASCADE,
  old_level integer NOT NULL,
  new_level integer NOT NULL,
  xp_gained integer NOT NULL,
  interaction_id uuid REFERENCES interactions(id),
  created_at timestamptz DEFAULT now()
);

-- Category history table
CREATE TABLE IF NOT EXISTS category_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id uuid NOT NULL REFERENCES relationships(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id),
  change_type text NOT NULL, -- 'added' or 'removed'
  user_confirmed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Categories policies (read-only for users)
CREATE POLICY "Categories are viewable by authenticated users"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Relationships policies
CREATE POLICY "Users can manage own relationships"
  ON relationships
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Relationship categories policies
CREATE POLICY "Users can manage own relationship categories"
  ON relationship_categories
  FOR ALL
  TO authenticated
  USING (
    relationship_id IN (
      SELECT id FROM relationships WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    relationship_id IN (
      SELECT id FROM relationships WHERE user_id = auth.uid()
    )
  );

-- Interactions policies
CREATE POLICY "Users can manage own interactions"
  ON interactions
  FOR ALL
  TO authenticated
  USING (
    relationship_id IN (
      SELECT id FROM relationships WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    relationship_id IN (
      SELECT id FROM relationships WHERE user_id = auth.uid()
    )
  );

-- Quests policies
CREATE POLICY "Users can manage own quests"
  ON quests
  FOR ALL
  TO authenticated
  USING (
    relationship_id IN (
      SELECT id FROM relationships WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    relationship_id IN (
      SELECT id FROM relationships WHERE user_id = auth.uid()
    )
  );

-- Achievements policies
CREATE POLICY "Users can manage own achievements"
  ON achievements
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Insights policies
CREATE POLICY "Users can manage own insights"
  ON insights
  FOR ALL
  TO authenticated
  USING (
    relationship_id IN (
      SELECT id FROM relationships WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    relationship_id IN (
      SELECT id FROM relationships WHERE user_id = auth.uid()
    )
  );

-- Level history policies
CREATE POLICY "Users can view own level history"
  ON level_history
  FOR SELECT
  TO authenticated
  USING (
    relationship_id IN (
      SELECT id FROM relationships WHERE user_id = auth.uid()
    )
  );

-- Category history policies
CREATE POLICY "Users can view own category history"
  ON category_history
  FOR SELECT
  TO authenticated
  USING (
    relationship_id IN (
      SELECT id FROM relationships WHERE user_id = auth.uid()
    )
  );

-- Insert default categories
INSERT INTO categories (name, color, icon, description) VALUES
  ('Friend', '#10b981', 'Users', 'Personal friendships'),
  ('Business', '#3b82f6', 'Briefcase', 'Professional contacts'),
  ('Family', '#f59e0b', 'Heart', 'Family members'),
  ('Mentor', '#8b5cf6', 'GraduationCap', 'Mentors and advisors'),
  ('Romantic', '#f43f5e', 'Heart', 'Romantic relationships'),
  ('Acquaintance', '#6b7280', 'User', 'Casual acquaintances')
ON CONFLICT (name) DO NOTHING;

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.email)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_relationships_updated_at
  BEFORE UPDATE ON relationships
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();