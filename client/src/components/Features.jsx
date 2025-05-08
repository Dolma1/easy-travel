import React from "react";

const Features = () => {
  const featuresList = [
    {
      icon: "./1.png",
      title: "Intuitive & Clean",
      description:
        "Easy way to track daily expenses and income with a clear monthly calendar view of all transactions.",
      color: "blue-500",
    },
    {
      icon: "./2.png",
      title: "Secure",
      description:
        "Your data is always safe, no matter where you are or what device you use.",
      color: "red-500",
    },
    {
      icon: "./3.png",
      title: "Comprehensive",
      description:
        "Simple but complete list of expense and income categories that you can customize as needed.",
      color: "green-500",
    },
    {
      icon: "./4.png",
      title: "Reliable & Useful",
      description:
        "Set reminders for upcoming transactions and recurring payments – never miss a deadline.",
      color: "orange-500",
    },
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">Features</h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
          Organize your finances, manage your budget, and track expenses with
          our simple yet powerful features.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresList.map((feature, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className="mb-5 p-4 bg-gray-100 rounded-full transition-all duration-300 group-hover:bg-gray-200">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className={`w-12 h-12 object-contain`}
                />
              </div>

              <h3
                className={`font-medium text-lg mb-3 border-b-2 border-${feature.color} pb-2`}
              >
                {feature.title}
              </h3>

              <p className="text-gray-600 text-center text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
