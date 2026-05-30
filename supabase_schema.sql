-- ====================================================================
-- SUPABASE SCHEMA FOR KNOWLEARN ASSESSMENT PLATFORM
-- ====================================================================
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com)
-- ====================================================================

-- 1. PROFILES TABLE (Extensions of auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  name text not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to automatically create a profile for new auth users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', 'Educator'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. QUIZZES TABLE
create table public.quizzes (
  id text primary key,
  title text not null,
  description text,
  creator_id uuid references auth.users on delete cascade not null,
  questions jsonb not null default '[]'::jsonb,
  theme_color text default '#6366f1',
  cover_image text,
  settings jsonb not null default '{"isReleased": true, "requireConfidence": true, "shuffleQuestions": false}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Quizzes
alter table public.quizzes enable row level security;

-- Policies for Quizzes
create policy "Quizzes are viewable by everyone" on public.quizzes
  for select using (true);

create policy "Authenticated users can insert quizzes" on public.quizzes
  for insert with check (auth.uid() = creator_id);

create policy "Users can update their own quizzes" on public.quizzes
  for update using (auth.uid() = creator_id);

create policy "Users can delete their own quizzes" on public.quizzes
  for delete using (auth.uid() = creator_id);


-- 3. RESPONSES TABLE (Student quiz submissions)
create table public.responses (
  id text primary key,
  quiz_id text references public.quizzes(id) on delete cascade not null,
  respondent_name text not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  entries jsonb not null default '[]'::jsonb,
  total_score integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Responses
alter table public.responses enable row level security;

-- Policies for Responses
create policy "Anyone can submit a response" on public.responses
  for insert with check (true);

create policy "Quiz creators can view responses" on public.responses
  for select using (
    exists (
      select 1 from public.quizzes
      where public.quizzes.id = public.responses.quiz_id
      and public.quizzes.creator_id = auth.uid()
    )
  );
