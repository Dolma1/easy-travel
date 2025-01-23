import React, { useState } from "react";
import {
  HelpCircle,
  DollarSign,
  PieChart,
  Building2,
  PiggyBank,
  Target,
  Shield,
} from "lucide-react";

function Faq() {
  const [openItem, setOpenItem] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: "What is an Expense Tracker?",
      answer:
        "A tool that helps you track income and expenses, categorize them, and manage your finances better.",
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      id: 2,
      question: "How does it work?",
      answer:
        "Log income and expenses manually or sync with your bank account to track spending in real-time.",
      icon: <PieChart className="w-6 h-6" />,
    },
    {
      id: 3,
      question: "Can it track business expenses?",
      answer:
        "Yes, it can track both personal and business expenses separately.",
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      id: 4,
      question: "How can it help me save money?",
      answer:
        "It helps identify overspending and encourages better budgeting and spending habits.",
      icon: <PiggyBank className="w-6 h-6" />,
    },
    {
      id: 5,
      question: "Can I set budgets?",
      answer:
        "Yes, you can set and track budgets for various spending categories.",
      icon: <Target className="w-6 h-6" />,
    },
    {
      id: 6,
      question: "Is it secure?",
      answer: "Yes, reputable apps use encryption to protect your data.",
      icon: <Shield className="w-6 h-6" />,
    },
  ];

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#97A3CD]/20 to-[#97A3CD]/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 text-[#97A3CD] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-[#97A3CD]">
            Everything you need to know about our Expense Tracker
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ease-in-out hover:shadow-lg"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 flex items-center justify-between focus:outline-none focus:bg-[#97A3CD]/5"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-[#97A3CD]">{item.icon}</div>
                  <span className="text-lg font-medium text-gray-900">
                    {item.question}
                  </span>
                </div>
                <span
                  className={`transform transition-transform duration-200 text-[#97A3CD] ${
                    openItem === item.id ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              <div
                className={`px-6 pb-4 transition-all duration-200 ease-in-out ${
                  openItem === item.id
                    ? "block opacity-100"
                    : "hidden opacity-0"
                }`}
              >
                <p className="text-gray-600 pl-10">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faq;
