import { LifeBuoy, Mail, MessageSquare, Zap } from "lucide-react";
import { Footer, Header } from "..";

export default function Support() {
  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <LifeBuoy className="w-8 h-8 text-[#4338CA]" />
          <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Mail
                className="w-6 h-6 Live Chat
"
              />
              <h2 className="text-xl font-semibold">Email Support</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Have a question? Our team typically responds within 24 hours.
            </p>
            <a
              href="mailto:support@easytravel.com"
              className="inline-flex items-center px-4 py-2 bg-[#4338CA] text-white rounded-md hover:bg-[#4338CA]/90 transition-colors"
            >
              Contact Us
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-emerald-500" />
              <h2 className="text-xl font-semibold">Live Chat</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Get instant help from our support agents during business hours.
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">
              Intergation Soon
            </button>
          </div>

          <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-[#4338CA]" />
              <h2 className="text-xl font-semibold">FAQs</h2>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900">
                  How do I reset my budget?
                </h3>
                <p className="text-gray-700 mt-1">
                  Go to Settings → Budgets → Reset Budget. You can choose to
                  start fresh or carry over balances.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900">
                  Is my financial data secure?
                </h3>
                <p className="text-gray-700 mt-1">
                  Yes! We use bank-level encryption and never store your banking
                  credentials.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">
                  Can I use the app outside my country?
                </h3>
                <p className="text-gray-700 mt-1">
                  Currently we support most currencies, but some features may be
                  limited based on your location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
