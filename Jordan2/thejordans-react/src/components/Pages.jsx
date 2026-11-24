import { useEffect, useState } from 'react';
import ThemePage from './ThemePage.jsx';
import AboutUs from './sections/AboutUs.jsx';
import Capacity from './sections/Capacity.jsx';
import Expertise from './sections/Expertise.jsx';
import Sustainability from './sections/Sustainability.jsx';
import Testimonials from './sections/Testimonials.jsx';
import Partners from './sections/Partners.jsx';
import ServicesIntro from './sections/ServicesIntro.jsx';
import BusinessServices from './sections/BusinessServices.jsx';
import EcommerceServices from './sections/EcommerceServices.jsx';
import IndustriesIntro from './sections/IndustriesIntro.jsx';
import Industries from './sections/Industries.jsx';
import DeliveryFlexibility from './sections/DeliveryFlexibility.jsx';
import RequestQuote from './sections/RequestQuote.jsx';
import { POSTS, findPost, formatPostDate } from '../data/posts.js';
import { POLICIES } from '../data/policies.js';
import { getPublicSettings } from '../lib/publicApi.js';
import './trackPage.css';
import './pages.css';

/*
 * The website's inner pages (hand-written - not regenerated): /about,
 * /services, /news, /news/<slug>, /contact, /sitemap and the 404 page.
 * Theme sections are reused from the home page inside <ThemePage>; the
 * rest is plain markup styled by pages.css.
 */

const SITE = 'WorldBridgeXpress';

