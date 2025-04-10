import { Ghost, HomeIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-200 flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="animate-pulse">
          <Ghost className="w-24 h-24 mx-auto text-[#6366F1]" />
        </div>

        <div className="space-y-4 animate-fade-up [animation-delay:200ms]">
          <h1 className="text-7xl font-bold text-gray-900 tracking-tighter">
            4
            <span className="inline-block animate-bounce [animation-delay:500ms]">
              0
            </span>
            4
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Oops! This page could not be found.
          </p>
        </div>

        <Button
          onClick={() => nav("/")}
          className="animate-fade-up [animation-delay:400ms] inline-flex items-center px-6 py-3 bg-[#FF8E1F] hover:bg-[#FF7A00] text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          size="lg"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Return Home
        </Button>
      </div>
    </div>
  );
}

export default PageNotFound;
