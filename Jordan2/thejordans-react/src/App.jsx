import { lazy, Suspense } from 'react';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import SidePanel from './components/SidePanel.jsx';
import SearchPopup from './components/SearchPopup.jsx';
import CartSidebar from './components/CartSidebar.jsx';
import WishlistPopup from './components/WishlistPopup.jsx';
import ContactWidget from './components/ContactWidget.jsx';
import SiteForms, { isTrackPath } from './components/SiteForms.jsx';
import useLegacyScripts from './useLegacyScripts.js';

// the site has two pages: the home page and /track (both served by index.html)
// the tracking page (and its map code) only loads on /track
const TrackPage = lazy(() => import('./components/TrackPage.jsx'));

const onTrackPage = typeof window !== 'undefined' && isTrackPath(window.location.pathname);

export default function App() {
  useLegacyScripts();

  return (
    <>
      <div id="pxl-wapper" className="pxl-wapper">
        <Header />
        {onTrackPage ? (
          <Suspense fallback={<div id="pxl-main" style={{ minHeight: '100vh' }} />}>
            <TrackPage />
          </Suspense>
        ) : (
          <Home />
        )}
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
