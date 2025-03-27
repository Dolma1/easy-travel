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
      <section id="top">
        <Top />
      </section>
      <section className="bg-[#EEEEEE]" id="features">
        <Features />
      </section>
      <section className="bg-[#5f5e5e]">
        <BentoBox />
      </section>
      <section id="about">
        <About />
      </section>
      <section className="bg-[#EEEEEE] ">
        <Work />
      </section>
      <section>
        <Faq />
      </section>
      <section className="bg-[#EEEEEE] ">
        <Testimonial />
      </section>
      <Footer />
    </>
  );
};

export default HomePage;
