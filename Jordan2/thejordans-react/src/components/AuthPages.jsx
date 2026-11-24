import { useEffect, useState } from 'react';
import { authMessage, customerAuth, nextPath, useCustomer } from '../lib/customerAuth.js';
import './auth.css';

/*
 * Customer account pages (hand-written): /login, /signup, /forgot-password,
 * /reset-password and /account. Customers must be signed in to see a
 * shipment on the tracking page. Confirmation and reset emails are sent by
 * Supabase Auth from support@worldbridgexpress.com.
 */

const SITE = 'WorldBridgeXpress';
const origin = () => window.location.origin;

function useTitle(title) {
  useEffect(() => {
    document.title = `${title} – ${SITE}`;
  }, [title]);
}

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);
const ICONS = {
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6.5 0-10-7-10-7a18.5 18.5 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M2 2l20 20" />
    </>
  ),
  check: <path d="M5 12l5 5L20 7" />,
  map: (
    <>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6M8 13h8M8 17h5" />
    </>
  ),
};

function Field({ label, icon, children, hint }) {
  return (
    <label className="wba-field">
      <span className="wba-field__label">{label}</span>
      <span className="wba-field__control">
        {icon && (
          <span className="wba-field__icon">
            <Icon d={ICONS[icon]} />
          </span>
        )}
        {children}
      </span>
      {hint && <span className="wba-field__hint">{hint}</span>}
    </label>
  );
}

/** Password input with a show / hide (eye) toggle. */
function PasswordField({ label = 'Password', value, onChange, autoComplete = 'current-password', hint, minLength }) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} icon="lock" hint={hint}>
      <input
        className="wba-has-eye"
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        minLength={minLength}
        required
        placeholder={show ? '' : '••••••••'}
      />
      <button
        type="button"
        className="wba-eye"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        aria-pressed={show}
        title={show ? 'Hide password' : 'Show password'}
      >
        <Icon d={show ? ICONS.eyeOff : ICONS.eye} size={19} />
      </button>
    </Field>
  );
}

function strength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return pw ? Math.min(4, Math.max(1, score)) : 0;
}
const STRENGTH = ['', 'Weak', 'Fair', 'Good', 'Strong'];

function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div id="pxl-main" className="wba">
      <div className="wba-container">
        <div className="wba-card">
          <aside className="wba-side">
            <img src="/uploads/2026/02/wbx-logo-light.webp" alt={SITE} className="wba-side__logo" />
            <h2>Your shipments, one secure account.</h2>
            <ul>
              <li>
                <Icon d={ICONS.map} /> Follow every package live on the map
              </li>
              <li>
                <Icon d={ICONS.bell} /> Status updates by email at every step
              </li>
              <li>
                <Icon d={ICONS.doc} /> Download invoices with QR code &amp; barcode
              </li>
            </ul>
            <span className="wba-side__stripe" aria-hidden="true" />
          </aside>
          <section className="wba-main">
            <h1>{title}</h1>
            {subtitle && <p className="wba-sub">{subtitle}</p>}
            {children}
            {footer && <div className="wba-footer">{footer}</div>}
          </section>
        </div>
      </div>
    </div>
  );
}

