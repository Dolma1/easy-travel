import React, { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  Plane,
  Globe,
  Building2,
  PiggyBank,
  DollarSign,
} from "lucide-react";

const Faq = () => {
  const [openItem, setOpenItem] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: "What is Easy Travel?",
      answer:
        "Easy Travel is a travel planning tool that helps you organize trips, track expenses, find accommodations, and create itineraries all in one place.",
      icon: <Plane className="w-5 h-5" />,
    },
    {
      id: 2,
      question: "How does Easy Travel work?",
      answer:
        "Input your destination and travel dates, and Easy Travel will help you organize your journey - from finding flights and accommodations to creating itineraries and managing your budget.",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      id: 3,
      question: "Can I track business travel expenses?",
      answer:
        "Yes, you can categorize trips as personal or business, with dedicated expense tracking for business trips to simplify reimbursement and tax documentation.",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: 4,
      question: "How can Easy Travel help me save money?",
      answer:
        "Our price comparison helps you find the best deals on flights, accommodations, and activities. The budget tracker helps you set and maintain travel spending limits.",
      icon: <PiggyBank className="w-5 h-5" />,
    },
    {
      id: 5,
      question: "Can I set travel budgets?",
      answer:
        "Yes! You can set trip budgets and break them down by categories like accommodation, transportation, food, and activities. Our dashboard shows real-time spending against your budget.",
      icon: <DollarSign className="w-5 h-5" />,
    },
  ];

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className="py-12 px-4" id="faq">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Everything you need to know about Easy Travel
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left"
              >
                <div className="flex items-center">
                  <span className="text-blue-500 mr-3">{item.icon}</span>
                  <span className="font-medium">{item.question}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    openItem === item.id ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {openItem === item.id && (
                <div className="px-4 py-3 border-t">
                  <p className="text-gray-600 text-sm">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
