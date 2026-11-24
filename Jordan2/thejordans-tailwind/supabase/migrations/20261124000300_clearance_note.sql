-- Clearance notice on the tracking page: the admin sets an amount due and a
-- message ("clearance requirements"); the tracking page shows both with a
-- Contact Support button. Same lookup as before, plus clearanceNote.
alter table public.shipments
  add column if not exists clearance_note text not null default '';
alter table public.shipments
  drop constraint if exists shipments_clearance_note_check,
  add constraint shipments_clearance_note_check check (length(clearance_note) <= 1000);

create or replace function public.track_shipment(p_code text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'trackingNumber', s.tracking_number,
    'invoiceNumber', s.invoice_number,
    'status', s.status,
    'origin', s.origin,
    'destination', s.destination,
    'originLat', s.origin_lat,
    'originLng', s.origin_lng,
    'destLat', s.dest_lat,
    'destLng', s.dest_lng,
    'routePolyline', s.route_polyline,
    'routeDistanceKm', s.route_distance_km,
    'speedKmh', s.speed_kmh,
    'progressKm', s.progress_km,
    'progressAt', s.progress_at,
    'freightType', s.freight_type,
    'service', s.service,
    'weight', s.weight,
    'dimensions', s.dimensions,
    'pieceType', s.piece_type,
    'packageDescription', s.package_description,
    'amountDue', s.amount_due,
    'clearanceNote', s.clearance_note,
    'currency', coalesce(nullif(s.invoice ->> 'currency', ''), 'USD'),
    'deliveryInstruction', s.delivery_instruction,
    'deliveryInstructionNote', s.delivery_instruction_note,
    'estimatedDelivery', s.estimated_delivery,
    'estimatedDeliveryTime', s.estimated_delivery_time,
    'departureAt', s.departure_at,
    'sender', jsonb_build_object('name', coalesce(s.sender ->> 'name', ''), 'address', coalesce(s.sender ->> 'address', ''),
                               'phone', coalesce(s.sender ->> 'phone', ''), 'email', coalesce(s.sender ->> 'email', '')),
    'receiver', jsonb_build_object('name', coalesce(s.receiver ->> 'name', ''), 'address', coalesce(s.receiver ->> 'address', ''),
                                 'phone', coalesce(s.receiver ->> 'phone', ''), 'email', coalesce(s.receiver ->> 'email', '')),
    'receiverName', coalesce(s.receiver ->> 'name', ''),
    'createdAt', s.created_at,
    'updatedAt', s.updated_at,
    'serverNow', now(),
    'events', coalesce((
      select jsonb_agg(jsonb_build_object('id', e.id, 'date', e.date, 'status', e.status, 'location', e.location, 'note', e.note,
                                          'hasPhoto', exists (select 1 from public.event_photos p where p.event_id = e.id))
                       order by e.date desc, e.created_at desc)
      from public.shipment_events e where e.shipment_id = s.id
    ), '[]'::jsonb)
  )
  from public.shipments s
  where s.tracking_number = upper(regexp_replace(coalesce(p_code, ''), '\s', '', 'g'));
$$;
