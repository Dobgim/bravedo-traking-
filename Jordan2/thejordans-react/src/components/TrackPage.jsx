import { useCallback, useEffect, useRef, useState } from 'react';
import ShipmentResult, { formatDate } from './ShipmentResult.jsx';
import { getPublicSettings, getShipmentInvoice, trackShipment } from '../lib/publicApi.js';
import ShipmentInvoice from './ShipmentInvoice.jsx';
import { SignInRequired } from './AuthPages.jsx';
import { useCustomer } from '../lib/customerAuth.js';
import './trackPage.css';

/*
 * The /track page (hand-written - not regenerated). Every "Tracking" /
 * "Track And Trace" link, the tracking boxes on the site and the invoice QR
 * code lead here, with the number in ?code=.
 */

const REFRESH_MS = 30000;

export const readTrackCode = () => {
  const params = new URLSearchParams(window.location.search);
  return (params.get('code') || params.get('track') || '').trim();
};

const FEATURES = [
  {
    title: 'Live map',
    text: 'Watch your package move along its route in real time.',
    icon: (
      <>
        <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
        <path d="M9 4v14M15 6v14" />
      </>
    ),
  },
  {
    title: 'Every checkpoint',
    text: 'See each pickup, hub and hand-over as it happens.',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    title: 'Delivery estimate',
    text: 'Know when to expect it, based on the current speed.',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>
    ),
  },
];

