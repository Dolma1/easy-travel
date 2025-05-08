import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Top = () => {
  const userId = useSelector((state) => state.auth.user);

  return (
    <section className="py-16 px-4" id="home">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8">
        {/* Text Content */}
        <div className="md:w-1/2">
          <span className="text-blue-600 font-medium">Get Started</span>

          <h1 className="text-3xl md:text-4xl font-bold mt-3 leading-tight">
            We <span className="text-blue-600">Guarantee</span> The Worthiness
            Of Every <span className="text-blue-600">Money</span> Transaction.
          </h1>

          <p className="my-5 text-gray-600">
            The easy-to-use budgeting app that helps you keep tabs on your money
            at a glance—anytime, anywhere.
          </p>

          <Link to={userId ? "/dashboard" : "/register"}>
            <Button>
              {userId ? "Go to Dashboard" : "Create Free Account"}
            </Button>
          </Link>
        </div>

        {/* Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="./boy1.png"
            alt="Easy Travel App"
            className="w-full max-w-sm mt-10"
          />
        </div>
      </div>
    </section>
  );
};

export default Top;
