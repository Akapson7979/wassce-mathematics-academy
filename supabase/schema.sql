-- Starter schema only. Review and apply RLS policies before handling real student data.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  content text,
  video_url text,
  position integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(student_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique(student_id, lesson_id)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  quiz_slug text not null,
  score integer not null,
  total_questions integer not null,
  attempted_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;

-- Minimal student-owned record policies. Add admin/editor policies before production use.
create policy "Students can read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Students can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Students can read own enrollments" on public.enrollments
  for select using (auth.uid() = student_id);
create policy "Students can read own progress" on public.lesson_progress
  for select using (auth.uid() = student_id);
create policy "Students can add own progress" on public.lesson_progress
  for insert with check (auth.uid() = student_id);
create policy "Students can read own quiz attempts" on public.quiz_attempts
  for select using (auth.uid() = student_id);
create policy "Students can add own quiz attempts" on public.quiz_attempts
  for insert with check (auth.uid() = student_id);

create policy "Published courses are visible" on public.courses
  for select using (published = true);
create policy "Published lessons are visible" on public.lessons
  for select using (
    published = true and exists (
      select 1 from public.courses
      where courses.id = lessons.course_id and courses.published = true
    )
  );
