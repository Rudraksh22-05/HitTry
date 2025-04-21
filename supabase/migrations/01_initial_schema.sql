
-- Create tables for Silent Guardians application

-- Support Circles Table
CREATE TABLE IF NOT EXISTS public.support_circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  member_count INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('domestic-violence', 'workplace-harassment', 'legal-guidance', 'mental-health', 'financial-independence')),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Services Table
CREATE TABLE IF NOT EXISTS public.emergency_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_method TEXT NOT NULL CHECK (contact_method IN ('call', 'chat', 'both')),
  available_24_hours BOOLEAN NOT NULL DEFAULT false,
  response_time TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Support Requests Table
CREATE TABLE IF NOT EXISTS public.support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  service_id UUID NOT NULL REFERENCES public.emergency_services(id),
  anonymous_contact_info TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  reference_number TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Circle Memberships Table
CREATE TABLE IF NOT EXISTS public.circle_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  circle_id UUID NOT NULL REFERENCES public.support_circles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, circle_id)
);

-- Create function to increment member count
CREATE OR REPLACE FUNCTION increment_circle_members(circle_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.support_circles
  SET member_count = member_count + 1,
      last_active = CURRENT_TIMESTAMP
  WHERE id = circle_id;
END;
$$ LANGUAGE plpgsql;

-- Initial seed data for support circles
INSERT INTO public.support_circles (name, description, member_count, type, last_active) 
VALUES 
  ('Healing Together', 'A safe space for domestic violence survivors to share experiences and healing journeys.', 243, 'domestic-violence', NOW() - INTERVAL '30 minutes'),
  ('Workplace Allies', 'Discussion group for addressing and overcoming workplace harassment issues.', 187, 'workplace-harassment', NOW() - INTERVAL '2 hours'),
  ('Legal Support Network', 'Connect with volunteers offering guidance on legal matters and rights.', 156, 'legal-guidance', NOW() - INTERVAL '3 hours'),
  ('Mental Wellness Circle', 'Support group focused on emotional wellbeing and mental health resources.', 312, 'mental-health', NOW() - INTERVAL '15 minutes'),
  ('Financial Freedom Path', 'Group focused on achieving financial independence and security.', 129, 'financial-independence', NOW() - INTERVAL '6 hours');

-- Initial seed data for emergency services
INSERT INTO public.emergency_services (name, description, contact_method, available_24_hours, response_time)
VALUES
  ('Crisis Support Line', 'Immediate emotional support and crisis intervention via phone.', 'call', true, 'Immediate'),
  ('SafeChat', 'Text-based crisis support with trained counselors.', 'chat', true, '< 5 minutes'),
  ('Legal Emergency Hotline', 'Immediate legal guidance for urgent situations.', 'both', false, '< 30 minutes'),
  ('Shelter Connect', 'Immediate assistance finding safe shelter in your area.', 'both', true, '< 15 minutes');

-- Set up Row Level Security policies
ALTER TABLE public.support_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_memberships ENABLE ROW LEVEL SECURITY;

-- RLS policies
-- Anyone can view support circles
CREATE POLICY "Anyone can view support circles"
  ON public.support_circles FOR SELECT
  USING (true);

-- Only authenticated users can join circles
CREATE POLICY "Only authenticated users can join circles"
  ON public.circle_memberships FOR INSERT
  TO authenticated
  USING (auth.uid() = user_id);

-- Only the user who created a membership can view or delete it
CREATE POLICY "Users can view their own memberships"
  ON public.circle_memberships FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memberships"
  ON public.circle_memberships FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Anyone can view emergency services
CREATE POLICY "Anyone can view emergency services"
  ON public.emergency_services FOR SELECT
  USING (true);

-- Only authenticated users can create support requests
CREATE POLICY "Only authenticated users can create support requests"
  ON public.support_requests FOR INSERT
  TO authenticated
  USING (auth.uid() = user_id);

-- Only the user who created a request can view it
CREATE POLICY "Users can view their own support requests"
  ON public.support_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
