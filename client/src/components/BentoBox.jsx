import React from "react";
import {
  Wallet,
  LineChart,
  Clock,
  PiggyBank,
  BarChart3,
  CreditCard,
} from "lucide-react";

function BentoBox({
  title,
  description,
  icon: Icon,
  className = "",
  imageUrl = "",
}) {
  return (
    <div
      className={`p-6 rounded-3xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      {imageUrl && (
        <div className="mt-4 overflow-hidden rounded-xl">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
    </div>
  );
}

function BentoBox1() {
  return (
    <div className="min-h-screen bg-gray-100  px-4 md:px-10 lg:px-20  p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Financial Management Solutions
          </h1>
          <p className="text-xl text-gray-600">
            Tackle your financial challenges with smart tracking and insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BentoBox
            title="Budget Control"
            description="Set and manage budgets for different categories to prevent overspending and maintain financial discipline."
            icon={Wallet}
            className="lg:col-span-2"
            imageUrl="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80"
          />

          <BentoBox
            title="Expense Tracking"
            description="Keep detailed records of all expenses with automated tracking and categorization."
            icon={LineChart}
            imageUrl="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
          />

          <BentoBox
            title="Time-Saving Automation"
            description="Save time with automated features like receipt scanning and direct bank syncing."
            icon={Clock}
            className="md:col-span-2 lg:col-span-1"
          />

          <BentoBox
            title="Financial Planning"
            description="Make informed decisions about savings and investments based on your spending patterns."
            icon={PiggyBank}
          />

          <BentoBox
            title="Visual Insights"
            description="Understand your finances better through intuitive charts, graphs, and comprehensive reports."
            icon={BarChart3}
            className="lg:col-span-2"
            imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
          />

          <BentoBox
            title="Account Management"
            description="Easily manage and track multiple bank accounts and credit cards in one centralized place."
            icon={CreditCard}
            className="md:col-span-2 lg:col-span-3"
            imageUrl="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80"
          />
        </div>
      </div>
    </div>
  );
}

export default BentoBox1;