function Alert({ kind = 'error', children }) {
  return (
    <div className={`wba-alert wba-alert--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}

const withNext = (path) => {
  const next = new URLSearchParams(window.location.search).get('next');
  return next ? `${path}?next=${encodeURIComponent(next)}` : path;
};

/* ------------------------------------------------------------------ */

export function SignInPage() {
  useTitle('Sign In');
  const { user, loading } = useCustomer();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (!loading && user) window.location.replace(nextPath());
  }, [user, loading]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setInfo('');
    setUnconfirmed(false);
    const { error: err } = await customerAuth.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) {
      setUnconfirmed(/not confirmed/i.test(err.message));
      setError(authMessage(err));
      return;
    }
    window.location.replace(nextPath());
  };

  const resend = async () => {
    const { error: err } = await customerAuth.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: { emailRedirectTo: `${origin()}/account?welcome=1` },
    });
    if (err) setError(authMessage(err));
    else {
      setError('');
      setInfo(`We sent a new confirmation email to ${email.trim()}.`);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track your shipments and download your invoices."
      footer={
        <>
          Don&apos;t have an account? <a href={withNext('/signup')}>Create an account</a>
        </>
      }
    >
      {new URLSearchParams(window.location.search).get('next')?.startsWith('/track') && (
        <Alert kind="info">Please sign in or create a free account to view your shipment.</Alert>
      )}
      {error && (
        <Alert>
          {error}
          {unconfirmed && (
            <>
              {' '}
              <button type="button" className="wba-link" onClick={resend}>
                Resend confirmation email
              </button>
            </>
          )}
        </Alert>
      )}
      {info && <Alert kind="ok">{info}</Alert>}
      <form onSubmit={submit} className="wba-form">
        <Field label="Email address" icon="mail">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required placeholder="you@example.com" />
        </Field>
        <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="wba-row">
          <span />
          <a href="/forgot-password" className="wba-small-link">
            Forgot password?
          </a>
        </div>
        <button type="submit" className="wba-btn" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </AuthShell>
  );
}

export function SignUpPage() {
  useTitle('Create Account');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [info, setInfo] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const level = strength(form.password);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2) return setError('Please enter your full name.');
    if (!/^[+\d][\d\s().-]{6,}$/.test(form.phone.trim())) return setError('Please enter a valid phone number, e.g. +1 312 555 0199.');
    if (form.password.length < 8) return setError('Please choose a password with at least 8 characters.');
    if (form.password !== form.confirm) return setError('The two passwords do not match.');
    setBusy(true);
    const next = new URLSearchParams(window.location.search).get('next');
    const { data, error: err } = await customerAuth.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: { full_name: form.name.trim(), phone: form.phone.trim() },
        emailRedirectTo: `${origin()}/account?welcome=1${next ? `&next=${encodeURIComponent(next)}` : ''}`,
      },
    });
    setBusy(false);
    if (err) return setError(authMessage(err));
    // Supabase hides whether an address is already registered: no identities = existing account
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return setError('An account with this email already exists. Please sign in instead.');
    }
    setSentTo(form.email.trim());
  };

  const resend = async () => {
    const { error: err } = await customerAuth.auth.resend({ type: 'signup', email: sentTo, options: { emailRedirectTo: `${origin()}/account?welcome=1` } });
    setInfo(err ? authMessage(err) : `A new confirmation email is on its way to ${sentTo}.`);
  };

  if (sentTo) {
    return (
      <AuthShell title="Check your inbox" footer={<a href={withNext('/login')}>Back to sign in</a>}>
        <div className="wba-done">
          <span className="wba-done__icon">
            <Icon d={ICONS.mail} size={30} />
          </span>
          <p>
            We sent a confirmation email from <strong>support@worldbridgexpress.com</strong> to <strong>{sentTo}</strong>.
          </p>
          <p>Click the button in that email to activate your account. If you can&apos;t find it, check your spam or junk folder.</p>
          {info && <Alert kind="ok">{info}</Alert>}
          <button type="button" className="wba-btn wba-btn--ghost" onClick={resend}>
            Resend confirmation email
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes less than a minute. You'll need it to track your shipments."
      footer={
        <>
          Already have an account? <a href={withNext('/login')}>Sign in</a>
        </>
      }
    >
      {error && <Alert>{error}</Alert>}
      <form onSubmit={submit} className="wba-form">
        <Field label="Full name" icon="user">
          <input value={form.name} onChange={set('name')} autoComplete="name" required placeholder="Jane Doe" />
        </Field>
        <div className="wba-grid">
          <Field label="Email address" icon="mail">
            <input type="email" value={form.email} onChange={set('email')} autoComplete="email" required placeholder="you@example.com" />
          </Field>
          <Field label="Phone number" icon="phone">
            <input type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" required placeholder="+1 312 555 0199" />
          </Field>
        </div>
        <PasswordField label="Password" value={form.password} onChange={set('password')} autoComplete="new-password" minLength={8} />
        {form.password && (
          <div className={`wba-meter wba-meter--${level}`} aria-live="polite">
            <span>
              <i />
              <i />
              <i />
              <i />
            </span>
            {STRENGTH[level]} password
          </div>
        )}
        <PasswordField
          label="Confirm password"
          value={form.confirm}
          onChange={set('confirm')}
          autoComplete="new-password"
          minLength={8}
          hint={form.confirm && form.confirm !== form.password ? 'The passwords do not match yet.' : 'At least 8 characters. Mix letters, numbers and symbols for a stronger password.'}
        />
        <button type="submit" className="wba-btn" disabled={busy}>
          {busy ? 'Creating account…' : 'Create Account'}
        </button>
        <p className="wba-fine">
          By creating an account you agree to receive emails about your shipments from {SITE}. We never share your details.
        </p>
      </form>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  useTitle('Reset Password');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: err } = await customerAuth.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${origin()}/reset-password` });
    setBusy(false);
    if (err) setError(authMessage(err));
    else setSent(true);
  };

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle={sent ? '' : "Enter your account's email address and we'll send you a link to choose a new password."}
      footer={<a href="/login">Back to sign in</a>}
    >
      {error && <Alert>{error}</Alert>}
      {sent ? (
        <Alert kind="ok">If an account exists for {email.trim()}, a password reset link is on its way from support@worldbridgexpress.com.</Alert>
      ) : (
        <form onSubmit={submit} className="wba-form">
          <Field label="Email address" icon="mail">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required placeholder="you@example.com" />
          </Field>
          <button type="submit" className="wba-btn" disabled={busy}>
            {busy ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

export function ResetPasswordPage() {
  useTitle('Choose a New Password');
  const { user, loading } = useCustomer();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Please choose a password with at least 8 characters.');
    if (password !== confirm) return setError('The two passwords do not match.');
    setBusy(true);
    const { error: err } = await customerAuth.auth.updateUser({ password });
    setBusy(false);
    if (err) setError(authMessage(err));
    else setDone(true);
  };

  return (
    <AuthShell title="Choose a new password" footer={<a href="/login">Back to sign in</a>}>
      {loading ? (
        <p className="wba-sub">Checking your reset link…</p>
      ) : done ? (
        <>
          <Alert kind="ok">Your password has been changed.</Alert>
          <a className="wba-btn" href="/account">
            Go to my account
          </a>
        </>
      ) : !user ? (
        <Alert>
          This reset link is invalid or has expired. <a href="/forgot-password">Request a new one</a>.
        </Alert>
      ) : (
        <form onSubmit={submit} className="wba-form">
          {error && <Alert>{error}</Alert>}
          <PasswordField label="New password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} />
          <PasswordField label="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" minLength={8} />
          <button type="submit" className="wba-btn" disabled={busy}>
            {busy ? 'Saving…' : 'Save new password'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

export function AccountPage() {
  useTitle('My Account');
  const { user, loading } = useCustomer();
  const [form, setForm] = useState(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const params = new URLSearchParams(window.location.search);
  const welcome = params.get('welcome');
  const next = nextPath('');

  useEffect(() => {
    if (loading) return;
    if (!user) {
      window.location.replace('/login?next=' + encodeURIComponent('/account'));
      return;
    }
    setForm({ name: user.user_metadata?.full_name || '', phone: user.user_metadata?.phone || '' });
  }, [user, loading]);

  if (loading || !user || !form) {
    return (
      <AuthShell title="My account">
        <p className="wba-sub">Loading your account…</p>
      </AuthShell>
    );
  }

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await customerAuth.auth.updateUser({ data: { full_name: form.name.trim(), phone: form.phone.trim() } });
    setBusy(false);
    setMsg(error ? { kind: 'error', text: authMessage(error) } : { kind: 'ok', text: 'Your details have been saved.' });
  };

  const signOut = async () => {
    await customerAuth.auth.signOut();
    window.location.replace('/');
  };

  const track = (e) => {
    e.preventDefault();
    if (code.trim()) window.location.assign('/track?code=' + encodeURIComponent(code.trim()));
  };

  const first = (form.name || user.email).split(' ')[0];

  return (
    <AuthShell title={`Hello, ${first}`} subtitle={`Signed in as ${user.email}`}>
      {welcome && <Alert kind="ok">Your email address is confirmed — welcome to {SITE}!</Alert>}
      {welcome && next.startsWith('/track') && (
        <a className="wba-btn" href={next} style={{ marginBottom: 22 }}>
          Continue to your shipment
        </a>
      )}

      <form onSubmit={track} className="wba-track">
        <span className="wba-field__label">Track a shipment</span>
        <div>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter your tracking number" aria-label="Tracking number" autoCapitalize="characters" />
          <button type="submit" className="wba-btn" disabled={!code.trim()}>
            Track
          </button>
        </div>
      </form>

      <h3 className="wba-h3">Your details</h3>
      {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
      <form onSubmit={save} className="wba-form">
        <Field label="Full name" icon="user">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" required />
        </Field>
        <div className="wba-grid">
          <Field label="Email address" icon="mail">
            <input type="email" value={user.email} disabled />
          </Field>
          <Field label="Phone number" icon="phone">
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
          </Field>
        </div>
        <div className="wba-actions">
          <button type="submit" className="wba-btn" disabled={busy}>
            {busy ? 'Saving…' : 'Save changes'}
          </button>
          <a className="wba-btn wba-btn--ghost" href="/forgot-password">
            Change password
          </a>
          <button type="button" className="wba-btn wba-btn--ghost" onClick={signOut}>
            Sign out
          </button>
        </div>
      </form>
    </AuthShell>
  );
}

/* Shown on /track instead of the shipment when nobody is signed in. */
export function SignInRequired({ code }) {
  const next = encodeURIComponent('/track' + (code ? `?code=${encodeURIComponent(code)}` : ''));
  return (
    <div className="wba-gate">
      <span className="wba-gate__icon">
        <Icon d={ICONS.lock} size={28} />
      </span>
      <h2>Sign in to view your shipment</h2>
      <p>
        {code ? (
          <>
            To protect your delivery details, shipment <strong>{code.toUpperCase()}</strong> is only shown to signed-in customers.
          </>
        ) : (
          'To protect your delivery details, shipments are only shown to signed-in customers.'
        )}{' '}
        Creating an account is free and takes less than a minute.
      </p>
      <div className="wba-gate__actions">
        <a className="wba-btn" href={`/login?next=${next}`}>
          Sign In
        </a>
        <a className="wba-btn wba-btn--ghost" href={`/signup?next=${next}`}>
          Create an account
        </a>
      </div>
    </div>
  );
}
