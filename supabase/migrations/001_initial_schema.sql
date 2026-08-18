-- Book Inventory schema for Supabase PostgreSQL
-- Run in Supabase SQL Editor: https://supabase.com/dashboard → SQL → New query

create table if not exists public.books (
	id serial primary key,
	title varchar(255) not null,
	author varchar(255) not null,
	isbn varchar(64) unique,
	quantity integer not null default 0,
	price numeric(10, 2) not null default 0,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists idx_books_title on public.books (title);
create index if not exists idx_books_author on public.books (author);
create index if not exists idx_books_isbn on public.books (isbn);

-- Keep updated_at in sync on row changes
create or replace function public.set_updated_at()
returns trigger as $$
begin
	new.updated_at = now();
	return new;
end;
$$ language plpgsql;

drop trigger if exists books_set_updated_at on public.books;
create trigger books_set_updated_at
before update on public.books
for each row execute function public.set_updated_at();
