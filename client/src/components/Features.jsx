const Features = () => {
  return (
    <>
      <div className="flex items-center gap-5 px-4 md:px-10 lg:px-20  py-10 ">
        <div className=" ">
          <h1 className="mt-2 text-4xl  text-center font-extrabold text-gray-900 sm:text-4xl">
            FEATURES
          </h1>
          <p className="mt-4 text-center text-xl text-gray-500 mb-20">
            Organize your incomes, manage your family budget, keep track of
            expenses while traveling and understand where all your money are
            with some great, yet simple features.
          </p>
          <div className="flex flex-col  md:flex-row gap-6">
            <div className=" text-center ">
              <div className=" flex justify-center ">
                <p className="">
                  <img
                    src="./1.png"
                    alt=""
                    className="ring-[8px] ring-[#c9c6c6] rounded-full p-7  hover:ring-[#586BAF] hover:ring-[8px] "
                  />
                </p>
              </div>

              <h2 className="font-bold mt-5 underline  underline-offset-8 decoration-[#586BAF] decoration-[3px]">
                {" "}
                Intuitive & Clean
              </h2>
              <p className="mt-5 text-[#595959] ">
                Easy and simple way to track daily expenses and income. The main
                screen shows a calendar with a clear monthly view of all
                transactions.
              </p>
            </div>

            <div className=" text-center ">
              <div className=" flex justify-center ">
                <p className="ring-[8px] ring-[#c9c6c6] rounded-full p-7  hover:ring-red-500 hover:ring-[8px] ">
                  <img src="./2.png" alt="" />
                </p>
              </div>

              <h2 className="font-bold mt-5 underline  underline-offset-8 decoration-red-500 decoration-[3px]">
                {" "}
                Secure
              </h2>
              <p className="mt-5 text-[#595959]  ">
                Your data is always safe, no matter where you are or what device
                you use.
              </p>
            </div>

            <div className=" text-center ">
              <div className=" flex justify-center ">
                <p className="ring-[8px] ring-[#c9c6c6] rounded-full p-7  hover:ring-green-500 hover:ring-[8px] ">
                  <img src="./3.png" alt="" className=" " />
                </p>
              </div>

              <h2 className="font-bold mt-5 underline  underline-offset-8 decoration-green-500 decoration-[3px]">
                {" "}
                Comprehensive
              </h2>
              <p className="mt-5 text-[#595959]  ">
                A simple but complete list of expense and income categories. You
                can add or edit categories if needed
              </p>
            </div>

            <div className=" text-center ">
              <div className=" flex justify-center ">
                <p className="ring-[8px] ring-[#c9c6c6] rounded-full p-7  hover:ring-[#FF8E1F] hover:ring-[8px] ">
                  <img src="./4.png" alt="" />
                </p>
              </div>

              <h2 className="font-bold mt-5 underline  underline-offset-8 decoration-[#FF8E1F] decoration-[3px]">
                {" "}
                Reliable & Useful
              </h2>
              <p className="mt-5 text-[#595959]  ">
                Set reminders for upcoming transactions and recurring payments –
                never miss a deadline.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;
