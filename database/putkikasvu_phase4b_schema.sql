-- Putkikasvu Phase 4b: STAGING-ONLY schema.
-- REVIEW FIRST. Do not run against another customer's database.
-- Run only after cost approval, ownership check and a documented rollback plan.
-- RLS + revoked Data API grants: all personal data is accessed via guarded server routes.
create table if not exists public.pk_staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.pk_orders (
  id uuid primary key default gen_random_uuid(),
  order_ref text unique not null check (order_ref ~ '^PK-[A-F0-9]{16}$'),
  customer_user_id uuid not null references auth.users(id),
  company_name text not null check (char_length(company_name) between 2 and 160),
  accepted_at timestamptz not null,
  terms_version text not null,
  acceptance_evidence text not null check (char_length(acceptance_evidence) between 12 and 500),
  total_cents integer not null default 59000 check (total_cents = 59000),
  currency text not null default 'EUR' check (currency = 'EUR'),
  created_at timestamptz not null default now(),
  unique (id, customer_user_id)
);
create table if not exists public.pk_onboarding (
  order_id uuid primary key,
  customer_user_id uuid not null,
  contact_phone text not null check (char_length(contact_phone) between 5 and 40),
  service_area text not null check (char_length(service_area) between 2 and 250),
  opening_hours text not null check (char_length(opening_hours) between 2 and 250),
  services jsonb not null check (jsonb_typeof(services) = 'array'),
  notes text not null default '' check (char_length(notes) <= 1200),
  rights_confirmed boolean not null default false,
  updated_at timestamptz not null default now(),
  foreign key (order_id, customer_user_id)
    references public.pk_orders(id, customer_user_id) on delete cascade
);
create table if not exists public.pk_verified_payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.pk_orders(id) on delete restrict,
  installment text not null check (installment in ('deposit','balance')),
  provider text not null default 'revolut_pro' check (provider = 'revolut_pro'),
  provider_transaction_id text not null unique
    check (char_length(provider_transaction_id) between 6 and 180),
  gross_amount_cents integer not null check (gross_amount_cents = 29500),
  currency text not null default 'EUR' check (currency = 'EUR'),
  reviewed_by uuid not null references public.pk_staff(user_id),
  evidence_note text not null check (char_length(evidence_note) between 12 and 500),
  paid_at timestamptz not null,
  verified_at timestamptz not null default now(),
  unique (order_id,installment)
);
create index if not exists pk_orders_customer_idx on public.pk_orders(customer_user_id);
create index if not exists pk_payments_order_idx on public.pk_verified_payments(order_id);
alter table public.pk_staff enable row level security;
alter table public.pk_orders enable row level security;
alter table public.pk_onboarding enable row level security;
alter table public.pk_verified_payments enable row level security;
alter table public.pk_staff force row level security;
alter table public.pk_orders force row level security;
alter table public.pk_onboarding force row level security;
alter table public.pk_verified_payments force row level security;
revoke all on public.pk_staff, public.pk_orders, public.pk_onboarding,
  public.pk_verified_payments from public, anon, authenticated;
grant select, insert, update, delete on public.pk_staff, public.pk_orders,
  public.pk_onboarding, public.pk_verified_payments to service_role;

-- Privileged API may call only as service_role, never browser/anon/authenticated.
-- SECURITY INVOKER + explicit REVOKE prevents anonymous RPC and RLS bypass.
create or replace function public.pk_confirm_verified_payment(
  p_order_id uuid, p_installment text, p_transaction_id text,
  p_gross_cents integer, p_currency text, p_staff_id uuid,
  p_evidence_note text, p_paid_at timestamptz
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_order public.pk_orders%rowtype;
  v_existing public.pk_verified_payments%rowtype;
  v_payment_id uuid;
begin
  if not exists (select 1 from public.pk_staff where user_id = p_staff_id) then
    raise exception 'Unauthorized reviewer';
  end if;
  if p_installment not in ('deposit','balance') or
      p_gross_cents <> 29500 or p_currency <> 'EUR' or
      char_length(coalesce(p_transaction_id,'')) not between 6 and 180 or
      char_length(coalesce(p_evidence_note,'')) not between 12 and 500 or
      p_paid_at is null or p_paid_at > now() + interval '5 minutes' then
    raise exception 'Invalid payment evidence';
  end if;
  select * into v_order from public.pk_orders
    where id = p_order_id for update;
  if not found or v_order.accepted_at is null then
    raise exception 'Unknown or unaccepted order';
  end if;
  select * into v_existing from public.pk_verified_payments
    where provider_transaction_id = p_transaction_id;
  if found then
    if v_existing.order_id = p_order_id and v_existing.installment = p_installment
       and v_existing.gross_amount_cents = p_gross_cents then
      return v_existing.id; -- retry with identical payment: idempotent
    end if;
    raise exception 'Transaction reference already assigned';
  end if;
  if p_installment = 'balance' then
    if not exists (select 1 from public.pk_verified_payments
      where order_id = p_order_id and installment = 'deposit') then
      raise exception 'Deposit not verified';
    end if;
    if not exists (select 1 from public.pk_onboarding where order_id = p_order_id) then
      raise exception 'Onboarding not submitted';
    end if;
  end if;
  insert into public.pk_verified_payments
    (order_id, installment, provider_transaction_id, gross_amount_cents, currency,
     reviewed_by, evidence_note, paid_at)
  values (p_order_id, p_installment, p_transaction_id, p_gross_cents,
          p_currency, p_staff_id, p_evidence_note, p_paid_at)
  returning id into v_payment_id;
  return v_payment_id;
end;
$$;
revoke all on function public.pk_confirm_verified_payment(
 uuid,text,text,integer,text,uuid,text,timestamptz) from public, anon, authenticated;
grant execute on function public.pk_confirm_verified_payment(
 uuid,text,text,integer,text,uuid,text,timestamptz) to service_role;

-- No roles are seeded as staff. A reviewed Supabase Auth user ID is required.
-- No public customer upload policies: files remain disabled pending separate audit.
