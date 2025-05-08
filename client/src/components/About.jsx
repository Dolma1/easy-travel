import React from "react";

const About = () => {
  return (
    <section id="about" className="bg-gray-50 py-12">
      <div className=" mx-auto px-20">
        <h2 className="text-5xl font-bold text-center text-gray-800 mb-6">
          About
        </h2>
        <p className="text-lg text-center text-gray-600 mb-10">
          A simple travel application to help you manage your finances
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Description section */}
          <div className="md:w-1/2">
            <div className="text-center mb-6">
              <img
                src="boy.png"
                alt="Travel App"
                className="mx-auto w-44 object-cover rounded-full"
              />
            </div>
            <p className="text-gray-600">
              This easy travel app is designed to be simple and intuitive. Track
              expenses, manage budgets, and organize your spending without any
              complicated features getting in your way.
            </p>
          </div>

          {/* Features section */}
          <div className="md:w-1/2 space-y-4">
            <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="bg-green-100 text-green-600 p-2 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Easy to use</h3>
                <p className="text-sm text-gray-500">Simple yet efficient</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="bg-orange-100 text-orange-600 p-2 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12" y2="16"></line>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Comprehensive</h3>
                <p className="text-sm text-gray-500">Complete and detailed</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Safe and Secure</h3>
                <p className="text-sm text-gray-500">Your data is protected</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="bg-red-100 text-red-600 p-2 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Your Best Friend</h3>
                <p className="text-sm text-gray-500">Never miss a payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
