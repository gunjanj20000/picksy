-- Add length and content constraints to questions table
ALTER TABLE public.questions
  ADD CONSTRAINT text_length_limit CHECK (length(text) <= 1000),
  ADD CONSTRAINT text_not_empty CHECK (trim(text) != ''),
  ADD CONSTRAINT category_length_limit CHECK (length(category) <= 50);

-- Add trigger for JSONB validation
CREATE OR REPLACE FUNCTION public.validate_image_answers()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.answer_type = 'images' THEN
    -- Check JSONB is array
    IF jsonb_typeof(NEW.image_answers) != 'array' THEN
      RAISE EXCEPTION 'image_answers must be a JSON array';
    END IF;
    
    -- Check array length
    IF jsonb_array_length(NEW.image_answers) = 0 OR 
       jsonb_array_length(NEW.image_answers) > 20 THEN
      RAISE EXCEPTION 'image_answers must have 1-20 items';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_image_answers_trigger
  BEFORE INSERT OR UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.validate_image_answers();