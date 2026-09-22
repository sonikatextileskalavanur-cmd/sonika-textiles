-- SONIKA TEXTILES V3 DATABASE SETUP
-- Run this in Supabase > SQL Editor.

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  business_name text,
  tagline text,
  phone text,
  whatsapp text,
  email text,
  gstin text,
  address text,
  facebook text,
  instagram text,
  youtube text,
  maps_url text,
  maps_embed text,
  announcement text,
  hero_title text,
  hero_text text,
  updated_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Sarees','Women','Men','Kids')),
  price text,
  description text,
  image_url text not null,
  storage_path text,
  featured boolean default true,
  active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.site_settings enable row level security;
alter table public.products enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings" on public.site_settings for select using (true);

drop policy if exists "Authenticated can manage site settings" on public.site_settings;
create policy "Authenticated can manage site settings" on public.site_settings for all to authenticated using (true) with check (true);

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products for select using (active = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated can manage products" on public.products;
create policy "Authenticated can manage products" on public.products for all to authenticated using (true) with check (true);

insert into storage.buckets (id,name,public) values ('product-images','product-images',true)
on conflict (id) do update set public=true;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images" on storage.objects for select using (bucket_id='product-images');

drop policy if exists "Authenticated can upload product images" on storage.objects;
create policy "Authenticated can upload product images" on storage.objects for insert to authenticated with check (bucket_id='product-images');

drop policy if exists "Authenticated can update product images" on storage.objects;
create policy "Authenticated can update product images" on storage.objects for update to authenticated using (bucket_id='product-images') with check (bucket_id='product-images');

drop policy if exists "Authenticated can delete product images" on storage.objects;
create policy "Authenticated can delete product images" on storage.objects for delete to authenticated using (bucket_id='product-images');
