import Hero from './sections/Hero.jsx';
import TrackShipment from './sections/TrackShipment.jsx';
import GetStarted from './sections/GetStarted.jsx';
import ServicesIntro from './sections/ServicesIntro.jsx';
import BusinessServices from './sections/BusinessServices.jsx';
import EcommerceServices from './sections/EcommerceServices.jsx';
import IndustriesIntro from './sections/IndustriesIntro.jsx';
import Industries from './sections/Industries.jsx';
import AboutUs from './sections/AboutUs.jsx';
import Capacity from './sections/Capacity.jsx';
import Expertise from './sections/Expertise.jsx';
import DeliveryFlexibility from './sections/DeliveryFlexibility.jsx';
import Sustainability from './sections/Sustainability.jsx';
import RoadFreight from './sections/RoadFreight.jsx';
import Testimonials from './sections/Testimonials.jsx';
import Partners from './sections/Partners.jsx';
import RequestQuote from './sections/RequestQuote.jsx';
import Insights from './sections/Insights.jsx';
import Faq from './sections/Faq.jsx';

export default function Home() {
  return (
    <div id="pxl-main">
      <div className="elementor-container">
        <div className="row pxl-content-wrap no-sidebar">
          <div id="pxl-content-area" className="pxl-content-area pxl-content-page col-12">
            <main id="pxl-content-main">
              <article id="pxl-post-18" className="post-18 page type-page status-publish hentry">
                <div className="pxl-entry-content clearfix">
                  <div
                    data-elementor-type="wp-page"
                    data-elementor-id="18"
                    className="elementor elementor-18"
                    data-elementor-post-type="page"
                  >
                    <Hero />
                    <TrackShipment />
                    <GetStarted />
                    <ServicesIntro />
                    <BusinessServices />
                    <EcommerceServices />
                    <IndustriesIntro />
                    <Industries />
                    <AboutUs />
                    <Capacity />
                    <Expertise />
                    <DeliveryFlexibility />
                    <Sustainability />
                    <RoadFreight />
                    <Testimonials />
                    <Partners />
                    <RequestQuote />
                    <Insights />
                    <Faq />
                  </div>
                </div>
              </article>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
