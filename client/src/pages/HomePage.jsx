import { Button } from "@/components/ui/button";
import Nav from "@/components/Nav";
import About from "@/components/About";
import Features from "@/components/Features";
import Top from "@/components/Top";
import { Footer } from "@/components";
import Work from "@/components/Work";

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
      <section className="">
        <About />
      </section>
      <section className="bg-[#EEEEEE] ">
        <Work />
      </section>
      <Footer />
    </>
  );
};

export default HomePage;
