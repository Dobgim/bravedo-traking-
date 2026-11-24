import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { computeInvoice, formatMoney } from '../admin/invoice.js';
import './shipmentInvoice.css';

/*
 * The shipment invoice on the public tracking page (hand-written). Built from
 * the shipment (track_shipment) and its charges (shipment_invoice), with a QR
 * code that opens the live tracking page and a Code 128 barcode of the
 * tracking number. "Download PDF" renders the sheet to an A4 PDF; the PDF
 * libraries are only loaded when someone clicks it.
 */

const fmtDate = (iso) => {
  if (!iso) return '';
  const d = new Date(String(iso).length === 10 ? iso + 'T00:00:00' : iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

function barcodeFor(code) {
  try {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, code, { format: 'CODE128', width: 2, height: 70, margin: 0, displayValue: false, lineColor: '#11194E' });
    return canvas.toDataURL('image/png');
  } catch {
    return '';
  }
}

export function siteUrl(company) {
  const w = String(company?.companyWebsite || '').trim().replace(/\/+$/, '');
  if (!w) return window.location.origin;
  return /^https?:\/\//i.test(w) ? w : `https://${w}`;
}

function Party({ label, party = {}, fallbackPlace }) {
  const lines = [party.address || fallbackPlace, party.phone, party.email].filter(Boolean);
  return (
    <div className="wbi-party">
      <p className="wbi-label">{label}</p>
      <strong>{party.name || '—'}</strong>
      {lines.map((l) => (
        <span key={l}>{l}</span>
      ))}
    </div>
  );
}

export default function ShipmentInvoice({ shipment: s, invoice, company = {} }) {
  const sheet = useRef(null);
  const [qr, setQr] = useState('');
  const [barcode, setBarcode] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const trackUrl = `${siteUrl(company)}/track?code=${encodeURIComponent(s.trackingNumber)}`;
  const companyName = company.companyName || 'WorldBridgeXpress Logistics & Freight';
  const inv = invoice || {};
  const currency = inv.currency || s.currency || 'USD';
  const t = computeInvoice(inv);
  const money = (v) => formatMoney(v, currency);
  const hasCharges = t.items.length > 0;

  useEffect(() => {
    QRCode.toDataURL(trackUrl, { width: 420, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#11194E', light: '#FFFFFF' } })
      .then(setQr)
      .catch(() => setQr(''));
    setBarcode(barcodeFor(s.trackingNumber));
  }, [trackUrl, s.trackingNumber]);

  /** Renders the sheet into an A4 PDF (several pages if it is long). */
  const makePdf = async () => {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas-pro'), import('jspdf')]);
    const canvas = await html2canvas(sheet.current, {
      scale: 2,
      backgroundColor: '#ffffff',
      windowWidth: 1200, // always the desktop layout, whatever the device
      onclone: (doc) => doc.querySelector('[data-invoice-sheet]')?.classList.add('wbi--pdf'),
    });
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    const pageW = 210;
    const pageH = 297;
    const pxPerMm = canvas.width / pageW;
    const fullH = canvas.height / pxPerMm;
    if (fullH <= pageH * 1.35) {
      // a normal invoice: one page, scaled down a little if needed
      const scale = Math.min(1, pageH / fullH);
      const w = pageW * scale;
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.93), 'JPEG', (pageW - w) / 2, 0, w, fullH * scale);
    } else {
      // a very long invoice: split across A4 pages
      const pagePx = Math.floor(pageH * pxPerMm);
      for (let y = 0, page = 0; y < canvas.height; y += pagePx, page++) {
        const slice = document.createElement('canvas');
        slice.width = canvas.width;
        slice.height = Math.min(pagePx, canvas.height - y);
        slice.getContext('2d').drawImage(canvas, 0, y, canvas.width, slice.height, 0, 0, canvas.width, slice.height);
        if (page > 0) pdf.addPage();
        pdf.addImage(slice.toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, pageW, slice.height / pxPerMm);
      }
    }
    pdf.setProperties({ title: `Invoice ${s.invoiceNumber || s.trackingNumber}`, author: companyName });
    return pdf;
  };

  const run = (kind) => async () => {
    setBusy(kind);
    setError('');
    // a tab opened before the PDF is ready, so pop-up blockers allow it
    const tab = kind === 'print' ? window.open('', '_blank') : null;
    try {
      const pdf = await makePdf();
      const name = `Invoice-${s.invoiceNumber || s.trackingNumber}.pdf`;
      if (kind === 'print' && tab) {
        tab.location.href = pdf.output('bloburl', { filename: name });
      } else {
        pdf.save(name);
      }
    } catch {
      tab?.close();
      setError('The PDF could not be created on this device. Please try again, or use your browser’s Print option.');
    } finally {
      setBusy('');
    }
  };

  const details = [
    ['Freight', s.freightType],
    ['Service', s.service || 'Standard'],
    ['Pieces', s.pieceType],
    ['Weight', s.weight],
    ['Dimensions', s.dimensions],
    ['Ship date', fmtDate(s.departureAt || s.createdAt)],
    ['Expected delivery', [fmtDate(s.estimatedDelivery), s.estimatedDeliveryTime].filter(Boolean).join(', ')],
    ['Contents', s.packageDescription],
  ].filter(([, v]) => v);

  const companyLines = [company.companyAddress, company.companyPhone, company.companyEmail, siteUrl(company).replace(/^https?:\/\//, '')].filter(Boolean);
  const payStatus = hasCharges ? t.status : '';
  const payKey = payStatus.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="wbi-wrap">
      <div className="wbi-actions">
        <button type="button" className="wbi-btn wbi-btn--primary" onClick={run('download')} disabled={!!busy}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
          </svg>
          {busy === 'download' ? 'Preparing PDF…' : 'Download invoice (PDF)'}
        </button>
        <button type="button" className="wbi-btn" onClick={run('print')} disabled={!!busy}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2M6 14h12v7H6z" />
          </svg>
          {busy === 'print' ? 'Preparing…' : 'Print'}
        </button>
      </div>
      {error && <p className="wbi-error">{error}</p>}

      <div className="wbi-scroll">
        <article className="wbi" ref={sheet} data-invoice-sheet>
          <header className="wbi-head">
            <div className="wbi-brand">
              <img src="/uploads/2026/02/wbx-logo.webp" alt={companyName} />
              <div className="wbi-brand__lines">
                {companyLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </div>
            <div className="wbi-title">
              <h2>INVOICE</h2>
              <dl>
                <div>
                  <dt>Invoice no.</dt>
                  <dd>{s.invoiceNumber || inv.invoiceNumber || '—'}</dd>
                </div>
                <div>
                  <dt>Issue date</dt>
                  <dd>{fmtDate(s.createdAt)}</dd>
                </div>
                {inv.dueDate && (
                  <div>
                    <dt>Due date</dt>
                    <dd>{fmtDate(inv.dueDate)}</dd>
                  </div>
                )}
              </dl>
              {payStatus && <span className={`wbi-pay wbi-pay--${payKey}`}>{payStatus}</span>}
            </div>
          </header>

          <section className="wbi-track">
            <div className="wbi-track__code">
              <p className="wbi-label">Tracking number</p>
              <strong>{s.trackingNumber}</strong>
              <span className={`wbi-status wbi-status--${(s.status || '').toLowerCase().replace(/\s+/g, '-')}`}>{s.status}</span>
            </div>
            {barcode && (
              <div className="wbi-barcode">
                <img src={barcode} alt={`Barcode for ${s.trackingNumber}`} />
                <span>{s.trackingNumber}</span>
              </div>
            )}
          </section>

          <section className="wbi-parties">
            <Party label="From (sender)" party={s.sender} fallbackPlace={s.origin} />
            <Party label="Bill to / Ship to (receiver)" party={s.receiver} fallbackPlace={s.destination} />
          </section>

          <section className="wbi-route">
            <div>
              <p className="wbi-label">Origin</p>
              <strong>{s.origin}</strong>
            </div>
            <span className="wbi-route__line" aria-hidden="true">
              <i />
            </span>
            <div className="wbi-route__end">
              <p className="wbi-label">Destination</p>
              <strong>{s.destination}</strong>
            </div>
          </section>

          <dl className="wbi-details">
            {details.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          {hasCharges && (
            <>
              <table className="wbi-table">
                <thead>
                  <tr>
                    <th className="wbi-num">#</th>
                    <th>Description</th>
                    <th className="wbi-right">Qty</th>
                    <th className="wbi-right">Unit price</th>
                    <th className="wbi-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {t.items.map((it, i) => (
                    <tr key={i}>
                      <td className="wbi-num">{String(i + 1).padStart(2, '0')}</td>
                      <td>{it.description}</td>
                      <td className="wbi-right">{it.quantity}</td>
                      <td className="wbi-right">{money(it.unitPrice)}</td>
                      <td className="wbi-right">{money(it.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="wbi-totals">
                <dl>
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{money(t.subtotal)}</dd>
                  </div>
                  {t.discount > 0 && (
                    <div>
                      <dt>Discount</dt>
                      <dd>−{money(t.discount)}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Tax ({t.taxRate}%)</dt>
                    <dd>{money(t.tax)}</dd>
                  </div>
                  <div className="wbi-totals__grand">
                    <dt>Total</dt>
                    <dd>{money(t.total)}</dd>
                  </div>
                  <div>
                    <dt>Amount paid</dt>
                    <dd>{money(t.paid)}</dd>
                  </div>
                  <div className="wbi-totals__due">
                    <dt>Balance due</dt>
                    <dd>{money(t.balance)}</dd>
                  </div>
                </dl>
              </div>
            </>
          )}

          <section className="wbi-bottom">
            <div className="wbi-qr">
              {qr ? <img src={qr} alt={`QR code that opens tracking for ${s.trackingNumber}`} /> : <span className="wbi-qr__ph" />}
              <div>
                <strong>Scan to track your shipment</strong>
                <p>Point your phone camera at the code to follow {s.trackingNumber} live on the map.</p>
                <code>{trackUrl}</code>
              </div>
            </div>
            <div className="wbi-notes">
              {inv.paymentMethod && (
                <>
                  <p className="wbi-label">Payment</p>
                  <p>
                    Method: {inv.paymentMethod}
                    <br />
                    Please quote {s.invoiceNumber || 'the invoice number'} with your payment.
                  </p>
                </>
              )}
              {(inv.notes || inv.terms) && (
                <>
                  <p className="wbi-label">Notes &amp; terms</p>
                  {inv.notes && <p>{inv.notes}</p>}
                  {inv.terms && <p>{inv.terms}</p>}
                </>
              )}
            </div>
          </section>

          <footer className="wbi-foot">
            <span>
              Thank you for shipping with <strong>{companyName}</strong>.
            </span>
            <span>{company.companyEmail || 'support@worldbridgexpress.com'}</span>
          </footer>
        </article>
      </div>
    </div>
  );
}
