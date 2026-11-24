-- The notify-shipment Edge Function reads shipments with the service_role key.
-- This project does not give service_role table rights by default, so the
-- function got "permission denied for table shipments" and no email was sent.
grant select on public.shipments, public.shipment_events, public.settings to service_role;
grant select, insert, delete on public.email_log to service_role;
grant usage, select on all sequences in schema public to service_role;
