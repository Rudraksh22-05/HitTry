-- Run this SQL in your Supabase SQL editor to create/fix the mentors table
create table if not exists mentors (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  email text not null,
  created_at timestamp with time zone default now()
);
