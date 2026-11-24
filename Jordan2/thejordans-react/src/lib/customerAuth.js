import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config.js';

/*
 * Customer accounts on the website (sign up / sign in / my account).
 *
 * Its own Supabase client with its own storage key, so a customer session
 * never mixes with the admin dashboard's session. The confirmation and
 * password-reset links in the emails come back with the session in the URL,
 * which detectSessionInUrl picks up on whatever page they open.
 */
export const customerAuth =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'wbx-customer-auth' },
      })
    : null;

/** { user, loading } for the signed-in customer, kept up to date. */
export function useCustomer() {
  const [state, setState] = useState({ user: null, loading: !!customerAuth });
  useEffect(() => {
    if (!customerAuth) return undefined;
    let active = true;
    customerAuth.auth.getSession().then(({ data }) => active && setState({ user: data.session?.user || null, loading: false }));
    const { data } = customerAuth.auth.onAuthStateChange((_event, session) => {
      if (active) setState({ user: session?.user || null, loading: false });
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);
  return state;
}

/** A safe in-site path from ?next= (never another website). */
export function nextPath(fallback = '/account') {
  const next = new URLSearchParams(window.location.search).get('next') || '';
  return next.startsWith('/') && !next.startsWith('//') ? next : fallback;
}

/** Friendly wording for Supabase auth errors. */
export function authMessage(error) {
  const m = String(error?.message || error || '');
  if (/invalid login credentials/i.test(m)) return 'The email or password is incorrect.';
  if (/email not confirmed/i.test(m)) return 'Please confirm your email address first — check your inbox for the confirmation email.';
  if (/already registered|already been registered/i.test(m)) return 'An account with this email already exists. Please sign in.';
  if (/rate limit|too many/i.test(m)) return 'Too many attempts. Please wait a few minutes and try again.';
  if (/password should be|at least/i.test(m)) return 'Please choose a password with at least 8 characters.';
  if (/network|fetch/i.test(m)) return 'We could not reach our server. Please check your connection and try again.';
  return m || 'Something went wrong. Please try again.';
}