export default function TrackPage() {
  const [code, setCode] = useState(readTrackCode);
  const [input, setInput] = useState(code);
  const [state, setState] = useState({});
  const [clockOffset, setClockOffset] = useState(0);
  const [settings, setSettings] = useState(null);
  const [invoice, setInvoice] = useState(null);
  // customers must be signed in to see a shipment
  const { user, loading: authLoading } = useCustomer();
  const signedIn = !!user;
  const resultRef = useRef(null);
  const searched = useRef(false);

  useEffect(() => {
    document.title = 'Track Your Shipment – WorldBridgeXpress Logistics & Freight';
  }, []);

  // back/forward, and tracking boxes elsewhere on the page (see SiteForms)
  useEffect(() => {
    const sync = () => {
      const next = readTrackCode();
      searched.current = true;
      setCode(next);
      setInput(next);
    };
    window.addEventListener('popstate', sync);
    window.addEventListener('tj:track', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('tj:track', sync);
    };
  }, []);

  useEffect(() => {
    getPublicSettings()
      .then((s) => setSettings(s || {}))
      .catch(() => setSettings({}));
  }, []);

  const load = useCallback(
    async (silent) => {
      if (!code || !signedIn) {
        setState({});
        return;
      }
      if (!silent) setState({ loading: true });
      try {
        const sentAt = Date.now();
        const shipment = await trackShipment(code);
        if (!shipment) {
          setState({ notFound: true });
          return;
        }
        // align the map animation with the database clock, not the visitor's
        setClockOffset(Date.parse(shipment.serverNow) - (sentAt + Date.now()) / 2);
        setState({ shipment });
      } catch (err) {
        if (!silent) setState({ error: err.message });
      }
    },
    [code, signedIn]
  );

  useEffect(() => {
    if (authLoading) return undefined;
    load(false);
    if (!code || !signedIn) return undefined;
    // pick up status changes made in the dashboard while the page is open
    const timer = setInterval(() => load(true), REFRESH_MS);
    return () => clearInterval(timer);
  }, [load, code, signedIn, authLoading]);

  const found = state.shipment?.trackingNumber;

  // the invoice's charges, once per tracking number (not on every refresh)
  useEffect(() => {
    setInvoice(null);
    if (!found) return undefined;
    let active = true;
    getShipmentInvoice(found)
      .then((inv) => active && setInvoice(inv || {}))
      .catch(() => active && setInvoice({}));
    return () => {
      active = false;
    };
  }, [found]);
  useEffect(() => {
    if (searched.current && (found || state.notFound)) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [found, state.notFound]);

  const submit = (e) => {
    e.preventDefault();
    const next = input.trim();
    if (!next) return;
    searched.current = true;
    window.history.pushState(null, '', '/track?code=' + encodeURIComponent(next));
    if (next === code) load(false);
    else setCode(next);
  };

  const phone = settings?.companyPhone || '+1800 668 333';

  return (
    <div id="pxl-main" className="tjt tjt-page">
      <section className="tjt-hero">
        <span className="tjt-hero__stripe" aria-hidden="true" />
        <div className="tjt-container">
          <nav className="tjt-crumbs" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <span>Tracking</span>
          </nav>
          <h1>Track Your Shipment</h1>
          <p className="tjt-hero__lede">Enter your tracking number to see the latest status of your delivery — live on the map.</p>

          <form className="tjt-search" onSubmit={submit} role="search">
            <label className="tjt-search__field">
              <svg width="20" height="21" viewBox="0 0 20 21" fill="none" aria-hidden="true">
                <path
                  d="M18.72 4.7L10.47.19a1.5 1.5 0 0 0-1.44 0L.78 4.7A1.5 1.5 0 0 0 0 6.01v8.97c0 .55.3 1.05.78 1.31l8.25 4.52c.45.24.99.24 1.44 0l8.25-4.52c.48-.26.78-.76.78-1.31V6.02c0-.55-.3-1.05-.78-1.32zM9.75 1.5l7.53 4.12-2.79 1.53-7.53-4.12L9.75 1.5zm0 8.25L2.22 5.62l3.18-1.74 7.53 4.13-3.18 1.74zM1.5 6.94L9 11.04v8.04l-7.5-4.1V6.94zM18 14.98l-7.5 4.1v-8.04l3-1.64v3.35a.75.75 0 0 0 1.5 0V8.58l3-1.64v8.04z"
                  fill="#FE000B"
                />
              </svg>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your tracking number"
                aria-label="Tracking number"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
              />
            </label>
            <button type="submit" className="tjt-search__btn" disabled={!input.trim() || state.loading}>
              {state.loading ? 'Searching…' : 'Track Shipment'}
            </button>
          </form>
          <p className="tjt-hint">Your tracking number is on your receipt and invoice — or scan the QR code on the invoice.</p>
        </div>
      </section>

      <section className="tjt-container tjt-results" ref={resultRef} aria-live="polite">
        {!code && (
          <div className="tjt-features">
            {FEATURES.map((f) => (
              <div key={f.title} className="tjt-feature">
                <span className="tjt-feature__icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {f.icon}
                  </svg>
                </span>
                <strong>{f.title}</strong>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        )}

        {code && authLoading && (
          <div className="tjt-card tjt-state">
            <span className="tjt-spinner" /> Checking your account…
          </div>
        )}

        {code && !authLoading && !signedIn && <SignInRequired code={code} />}

        {state.loading && (
          <div className="tjt-card tjt-state">
            <span className="tjt-spinner" /> Looking up {code.toUpperCase()}…
          </div>
        )}

        {state.notFound && (
          <div className="tjt-card tjt-empty">
            <strong>No shipment found</strong>
            <span>
              We couldn't find a shipment with the tracking number “{code.toUpperCase()}”. Please check the number and try again,
              or contact our support team on {phone}.
            </span>
          </div>
        )}

        {state.error && (
          <div className="tjt-card tjt-empty">
            <strong>Something went wrong</strong>
            <span>{state.error}</span>
          </div>
        )}

        {state.shipment && (
          <article className="tjt-card">
            <header className="tjt-card__head">
              <div>
                <span className="tjt-label">Tracking number</span>
                <h2>{state.shipment.trackingNumber}</h2>
              </div>
              <span className="tjt-muted">Updated {formatDate(state.shipment.updatedAt, true)} · refreshes automatically</span>
            </header>
            <ShipmentResult
              shipment={state.shipment}
              mapsKey={settings ? settings.googleMapsApiKey || '' : null}
              clockOffset={clockOffset}
              settings={settings}
              onShipmentChange={(shipment) => setState({ shipment })}
            />
          </article>
        )}

        {state.shipment && invoice && (
          <section className="tjt-card tjt-invoice" id="invoice" aria-label="Invoice">
            <header className="tjt-card__head">
              <div>
                <span className="tjt-label">Invoice</span>
                <h2>Your shipment invoice</h2>
              </div>
              <span className="tjt-muted">With a QR code and barcode for {state.shipment.trackingNumber} · download it as a PDF</span>
            </header>
            <ShipmentInvoice shipment={state.shipment} invoice={invoice} company={settings || {}} />
          </section>
        )}
      </section>
    </div>
  );
}
