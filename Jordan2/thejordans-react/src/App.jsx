import { lazy, Suspense, useLayoutEffect, useEffect } from 'react';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import SidePanel from './components/SidePanel.jsx';
import SearchPopup from './components/SearchPopup.jsx';
import CartSidebar from './components/CartSidebar.jsx';
import WishlistPopup from './components/WishlistPopup.jsx';
import ContactWidget from './components/ContactWidget.jsx';
import SiteForms from './components/SiteForms.jsx';
import { AboutPage, ContactPage, NewsDetailPage, NewsPage, NotFoundPage, ServicesPage, SitemapPage } from './components/Pages.jsx';
import { AccountPage, ForgotPasswordPage, ResetPasswordPage, SignInPage, SignUpPage } from './components/AuthPages.jsx';
import { customerAuth } from './lib/customerAuth.js';
import useLegacyScripts from './useLegacyScripts.js';

// the tracking page (and its map code) only loads on /track
const TrackPage = lazy(() => import('./components/TrackPage.jsx'));

/*
 * One page per address (all served by index.html - see vercel.json). Links are
 * ordinary <a href>s, so each page is a fresh load and the theme's scripts
 * start cleanly on it.
 */
const path = (typeof window !== 'undefined' ? window.location.pathname : '/').replace(/\/+$/, '') || '/';

function route() {
  if (path === '/') return { key: '/', page: <Home /> };
  if (path === '/about') return { key: '/about', page: <AboutPage /> };
  if (path === '/services') return { key: '/services', page: <ServicesPage /> };
  if (path === '/news') return { key: '/news', page: <NewsPage /> };
  const post = path.match(/^\/news\/([a-z0-9-]+)$/);
  if (post) return { key: '/news', page: <NewsDetailPage slug={post[1]} /> };
  if (path === '/contact') return { key: '/contact', page: <ContactPage /> };
  if (path === '/sitemap') return { key: '', page: <SitemapPage /> };
  if (path === '/login') return { key: '', page: <SignInPage /> };
  if (path === '/signup') return { key: '', page: <SignUpPage /> };
  if (path === '/forgot-password') return { key: '', page: <ForgotPasswordPage /> };
  if (path === '/reset-password') return { key: '', page: <ResetPasswordPage /> };
  if (path === '/account') return { key: '', page: <AccountPage /> };
  if (path === '/track')
    return {
      key: '/track',
      page: (
        <Suspense fallback={<div id="pxl-main" style={{ minHeight: '100vh' }} />}>
          <TrackPage />
        </Suspense>
      ),
    };
  return { key: '', page: <NotFoundPage /> };
}

const current = route();

export default function App() {
  useLegacyScripts();

  // highlight the current page in every copy of the menu (desktop, sticky, mobile)
  useLayoutEffect(() => {
    document.querySelectorAll('.pxl-menu-primary > li').forEach((li) => {
      const a = li.querySelector(':scope > a');
      const on = !!current.key && a?.getAttribute('href') === current.key;
      li.classList.toggle('current-menu-item', on);
      li.classList.toggle('current_page_item', on);
    });
  }, []);

  // The header's person icon opens the customer account pages (instead of the
  // theme's old hover form): Sign in when signed out, My account when signed in.
  useEffect(() => {
    let signedIn = false;
    const mark = () => document.querySelectorAll('.h-btn-user').forEach((el) => el.classList.toggle('is-signed-in', signedIn));
    const sub = customerAuth?.auth.onAuthStateChange((_e, session) => {
      signedIn = !!session;
      mark();
    });
    const onClick = (e) => {
      const btn = e.target.closest?.('.h-btn-user');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      window.location.assign(signedIn ? '/account' : '/login');
    };
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      sub?.data.subscription.unsubscribe();
    };
  }, []);

  // links like /services#air-freight: scroll once the page (and its images) have laid out
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return undefined;
    const go = () => document.getElementById(id)?.scrollIntoView({ block: 'start' });
    const timers = [setTimeout(go, 300), setTimeout(go, 1500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      <div id="pxl-wapper" className="pxl-wapper">
        <Header />
        {current.page}
        <Footer />
        <ScrollToTop />
        <SidePanel />
        <SearchPopup />
        <CartSidebar />
      </div>
      <WishlistPopup />
      <ContactWidget />
      <SiteForms />
    </>
  );
}
