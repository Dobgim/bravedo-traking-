import ShipmentMap from './ShipmentMap.jsx';

/* Tracking details for one shipment: status, route, live map, progress and history. */

const STEPS = ['Label Created', 'Facility Received', 'In Transit', 'Out for Delivery', 'Delivered'];

export const formatDate = (iso, withTime = false) => {
  if (!iso) return '';
  const d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    weekday: withTime ? undefined : 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
};

export default function ShipmentResult({ shipment, mapsKey, clockOffset = 0 }) {
  const lastRegular = shipment.events.find((e) => STEPS.includes(e.status))?.status;
  const currentStep = STEPS.indexOf(STEPS.includes(shipment.status) ? shipment.status : lastRegular || 'Label Created');
  const exception = !STEPS.includes(shipment.status);

  return (
    <>
      <div className="tjt-summary">
        <div>
          <span className="tjt-label">Current status</span>
          <span className={`tjt-status tjt-status--${shipment.status.toLowerCase().replace(/\s+/g, '-')}`}>{shipment.status}</span>
        </div>
        {shipment.estimatedDelivery && (
          <div className="tjt-summary__right">
            <span className="tjt-label">{shipment.status === 'Delivered' ? 'Delivery date' : 'Estimated delivery'}</span>
            <strong>{formatDate(shipment.estimatedDelivery)}</strong>
          </div>
        )}
      </div>

      {exception && (
        <p className="tjt-alert">
          This shipment is currently <strong>{shipment.status.toLowerCase()}</strong>. Contact our support team for details.
        </p>
      )}

      <div className="tjt-route">
        <div>
          <span className="tjt-label">From</span>
          <strong>{shipment.origin}</strong>
        </div>
        <span className="tjt-route__line" aria-hidden="true" />
        <div className="tjt-route__to">
          <span className="tjt-label">To</span>
          <strong>{shipment.destination}</strong>
        </div>
      </div>

      <div className="tjt-mapwrap">
        {mapsKey === null ? (
          <div className="tjt-state">
            <span className="tjt-spinner" /> Loading map…
          </div>
        ) : (
          <ShipmentMap shipment={shipment} apiKey={mapsKey} clockOffsetMs={clockOffset} height={380} />
        )}
      </div>

      <ol className="tjt-steps" aria-label="Delivery progress">
        {STEPS.map((step, i) => (
          <li key={step} className={i <= currentStep ? (exception ? 'is-muted-done' : 'is-done') : ''}>
            <span className="tjt-steps__dot" />
            <span className="tjt-steps__label">{step}</span>
          </li>
        ))}
      </ol>

      {(shipment.freightType || shipment.weight || shipment.service) && (
        <dl className="tjt-facts">
          {shipment.freightType && (
            <div>
              <dt>Freight</dt>
              <dd>{shipment.freightType}</dd>
            </div>
          )}
          {shipment.weight && (
            <div>
              <dt>Weight</dt>
              <dd>{shipment.weight}</dd>
            </div>
          )}
          {shipment.service && (
            <div>
              <dt>Service</dt>
              <dd>{shipment.service}</dd>
            </div>
          )}
        </dl>
      )}

      <h4 className="tjt-subhead">Tracking history</h4>
      <ol className="tjt-timeline">
        {shipment.events.map((ev, i) => (
          <li key={i}>
            <div className="tjt-timeline__top">
              <strong>{ev.status}</strong>
              <span className="tjt-muted">{formatDate(ev.date, true)}</span>
            </div>
            {(ev.location || ev.note) && <p>{[ev.location, ev.note].filter(Boolean).join(' — ')}</p>}
          </li>
        ))}
      </ol>
    </>
  );
}
