create table if not exists public.orders (
  tran_id text primary key,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  amount numeric not null check (amount >= 0),
  currency text not null default 'BDT',
  customer_name text,
  mobile text,
  email text,
  address text,
  thana text,
  district text,
  cart jsonb not null default '[]'::jsonb,
  val_id text,
  gateway_status text,
  source text default 'web',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

create table if not exists public.leads (
  reference text primary key,
  name text not null,
  whatsapp text not null,
  language text default 'en',
  interest text not null,
  budget_range text not null,
  timeline text not null,
  notes text default '',
  source text default 'sparkai',
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

alter table public.orders enable row level security;
alter table public.leads enable row level security;
