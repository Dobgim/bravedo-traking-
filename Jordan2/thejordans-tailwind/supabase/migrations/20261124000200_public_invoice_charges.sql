-- The invoice on the public tracking page shows the charges too: line items,
-- tax, discount, amount paid and payment details. Like track_shipment, it is
-- only returned to someone who already has the tracking number.
create or replace function public.shipment_invoice(p_code text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'invoiceNumber', s.invoice_number,
    'currency', coalesce(nullif(s.invoice ->> 'currency', ''), st.currency, 'USD'),
    'items', coalesce(s.invoice -> 'items', '[]'::jsonb),
    'taxRate', coalesce(s.invoice -> 'taxRate', '0'::jsonb),
    'discount', coalesce(s.invoice -> 'discount', '0'::jsonb),
    'amountPaid', coalesce(s.invoice -> 'amountPaid', '0'::jsonb),
    'paymentMethod', coalesce(s.invoice ->> 'paymentMethod', ''),
    'dueDate', s.invoice ->> 'dueDate',
    'notes', coalesce(s.invoice ->> 'notes', ''),
    'terms', coalesce(st.invoice_terms, '')
  )
  from public.shipments s
  left join public.settings st on st.id = 1
  where s.tracking_number = upper(regexp_replace(coalesce(p_code, ''), '\s', '', 'g'));
$$;

revoke all on function public.shipment_invoice(text) from public;
grant execute on function public.shipment_invoice(text) to anon, authenticated;
