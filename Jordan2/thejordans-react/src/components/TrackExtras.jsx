import { useEffect, useState } from 'react';
import { saveDeliveryInstruction } from '../lib/publicApi.js';
import './trackExtras.css';

/*
 * Extra blocks on the tracking result (hand-written):
 *  - ClearanceNotice: "Clearance Required" with the amount due and a Contact
 *    Support button, shown while the admin has set an amount due.
 *  - DeliveryInstructions: the receiver picks how the package should be
 *    delivered; saving it emails the company (database trigger -> email).
 */

function money(value, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(value));
  } catch {
    return `${currency} ${Number(value).toFixed(2)}`;
  }
}

export function ClearanceNotice({ shipment, settings }) {
  if (!(Number(shipment.amountDue) > 0) || ['Delivered', 'Cancelled'].includes(shipment.status)) return null;
  const currency = shipment.currency || 'USD';
  const amount = money(shipment.amountDue, currency);
  const email = settings?.companyEmail || 'support@worldbridgexpress.com';
  const subject = `Clearance payment for shipment ${shipment.trackingNumber}`;
  const body = `Hello,\n\nI would like to arrange the clearance payment of ${amount} for shipment ${shipment.trackingNumber}.\n\nThank you.`;

  return (
    <section className="tjt-clearance" role="alert">
      <h3>Clearance Required</h3>
      <p>{shipment.clearanceNote || 'Outstanding payment required to release this shipment.'}</p>
      <p className="tjt-clearance__amount">
        Amount Due: {amount} {currency}
      </p>
      <a className="tjt-clearance__btn" href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
          <rect x="2.5" y="13" width="4" height="6" rx="1.5" />
          <rect x="17.5" y="13" width="4" height="6" rx="1.5" />
        </svg>
        Contact Support
      </a>
    </section>
  );
}

const DELIVERY_INSTRUCTIONS = ['Leave at door', 'Hand it to me', 'Leave with a neighbor', 'Leave at reception', 'Other'];

export function DeliveryInstructions({ shipment, onSaved }) {
  const [instruction, setInstruction] = useState(shipment.deliveryInstruction || '');
  const [note, setNote] = useState(shipment.deliveryInstructionNote || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const closed = ['Delivered', 'Cancelled'].includes(shipment.status);

  useEffect(() => {
    setInstruction(shipment.deliveryInstruction || '');
    setNote(shipment.deliveryInstructionNote || '');
  }, [shipment.deliveryInstruction, shipment.deliveryInstructionNote]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const saved = await saveDeliveryInstruction(shipment.trackingNumber, instruction, instruction === 'Other' ? note.trim() : '');
      onSaved?.(saved);
      setMessage('Thank you — your delivery instructions have been saved and our team has been notified.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="tjt-instructions">
      <h3>Delivery Instructions</h3>
      <div className="tjt-instructions__box">
        <p>
          Current instruction: <strong>{shipment.deliveryInstruction || 'None selected'}</strong>
          {shipment.deliveryInstructionNote ? ` — ${shipment.deliveryInstructionNote}` : ''}
        </p>
        {closed ? (
          <p className="tjt-muted">Delivery instructions can no longer be changed for this shipment.</p>
        ) : (
          <form onSubmit={save}>
            <label htmlFor="tjt-instruction">Select Instruction</label>
            <select id="tjt-instruction" value={instruction} onChange={(e) => setInstruction(e.target.value)} required>
              <option value="" disabled>
                Select an instruction
              </option>
              {DELIVERY_INSTRUCTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            {instruction === 'Other' && (
              <>
                <label htmlFor="tjt-instruction-note">Delivery details</label>
                <textarea
                  id="tjt-instruction-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={500}
                  rows={3}
                  required
                  placeholder="Tell us where or how to leave the package"
                />
              </>
            )}
            {error && (
              <p className="tjt-instructions__error" role="alert">
                {error}
              </p>
            )}
            {message && (
              <p className="tjt-instructions__ok" role="status">
                {message}
              </p>
            )}
            <button type="submit" disabled={!instruction || (instruction === 'Other' && !note.trim()) || saving}>
              {saving ? 'Saving…' : 'Save Instructions'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
