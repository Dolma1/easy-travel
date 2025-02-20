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
      <section>
        <Top />
      </section>
      <section className="bg-[#EEEEEE]">
        <Features />
      </section>
      <section className="bg-[#5f5e5e]">
        <BentoBox />
      </section>
      <section className="">
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
