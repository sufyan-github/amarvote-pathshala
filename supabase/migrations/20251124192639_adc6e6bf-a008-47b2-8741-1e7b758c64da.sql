-- Update content type check constraint to support all needed types
ALTER TABLE content DROP CONSTRAINT IF EXISTS content_type_check;

ALTER TABLE content ADD CONSTRAINT content_type_check 
CHECK (type = ANY (ARRAY[
  'module',           -- educational modules
  'article',          -- general articles
  'service',          -- civic services
  'guide',            -- step-by-step guides
  'right',            -- citizen rights
  'responsibility',   -- citizen responsibilities
  'digital-safety',   -- digital safety tips
  'emergency-contact',-- emergency contact information
  'story',            -- digital storytelling
  'awareness',        -- misinformation awareness
  'resource'          -- reference materials
]));