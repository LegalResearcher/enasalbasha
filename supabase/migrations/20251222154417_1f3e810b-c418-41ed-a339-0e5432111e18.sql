-- Create messages table for contact form submissions
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to send messages (insert)
CREATE POLICY "Anyone can send messages"
ON public.messages
FOR INSERT
WITH CHECK (true);

-- Only admins can view and manage messages
CREATE POLICY "Admins can manage messages"
ON public.messages
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;