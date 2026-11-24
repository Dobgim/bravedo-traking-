import ThemePage from './ThemePage.jsx';
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
    <ThemePage>
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
    </ThemePage>
  );
}
