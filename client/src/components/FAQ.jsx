import React, { useState } from "react";
import {
  HelpCircle,
  DollarSign,
  PieChart,
  Building2,
  PiggyBank,
  Shield,
  ChevronDown,
  Plane,
  Globe,
  Clock,
} from "lucide-react";

const Faq = () => {
  const [openItem, setOpenItem] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: "What is Easy Travel?",
      answer:
        "Easy Travel is a comprehensive travel planning tool that helps you organize trips, track expenses, find accommodations, and create detailed itineraries all in one place.",
      icon: <Plane className="w-6 h-6" />,
    },
    {
      id: 2,
      question: "How does Easy Travel work?",
      answer:
        "Simply input your destination and travel dates, and Easy Travel will help you organize every aspect of your journey - from finding flights and accommodations to creating daily itineraries and managing your travel budget.",
      icon: <Globe className="w-6 h-6" />,
    },
    {
      id: 3,
      question: "Can I track business travel expenses?",
      answer:
        "Yes, Easy Travel allows you to categorize trips as personal or business, with dedicated expense tracking and reporting for business trips to simplify reimbursement and tax documentation.",
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      id: 4,
      question: "How can Easy Travel help me save money?",
      answer:
        "Our price comparison features help you find the best deals on flights, accommodations, and activities. The budget tracker helps you set and maintain travel spending limits, with alerts when you're approaching your threshold.",
      icon: <PiggyBank className="w-6 h-6" />,
    },
    {
      id: 5,
      question: "Can I set travel budgets?",
      answer:
        "Absolutely! You can set overall trip budgets and break them down by categories like accommodation, transportation, food, and activities. Our dashboard shows real-time spending against your budget.",
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      id: 6,
      question: "Is my payment information secure?",
      answer:
        "Yes, we use bank-level encryption to protect all your sensitive data. We're fully compliant with global security standards and never store complete credit card information on our servers.",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      id: 7,
      question: "Can I use Easy Travel to plan multi-city trips?",
      answer:
        "Definitely! Easy Travel excels at organizing complex itineraries with multiple destinations. You can add as many locations as you need and our planner will help create the most efficient route.",
      icon: <PieChart className="w-6 h-6" />,
    },
    {
      id: 8,
      question: "Does Easy Travel work offline?",
      answer:
        "Yes, you can download your trip details for offline access. While some features require connectivity, your itineraries, reservations, and important documents are always available offline.",
      icon: <Clock className="w-6 h-6" />,
    },
  ];

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <HelpCircle className="w-12 h-12 text-[#4338CA]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Easy Travel to make your journey
            planning seamless
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-5 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 focus:ring-opacity-50"
                aria-expanded={openItem === item.id}
                aria-controls={`faq-answer-${item.id}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 bg-blue-50 p-3 rounded-full text-[#4338CA]">
                    {item.icon}
                  </div>
                  <span className="text-lg font-medium text-gray-900">
                    {item.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    openItem === item.id ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              <div
                id={`faq-answer-${item.id}`}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openItem === item.id ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 pt-2">
                  <p className="text-gray-600 pl-14">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
