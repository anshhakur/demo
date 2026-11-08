-- Run this once in Supabase: SQL Editor > New query > paste > Run.

-- 1. Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price integer not null check (price > 0),
  category text not null,
  collection text,
  description text not null default '',
  details jsonb not null default '[]'::jsonb,
  fabric text not null default '',
  colour text not null default '',
  sizes jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  video text,
  is_new boolean not null default false,
  is_bestseller boolean not null default false,
  created_at timestamptz not null default now()
);

-- Lock the table down. The website reads and writes it only from the server using the
-- service role key, which bypasses these rules. With no policies, the public (anon) key
-- cannot read or change any product rows directly.
alter table public.products enable row level security;

-- 2. Public storage bucket for product photos and videos (50 MB per file on the free plan)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
