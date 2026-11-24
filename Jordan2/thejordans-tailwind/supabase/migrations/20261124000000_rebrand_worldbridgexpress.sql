-- Rebrand to WorldBridgeXpress (worldbridgexpress.com).
--
-- * New shipments get WBX tracking numbers, e.g. WBX-2026-K7QX4M9.
--   Existing TJ-... numbers keep working - nothing is renamed.
-- * Company details used on invoices and in customer emails are updated
--   only where they still mention TheJordans (or are empty), so anything
--   already customised in Admin -> Settings is kept.
--
-- Only new_tracking_number() is replaced; the shipment trigger is untouched.

create or replace function public.new_tracking_number()
returns text
language plpgsql
volatile
as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  code text;
begin
  loop
    code := 'WBX-' || extract(year from now())::int || '-';
    for i in 1..7 loop
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.shipments where tracking_number = code);
  end loop;
  return code;
end;
$$;

alter table public.settings alter column company_name set default 'WorldBridgeXpress Logistics & Freight';

update public.settings
   set company_name = 'WorldBridgeXpress Logistics & Freight'
 where company_name = '' or company_name ilike '%jordans%';

update public.settings
   set company_website = 'https://worldbridgexpress.com'
 where company_website = '' or company_website ilike '%jordans%';

update public.settings
   set company_email = 'support@worldbridgexpress.com'
 where company_email = '' or company_email ilike '%jordans%';
