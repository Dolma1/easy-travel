import { ScrollText, ShieldCheck } from "lucide-react";
import { Footer, Header } from "..";

export default function TermsOfService() {
  return (
    <>
    <Header/>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <ScrollText className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <p className="text-gray-600 mb-6">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700">
              By using our budgeting app ("Service"), you agree to be bound by
              these Terms of Service. If you do not agree, please do not use our
              Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              2. Service Description
            </h2>
            <p className="text-gray-700">
              Our Service provides a zero-based budgeting tool to help users
              track expenses, manage budgets, and organize spending. We
              guarantee the worthiness of every money transaction tracked
              through our app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              3. User Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>You must provide accurate transaction information</li>
              <li>
                You are responsible for maintaining the confidentiality of your
                account
              </li>
              <li>
                You agree not to misuse the Service for illegal activities
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              4. Limitation of Liability
            </h2>
            <p className="text-gray-700">
              Our Service is provided "as is". We are not liable for any
              financial losses or damages resulting from your use of the
              budgeting app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Changes to Terms</h2>
            <p className="text-gray-700">
              We may modify these terms at any time. Continued use of the
              Service after changes constitutes acceptance of the new terms.
            </p>
          </section>
        </div>
      </div>
      <Footer/>
    </>
  );
}
