import { useEffect } from 'react';
import { submitQuote, subscribe } from '../lib/publicApi.js';

/**
 * Connects the website's forms to the database (hand-written - not regenerated).
 *
 * The form markup comes straight from the original export, so instead of
 * editing it this listens for submits at the window in the capture phase -
 * before Contact Form 7's own scripts see them - and handles:
 *
 *   data-native-form="quote"      -> submit_quote()
 *   data-native-form="subscribe"  -> subscribe()
 *   #tj-track-form, .alxw-track   -> the /track page
 */
const QUOTE_FIELDS = {
  'your-name': 'name',
  'your-email': 'email',
  'your-phone': 'phone',
  'your-dimensions': 'dimensions',
  'your-frieght': 'freightType',
  'your-incoterms': 'incoterms',
  'your-origin-location': 'origin',
  'your-destination-location': 'destination',
  'radio-605': 'service',
};

export const isTrackPath = (path) => /^\/track\/?$/.test(path);

/** Opens the /track page for a tracking number (in place when already there). */
export function goToTracking(code) {
  const url = '/track?code=' + encodeURIComponent(code);
  if (isTrackPath(window.location.pathname)) {
    window.history.pushState(null, '', url);
    window.dispatchEvent(new Event('tj:track'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.location.assign(url);
  }
}

// uses Contact Form 7's own state classes so the theme's message styling applies
function setFormStatus(form, status, message) {
  form.classList.remove('init', 'submitting', 'sent', 'failed', 'invalid');
  form.classList.add(status);
  form.dataset.status = status;
  const output = form.querySelector('.wpcf7-response-output');
  if (output) {
    output.textContent = message;
    output.setAttribute('aria-hidden', message ? 'false' : 'true');
    output.setAttribute('role', 'status');
  }
}

async function handleQuote(form) {
  const data = new FormData(form);
  const quote = Object.fromEntries(
    Object.entries(QUOTE_FIELDS).map(([field, key]) => [key, String(data.get(field) ?? '').trim()])
  );
  if (!quote.name || !quote.email || !quote.phone) {
    setFormStatus(form, 'invalid', 'Please fill in your name, email and phone number.');
    return;
  }
  setFormStatus(form, 'submitting', '');
  try {
    await submitQuote(quote);
    form.reset();
    // the theme swaps selects for nice-select widgets; refresh them after reset
    window.jQuery?.(form).find('select').niceSelect?.('update');
    setFormStatus(form, 'sent', 'Thank you! Your quote request has been received. Our team will contact you shortly.');
  } catch (err) {
    setFormStatus(form, 'failed', err.message);
  }
}

async function handleSubscribe(form) {
  const email = String(new FormData(form).get('email') ?? '').trim();
  if (!email) {
    setFormStatus(form, 'invalid', 'Please enter your email address.');
    return;
  }
  setFormStatus(form, 'submitting', '');
  try {
    const result = await subscribe(email);
    form.reset();
    setFormStatus(form, 'sent', result === 'exists' ? "You're already subscribed - thank you!" : 'Thanks for subscribing!');
  } catch (err) {
    setFormStatus(form, 'failed', err.message);
  }
}

export default function SiteForms() {
  useEffect(() => {
    const onSubmit = (e) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      const isTrack = form.id === 'tj-track-form' || form.classList.contains('alxw-track');
      const kind = isTrack ? 'track' : form.dataset.nativeForm;
      if (!['track', 'quote', 'subscribe'].includes(kind)) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      if (kind === 'track') {
        const code = String(new FormData(form).get('code') ?? '').trim();
        if (!code) {
          form.querySelector('input[name="code"]')?.focus();
          return;
        }
        window.alxToggle?.(false);
        goToTracking(code);
        return;
      }

      if (form.dataset.busy) return;
      form.dataset.busy = '1';
      (kind === 'quote' ? handleQuote(form) : handleSubscribe(form)).finally(() => delete form.dataset.busy);
    };

    window.addEventListener('submit', onSubmit, true);
    return () => window.removeEventListener('submit', onSubmit, true);
  }, []);

  return null;
}
