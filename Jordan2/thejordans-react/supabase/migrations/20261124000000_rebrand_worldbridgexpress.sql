-- Rebrand to WorldBridgeXpress (worldbridgexpress.com).
--
-- * New shipments get WBX tracking numbers (existing TJ numbers keep working).
-- * The invoice company name / website change only if they still hold the
--   old defaults, so anything already customised in Admin -> Settings stays.

alter table public.settings alter column company_name set default 'WorldBridgeXpress Logistics & Freight';

update public.settings
   set company_name = 'WorldBridgeXpress Logistics & Freight'
 where company_name in ('TheJordans Logistics & Freight', 'TheJordans', '');

update public.settings
   set company_website = 'https://worldbridgexpress.com'
 where company_website = '';

create or replace function public.shipments_before_write()
returns trigger
language plpgsql
as $$
begin
  new.tracking_number := upper(regexp_replace(coalesce(new.tracking_number, ''), '\s', '', 'g'));

  if tg_op = 'INSERT' then
    if new.tracking_number = '' then
      loop
        new.tracking_number := 'WBX' || lpad((floor(random() * 1e10))::bigint::text, 10, '0');
        exit when not exists (select 1 from public.shipments where tracking_number = new.tracking_number);
      end loop;
    end if;
    new.progress_km := case when new.status = 'Delivered' then coalesce(new.route_distance_km, 0) else 0 end;
    new.progress_at := coalesce(new.departure_at, now());
    new.created_at := now();
    new.updated_at := now();
    return new;
  end if;

  new.progress_km := old.progress_km;
  new.progress_at := old.progress_at;
  new.created_at := old.created_at;
  new.invoice_number := old.invoice_number;
  new.updated_at := now();

  if (new.origin_lat, new.origin_lng, new.dest_lat, new.dest_lng)
     is distinct from (old.origin_lat, old.origin_lng, old.dest_lat, old.dest_lng) then
    -- a different route: start again from the origin
    new.progress_km := 0;
    new.progress_at := coalesce(new.departure_at, now());
  elsif new.status is distinct from old.status or new.speed_kmh is distinct from old.speed_kmh then
    new.progress_km := public.covered_km(old.progress_km, old.progress_at, old.speed_kmh, old.status,
                                         coalesce(new.route_distance_km, old.route_distance_km));
    new.progress_at := greatest(now(), old.progress_at);   -- keeps a future departure time
  elsif new.departure_at is distinct from old.departure_at and old.progress_km = 0 then
    new.progress_at := coalesce(new.departure_at, now());
  end if;

  if new.status = 'Delivered' and new.route_distance_km is not null then
    new.progress_km := new.route_distance_km;
  end if;
  return new;
end;
$$;
