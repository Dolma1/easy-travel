import { UserCircle2, PlusCircle, DollarSign, NotebookPen } from "lucide-react";

function Work() {
  const steps = [
    {
      icon: <UserCircle2 className="w-5 h-5 text-blue-600" />,
      title: "Create an account",
      description:
        "Sign up for free to start tracking your expenses and managing your budget.",
      color: "bg-blue-50 text-blue-800",
    },
    {
      icon: <PlusCircle className="w-5 h-5 text-red-600" />,
      title: "Add Travel Expenses",
      description:
        "Log your transactions and categorize them to understand your spending patterns.",
      color: "bg-red-50 text-red-800",
    },
    {
      icon: <DollarSign className="w-5 h-5 text-orange-600" />,
      title: "Create Budget",
      description:
        "Set monthly budgets for different categories and receive alerts to stay on track.",
      color: "bg-orange-50 text-orange-800",
    },
    {
      icon: <NotebookPen className="w-5 h-5 text-indigo-600" />,
      title: "Travel Journal",
      description:
        "Maintain your travel journal in the app. Every travel is a moment worth remembering.",
      color: "bg-indigo-50 text-indigo-800",
    },
  ];

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-sm font-medium text-blue-600">
            How It Works
          </span>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Add Your Travel Expenses
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Track your spending habits and take control of your finances with
            our simple process.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="border rounded-lg p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.color.split(" ")[0]
                    }`}
                  >
                    {step.icon}
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Work;
