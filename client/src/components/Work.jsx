import { UserCircle2, PlusCircle, DollarSign, NotebookPen } from "lucide-react";

function Work() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6  md:px-10 lg:px-20 ">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-[#586BAF] tracking-wide uppercase">
            How It Works
          </h2>
          <h1 className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-4xl">
            Add Your All Travel Expenses
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Track your spending habits and take control of your finances with
            our simple three-step process.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <div className="relative group">
            <div className="h-full bg-gradient-to-br from-[#7789c8] to-[#243a88] rounded-2xl p-8 transform transition duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-6">
                <UserCircle2 className="w-6 h-6 text-[#586BAF]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Create a account
              </h3>
              <p className="text-white/90">
                Sign up for a free account to start tracking your expenses and
                managing your budget effectively.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative group">
            <div className="h-full bg-white rounded-2xl p-8 shadow-lg transform transition duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-6">
                <PlusCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Add Travel Expenses
              </h3>
              <p className="text-gray-600">
                Easily log your daily transactions and categorize them to
                understand your spending patterns.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative group">
            <div className="h-full bg-gradient-to-br from-[#be8348] to-[#8a4a09] rounded-2xl p-8 transform transition duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-6">
                <DollarSign className="w-6 h-6 text-[#FF8E1F]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Create Budget
              </h3>
              <p className="text-white/90">
                Set monthly budgets for different categories and receive alerts
                to stay on track with your financial goals.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative group">
            <div
              className="h-full bg-gradient-to-br from-[#6e80a8] to-[#1e315f]
 rounded-2xl p-8 transform transition duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-6">
                {/* <DollarSign className="w-6 h-6 text-[#FF8E1F]" /> */}
                <NotebookPen className="w-6 h=6 text-[#FF8E1F]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Travel Journal
              </h3>
              <p className="text-white/90">
                Maintain and manage your travel journal in the application.
                Every travel is a moment worth to remember
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Work;
