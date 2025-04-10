const About = () => {
  return (
      <section id="about">
        <div className="mx-auto px-4 md:px-10 lg:px-20 py-14 ">
          <h1 className="mt-2 text-4xl  text-center font-extrabold text-gray-900 sm:text-4xl">
            About
          </h1>
          <p className="mt-4 text-center text-xl text-gray-500 mb-20">
            This easy travel application is dedicated in helping you manage your
            financial life.
          </p>

          <div className="flex flex-col lg:flex-row gap-8 mt-10 ">
            <div className="lg:w-1/2 flex flex-col justify-end relative ">
              <div className="flex justify-center">
                <img
                  src="boy.png"
                  alt=""
                  className=" items-center -mt-16 w-[20vw] "
                />
              </div>
              <p className="text-lg text-gray-600 ">
                If you're searching for a complex money management app that
                tries to do it all, this isn't it. This easy travel is simple,
                intuitive, and easy to use. It helps you track expenses, manage
                budgets, and organize your spending so you can save money and
                take control of your finances—without any hassle.
              </p>
            </div>

            <div className="lg:w-1/2 flex flex-col gap-6">
              <div className="flex gap-4 items-center bg-white shadow-md rounded-lg p-4">
                <div className="ring ring-green-400 rounded-full w-12 h-12 flex items-center justify-center">
                  100
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Easy-to-use
                  </h2>
                  <p className="text-sm text-gray-500">Simple yet efficient</p>
                </div>
              </div>

              <div className="flex gap-4 items-center bg-white shadow-md rounded-lg p-4">
                <div className=" ring ring-[#FF8E1F] rounded-full w-12 h-12 flex items-center justify-center">
                  100
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Comprehensive
                  </h2>
                  <p className="text-sm text-gray-500">Complete and detailed</p>
                </div>
              </div>

              <div className="flex gap-4 items-center bg-white shadow-md rounded-lg p-4">
                <div className="ring ring-[#586BAF] rounded-full w-12 h-12 flex items-center justify-center">
                  100
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Safe and Secure
                  </h2>
                  <p className="text-sm text-gray-500">
                    Your data is always protected
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-center bg-white shadow-md rounded-lg p-4">
                <div className="ring ring-red-400 rounded-full w-12 h-12 flex items-center justify-center">
                  100
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Your best Friend
                  </h2>
                  <p className="text-sm text-gray-500">
                    Use it to never miss another payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default About;
