import ScrollToTop from "@/components/ScrollToTop";
import {
  Header,
  Footer,
  Top,
  Features,
  About,
  Work,
  Testimonial,
  BentoBox,
  Faq,
} from "../components/index";

const HomePage = () => {
  return (
    <>
      <Header />
      <section id="top" className="bg-gray-300  ">
        <Top />
      </section>
      <section className="bg-[#EEEEEE]">
        <Features />
      </section>
      {/* <section className="bg-[#5f5e5e]" >
        <BentoBox />
      </section> */}
      <section>
        <About />
      </section>
      <section className="bg-[#EEEEEE] " id="works">
        <Work />
      </section>
      <section>
        <Faq />
      </section>
      <section className="bg-[#EEEEEE] ">
        <Testimonial />
      </section>
      <ScrollToTop />
      <Footer />
    </>
  );
};

export default HomePage;
