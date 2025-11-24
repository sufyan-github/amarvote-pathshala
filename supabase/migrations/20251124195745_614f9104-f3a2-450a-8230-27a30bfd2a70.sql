-- Create enum for violation types
CREATE TYPE public.violation_category AS ENUM (
  'constitutional_rights',
  'human_rights',
  'police_misconduct',
  'government_service_denial',
  'corruption',
  'discrimination',
  'electoral_rights',
  'labor_rights',
  'property_rights',
  'other'
);

-- Create enum for report status
CREATE TYPE public.report_status AS ENUM (
  'submitted',
  'under_review',
  'forwarded',
  'resolved',
  'rejected'
);

-- Create rights violation reports table
CREATE TABLE public.rights_violation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Violation details
  category violation_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  violation_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  
  -- Involved parties
  violator_name TEXT,
  violator_position TEXT,
  witnesses TEXT,
  
  -- Evidence
  evidence_files JSONB DEFAULT '[]'::jsonb,
  
  -- Authority information
  relevant_authority TEXT NOT NULL,
  authority_notified BOOLEAN DEFAULT false,
  authority_contact TEXT,
  
  -- Status tracking
  status report_status DEFAULT 'submitted',
  admin_notes TEXT,
  resolution_details TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT title_length CHECK (char_length(title) >= 10 AND char_length(title) <= 200),
  CONSTRAINT description_length CHECK (char_length(description) >= 50 AND char_length(description) <= 5000)
);

-- Enable RLS
ALTER TABLE public.rights_violation_reports ENABLE ROW LEVEL SECURITY;

-- Users can view their own reports
CREATE POLICY "Users can view their own reports"
ON public.rights_violation_reports
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own reports
CREATE POLICY "Users can create reports"
ON public.rights_violation_reports
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending reports
CREATE POLICY "Users can update their pending reports"
ON public.rights_violation_reports
FOR UPDATE
USING (auth.uid() = user_id AND status = 'submitted');

-- Create storage bucket for evidence files
INSERT INTO storage.buckets (id, name, public)
VALUES ('violation-evidence', 'violation-evidence', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for evidence files
CREATE POLICY "Users can upload their own evidence"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'violation-evidence' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own evidence"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'violation-evidence' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own evidence"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'violation-evidence' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_rights_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_rights_reports_timestamp
BEFORE UPDATE ON public.rights_violation_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_rights_reports_updated_at();

-- Create index for faster queries
CREATE INDEX idx_violation_reports_user_id ON public.rights_violation_reports(user_id);
CREATE INDEX idx_violation_reports_status ON public.rights_violation_reports(status);
CREATE INDEX idx_violation_reports_category ON public.rights_violation_reports(category);