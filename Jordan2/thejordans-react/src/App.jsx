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
import TrackPage from './components/TrackPage.jsx';
import useLegacyScripts from './useLegacyScripts.js';

// the site has two pages: the home page and /track (both served by index.html)
const onTrackPage = typeof window !== 'undefined' && isTrackPath(window.location.pathname);

export default function App() {
  useLegacyScripts();

  return (
    <>
      <div id="pxl-wapper" className="pxl-wapper">
        <Header />
        {onTrackPage ? <TrackPage /> : <Home />}
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
