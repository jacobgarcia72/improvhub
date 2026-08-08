alter table submission_forms
  add column if not exists what_looking_for text,
  add column if not exists about_audition text,
  add column if not exists audition_location text;
