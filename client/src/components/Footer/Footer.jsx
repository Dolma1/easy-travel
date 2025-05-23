import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Mail,
  Phone,
  Layers,
} from "lucide-react";

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 50;
      const sectionPosition =
        section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: sectionPosition - offset,
        behavior: "smooth",
      });
    }
  };
  return (
    <footer className="px-4 md:px-8 lg:px-16 py-8 bg-gray-300 text-gray-800">
      <div className="flex flex-wrap gap-8 justify-between">
        {/* Logo and About Section */}
        <div className="flex-1">
          <Link
            to="/"
            className="flex items-center space-x-2 text-[#586BAF] hover:text-indigo-500 transition-colors"
          >
            <Layers className="h-8 w-8" />
            <span className="font-bold text-xl hidden sm:block">
              Easy Travel
            </span>
          </Link>
          <p className="mt-2 text-sm">
            The easy-to-use zero-based budgeting app that helps you keep tabs on
            your money at a glance anytime, anywhere
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-600 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 min-w-[150px]">
          <h2 className="font-semibold mb-2">Quick Links</h2>
          <button
            onClick={() => scrollToSection("home")}
            className="block hover:text-gray-600 transition-colors py-1"
          >
            <span>Home</span>
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="block hover:text-gray-600 transition-colors py-1"
          >
            <span>About Us</span>
          </button>
          <button
            onClick={() => scrollToSection("works")}
            className="block hover:text-gray-600 transition-colors py-1"
          >
            <span>Works</span>
          </button>
          {/* <button
            onClick={() => scrollToSection("solutions")}
            className="block hover:text-gray-600 transition-colors py-1"
          >
            <span>Solutions</span>
          </button> */}
        </div>

        {/* Additional Sections */}
        <div className="flex-1 min-w-[150px]">
          <h2 className="font-semibold mb-2">Resources</h2>
          {/* <button
            onClick={() => scrollToSection("faq")}
            className="block hover:text-gray-600 transition-colors py-1"
          >
            <span>FAQs</span>
          </button> */}
          <Link
            to="/terms"
            className="block hover:text-gray-600 transition-colors py-1"
          >
            Terms of Service
          </Link>
          <Link
            to="/privacy"
            className="block hover:text-gray-600 transition-colors py-1"
          >
            Privacy Policy
          </Link>
          <Link
            to="/support"
            className="block hover:text-gray-600 transition-colors py-1"
          >
            Support
          </Link>
        </div>

        {/* Contact Section */}
        <div className="flex-1 min-w-[200px]">
          <h2 className="font-semibold mb-2">Contact</h2>
          <div className="space-y-2">
            <p className="text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              1234 Street Name, City, Country
            </p>
            <p className="text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" />
              email@example.com
            </p>
            <p className="text-sm flex items-center gap-2">
              <Phone className="w-4 h-4" />
              +123 456 7890
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Easy Travel. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