function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} – ${SITE}` : `${SITE} – Global Logistics, Freight & Live Shipment Tracking`;
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}

function PageHero({ title, crumb, lede, children }) {
  const crumbs = Array.isArray(crumb) ? crumb : [{ label: crumb || title }];
  return (
    <div className="tjt tjt-pagehero">
      <section className="tjt-hero">
        <span className="tjt-hero__stripe" aria-hidden="true" />
        <div className="tjt-container">
          <nav className="tjt-crumbs" aria-label="Breadcrumb">
            <a href="/">Home</a>
            {crumbs.map((c) => (
              <span key={c.label} style={{ display: 'contents' }}>
                <span aria-hidden="true">/</span>
                {c.href ? <a href={c.href}>{c.label}</a> : <span>{c.label}</span>}
              </span>
            ))}
          </nav>
          <h1>{title}</h1>
          {lede && <p className="tjt-hero__lede">{lede}</p>}
          {children}
        </div>
      </section>
    </div>
  );
}

const Anchor = ({ id }) => <div id={id} style={{ scrollMarginTop: 110 }} aria-hidden="true" />;

function CtaBand() {
  return (
    <section className="tjp tjp-wrap">
      <div className="tjp-container">
        <div className="tjp-cta">
          <h2>Ready to ship with {SITE}? Get a tailored quote or track your package live.</h2>
          <div className="tjp-cta__actions">
            <a className="tjp-btn" href="/contact#quote">
              Request A Quote
            </a>
            <a className="tjp-btn tjp-btn--light" href="/track">
              Track A Shipment
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function AboutPage() {
  usePageMeta('About Us', `${SITE} is a logistics partner bridging businesses to the world with reliable road, rail, sea and air freight and live shipment tracking.`);
  return (
    <ThemePage
      before={
        <PageHero
          title="About Us"
          lede={`${SITE} bridges businesses to the world — experienced people, clear communication and reliable delivery on every shipment.`}
        />
      }
      after={<CtaBand />}
    >
      <AboutUs />
      <Capacity />
      <Expertise />
      <Anchor id="sustainability" />
      <Sustainability />
      <Anchor id="testimonials" />
      <Testimonials />
      <Partners />
    </ThemePage>
  );
}

const FREIGHT_MODES = [
  {
    id: 'air-freight',
    title: 'Air Freight',
    text: 'The fastest way to move urgent and high-value cargo between continents, with door-to-door handling.',
    icon: <path d="M21 15.5v-2l-8-5V3.8a1.5 1.5 0 0 0-3 0v4.7l-8 5v2l8-2.5v4.3L8 18.7v1.8l3.5-1 3.5 1v-1.8L13 17.3V13z" />,
  },
  {
    id: 'sea-freight',
    title: 'Sea Freight',
    text: 'Cost-effective full and shared container shipping for large volumes on every major trade lane.',
    icon: (
      <>
        <path d="M3 14l1.6 4.2c.2.5.7.8 1.2.8h12.4c.5 0 1-.3 1.2-.8L21 14H3z" />
        <path d="M5 14V9h14v5M9 9V5h6v4" />
      </>
    ),
  },
  {
    id: 'road-freight',
    title: 'Land Transport',
    text: 'Road and rail freight across regions — full truckloads, part loads and scheduled distribution.',
    icon: (
      <>
        <path d="M2 6h11v9H2z" />
        <path d="M13 9h4l3 3.5V15h-7" />
        <circle cx="6" cy="16.5" r="1.8" />
        <circle cx="16.5" cy="16.5" r="1.8" />
      </>
    ),
  },
  {
    id: 'groupage',
    title: 'Groupage',
    text: 'Share container and truck space with other shippers and pay only for the room your goods need.',
    icon: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </>
    ),
  },
];

function FreightModes() {
  return (
    <section className="tjp tjp-wrap tjp-wrap--tint">
      <div className="tjp-container">
        <span className="tjp-eyebrow">Freight modes</span>
        <h2 className="tjp-title">Every way to move your cargo</h2>
        <p className="tjp-lede">Choose the mode that fits your timeline and budget — or let us combine them into one seamless route.</p>
        <div className="tjp-grid tjp-grid--4">
          {FREIGHT_MODES.map((m) => (
            <article key={m.id} id={m.id} className="tjp-card">
              <div className="tjp-card__body">
                <span className="tjp-card__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {m.icon}
                  </svg>
                </span>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
                <a className="tjp-more" href="/contact#quote">
                  Get a quote →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesPage() {
  usePageMeta('Services', `Freight, warehousing, e-commerce fulfillment and supply chain services by ${SITE} — by road, rail, sea and air.`);
  return (
    <ThemePage
      before={
        <PageHero
          title="Our Services"
          lede="Freight and transportation, warehousing, e-commerce fulfillment and supply chain support — built around your business."
        />
      }
      after={
        <>
          <FreightModes />
          <CtaBand />
        </>
      }
    >
      <ServicesIntro />
      <BusinessServices />
      <EcommerceServices />
      <IndustriesIntro />
      <Industries />
      <DeliveryFlexibility />
    </ThemePage>
  );
}

function PostCard({ post }) {
  const href = `/news/${post.slug}`;
  return (
    <article className="tjp-card">
      <a href={href} className="tjp-post__img" style={{ backgroundImage: `url(${post.image})` }} aria-label={post.title} />
      <div className="tjp-card__body">
        <div className="tjp-meta">
          <span>{formatPostDate(post.date)}</span>
          {post.tags.map((t) => (
            <span key={t} className="tjp-tag">
              {t}
            </span>
          ))}
        </div>
        <h3>
          <a href={href}>{post.title}</a>
        </h3>
        <p>{post.excerpt}</p>
        <a className="tjp-more" href={href}>
          Read more →
        </a>
      </div>
    </article>
  );
}

export function NewsPage() {
  usePageMeta('News & Insights', `Logistics news, delivery insights and shipping tips from ${SITE}.`);
  return (
    <div id="pxl-main">
      <PageHero title="News & Insights" crumb="News" lede="Logistics trends, delivery insights and practical shipping advice from our team." />
      <section className="tjp tjp-wrap">
        <div className="tjp-container">
          <div className="tjp-grid">
            {POSTS.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </div>
  );
}

export function NewsDetailPage({ slug }) {
  const post = findPost(slug);
  usePageMeta(post?.title || 'Page Not Found', post?.excerpt);
  if (!post) return <NotFoundPage />;
  const i = POSTS.indexOf(post);
  const next = POSTS[(i + 1) % POSTS.length];
  const more = POSTS.filter((p) => p !== post).slice(0, 3);
  return (
    <div id="pxl-main">
      <PageHero title={post.title} crumb={[{ label: 'News', href: '/news' }, { label: 'Article' }]} lede={`${formatPostDate(post.date)} · ${post.tags.join(' · ')}`} />
      <section className="tjp tjp-wrap">
        <div className="tjp-container tjp-narrow">
          <article className="tjp-article">
            <img className="tjp-article__img" src={post.image} alt="" />
            {post.body.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
            <div className="tjp-article__nav">
              <a className="tjp-btn tjp-btn--light" style={{ border: '1px solid #e3e5ee' }} href="/news">
                ← All news
              </a>
              <a className="tjp-btn" href={`/news/${next.slug}`}>
                Next article →
              </a>
            </div>
          </article>
        </div>
      </section>
      <section className="tjp tjp-wrap tjp-wrap--tint">
        <div className="tjp-container">
          <h2 className="tjp-title">More from our team</h2>
          <div className="tjp-grid" style={{ marginTop: 28 }}>
            {more.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const CONTACT_FAQS = [
  {
    q: 'How do I track my shipment?',
    a: 'Enter the tracking number from your receipt or invoice on the Tracking page — or scan the QR code on your invoice. You will see the live status, the package on the map and the full checkpoint history. Sender and receiver also get an email at every status change.',
  },
  {
    q: 'How do I get a quote?',
    a: 'Fill in the Request A Quote form with your route, dimensions and freight type. Our team replies with a tailored quote, usually within a few hours on working days.',
  },
  {
    q: 'Which freight types do you handle?',
    a: 'Truck, rail, sea and air freight — from single parcels and e-commerce orders to full containers and dedicated loads.',
  },
  {
    q: 'Can I change the delivery address after shipping?',
    a: 'Yes. Contact our support team with your tracking number and we will update the delivery preferences while the shipment is in transit, where the route allows it.',
  },
];

export function ContactPage() {
  usePageMeta('Contact Us', `Contact ${SITE} for quotes, shipment support and partnerships. Email support@worldbridgexpress.com.`);
  const [s, setS] = useState({});
  useEffect(() => {
    getPublicSettings()
      .then((v) => setS(v || {}))
      .catch(() => {});
  }, []);
  const phone = s.companyPhone || '+1 (904) 567-6548';
  const email = s.companyEmail || 'support@worldbridgexpress.com';
  const address = s.companyAddress || '8490 Avenida de la Fuente, San Diego, CA 92154';

  const cards = [
    {
      title: 'Email us',
      body: <a href={`mailto:${email}`}>{email}</a>,
      note: 'We reply within a few hours on working days.',
      icon: (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </>
      ),
    },
    {
      title: 'Call us',
      body: <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>,
      note: 'Monday – Saturday, 7:30 – 17:30.',
      icon: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
    },
    {
      title: 'Visit us',
      body: <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer">{address}</a>,
      note: 'Sunday and public holidays: closed.',
      icon: (
        <>
          <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </>
      ),
    },
  ];

  return (
    <ThemePage
      before={
        <>
          <PageHero title="Contact Us" lede="Questions, quotes or shipment support — our team usually replies within a few hours." />
          <section className="tjp tjp-wrap">
            <div className="tjp-container">
              <div className="tjp-grid">
                {cards.map((c) => (
                  <div key={c.title} className="tjp-card tjp-contact-card">
                    <div className="tjp-card__body">
                      <span className="tjp-card__icon">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          {c.icon}
                        </svg>
                      </span>
                      <h3>{c.title}</h3>
                      <p>{c.body}</p>
                      <p>{c.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <Anchor id="quote" />
        </>
      }
      after={
        <section className="tjp tjp-wrap">
          <div className="tjp-container tjp-split">
            <div className="tjp-faq" id="faq">
              <span className="tjp-eyebrow">FAQ</span>
              <h2 className="tjp-title">Frequently asked questions</h2>
              {CONTACT_FAQS.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            <iframe
              className="tjp-map"
              title={`${SITE} location`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
            />
          </div>
        </section>
      }
    >
      <RequestQuote />
    </ThemePage>
  );
}

function PolicyBlock({ b }) {
  if (b.ol)
    return (
      <ol className="tjp-policy__ol">
        {b.ol.map(([title, text]) => (
          <li key={title}>
            <strong>{title}</strong>
            {text && <span>{text}</span>}
          </li>
        ))}
      </ol>
    );
  if (b.ul)
    return (
      <ul className="tjp-policy__ul">
        {b.ul.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    );
  return <p className={b.strong ? 'tjp-policy__strong' : undefined}>{b.p}</p>;
}

export function PoliciesPage() {
  usePageMeta('Policies', `${SITE} shipping fees, refund and pet crate rental policies.`);
  const [active, setActive] = useState(POLICIES[0].id);

  // highlight the policy being read in the menu
  useEffect(() => {
    const els = POLICIES.map((p) => document.getElementById(p.id)).filter(Boolean);
    if (!els.length || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-30% 0px -60% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div id="pxl-main">
      <PageHero title="Our Policies" crumb="Policies" lede="Clear terms on shipping fees, refunds and pet transport — so you always know what to expect." />
      <section className="tjp tjp-wrap tjp-wrap--tint">
        <div className="tjp-container tjp-policies">
          <nav className="tjp-policies__menu" aria-label="Policies">
            <p className="tjp-eyebrow">Policy menu</p>
            {POLICIES.map((p) => (
              <a key={p.id} href={`#${p.id}`} className={active === p.id ? 'is-active' : undefined} onClick={() => setActive(p.id)}>
                {p.short}
              </a>
            ))}
            <div className="tjp-policies__help">
              <strong>Questions about a charge or refund?</strong>
              <span>Our customer service team is happy to help.</span>
              <a href="tel:+19045676548">+1 (904) 567-6548</a>
              <a href="mailto:support@worldbridgexpress.com">support@worldbridgexpress.com</a>
            </div>
          </nav>

          <div className="tjp-policies__body">
            {POLICIES.map((p) => (
              <article key={p.id} id={p.id} className="tjp-policy">
                <span className="tjp-policy__notice">{p.notice}</span>
                <h2>{p.title}</h2>
                <p className="tjp-policy__intro">{p.intro}</p>
                {p.sections.map((sec) => (
                  <section key={sec.title} className="tjp-policy__section">
                    <h3>{sec.title}</h3>
                    {sec.blocks.map((b, i) => (
                      <PolicyBlock key={i} b={b} />
                    ))}
                  </section>
                ))}
              </article>
            ))}
            <p className="tjp-policies__updated">These policies apply to all shipments handled by {SITE}. Last updated {new Date().getFullYear()}.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export const SITEMAP = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/news', label: 'News & Insights' },
  { href: '/track', label: 'Track a Shipment' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/policies', label: 'Our Policies' },
  ...POLICIES.map((p) => ({ href: `/policies#${p.id}`, label: p.title })),
  { href: '/signup', label: 'Create an Account' },
  { href: '/login', label: 'Sign In' },
  ...POSTS.map((p) => ({ href: `/news/${p.slug}`, label: p.title })),
];

export function SitemapPage() {
  usePageMeta('Site Map', `Every page on the ${SITE} website.`);
  return (
    <div id="pxl-main">
      <PageHero title="Site Map" lede="Every page on our website in one place." />
      <section className="tjp tjp-wrap">
        <div className="tjp-container tjp-narrow">
          <ul className="tjp-sitemap">
            {SITEMAP.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export function NotFoundPage() {
  usePageMeta('Page Not Found');
  return (
    <div id="pxl-main">
      <PageHero title="Page Not Found" crumb="404" lede="The page you are looking for has moved or doesn't exist.">
        <div className="tjp-hero-actions">
          <a className="tjp-btn" href="/">
            Back to Home
          </a>
          <a className="tjp-btn tjp-btn--light" href="/track">
            Track a Shipment
          </a>
        </div>
      </PageHero>
    </div>
  );
}
