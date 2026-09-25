import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#0b1640] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-500">
                <span className="text-sm font-bold">
                  CX
                </span>
              </div>

              <span className="text-lg font-bold">
                CommerceX
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-white">
              Your everyday marketplace for electronics,
              fashion, home essentials, beauty, sports,
              and accessories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/shop"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Contact
            </h3>

            <div className="mt-4 space-y-4">

              <div className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-white0"
                />

                <p className="text-sm leading-5 text-gray-200">
                  Jaipur, Rajasthan, India
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  size={17}
                  className="shrink-0 ttext-white"
                />

                <span className="text-sm text-gray-200">
                  support@commercex.com
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-center text-xs text-white">
            © {new Date().getFullYear()} CommerceX. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;