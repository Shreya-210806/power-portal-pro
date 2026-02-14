
-- Create ratings table for service feedback
CREATE TABLE public.ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Users can insert their own ratings
CREATE POLICY "Users can insert own ratings"
ON public.ratings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view own ratings
CREATE POLICY "Users can view own ratings"
ON public.ratings FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all ratings
CREATE POLICY "Admins can view all ratings"
ON public.ratings FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
