import Nav from "@/components/Nav";
import About from "@/components/About";
import Features from "@/components/Features";
import Top from "@/components/Top";
import { Footer } from "@/components";
import Work from "@/components/Work";
import Testimonial from "@/components/Testimonial";
import BentoBox1 from "@/components/BentoBox";
import Faq from "@/components/FAQ";

const HomePage = () => {
  return (
    <>
      <Nav />
      <section>
        <Top />
      </section>
      <section className="bg-[#EEEEEE]">
        <Features />
      </section>
      <section className="bg-[#5f5e5e]">
        <BentoBox1 />
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
