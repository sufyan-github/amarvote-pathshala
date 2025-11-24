-- Fix the update_rights_reports_updated_at function with proper search_path
CREATE OR REPLACE FUNCTION public.update_rights_reports_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;