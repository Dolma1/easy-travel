import { Lock, CreditCard, Mail } from "lucide-react";
import { Footer, Header } from "../";

export default function PrivacyPolicy1() {
  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto p-6 mt-20">
        <div className="flex items-center gap-3 mb-8">
          <Lock className="w-8 h-8 text-[#4338CA]" />
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-gray-600 mb-6">
            Effective Date: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 mt-0.5 text-[#4338CA] flex-shrink-0" />
                <p>
                  <strong>Financial Data:</strong> Transaction amounts,
                  categories, and budget information you enter.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 text-[#4338CA] flex-shrink-0" />
                <p>
                  <strong>Account Information:</strong> Email address and basic
                  profile details when you register.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>To provide and improve our budgeting services</li>
              <li>To personalize your experience</li>
              <li>For security and fraud prevention</li>
              <li>To communicate with you about your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Data Security</h2>
            <p className="text-gray-700">
              We implement industry-standard security measures to protect your
              financial data. However, no method of transmission over the
              internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              4. Third-Party Services
            </h2>
            <p className="text-gray-700">
              We may use third-party services (like analytics tools) that
              collect anonymous usage data. These services have their own
              privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
            <p className="text-gray-700">
              You can request access to or deletion of your personal data at any
              time by contacting our support team.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
