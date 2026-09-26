import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-[#26376f] bg-[#14245c] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="grid gap-6 md:grid-cols-3">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-2"
       >

              <span className="text-base font-bold">
                CommerceX
              </span>
            </Link>

            <p className="mt-2 max-w-sm text-xs leading-5 text-indigo-100">
              Your everyday marketplace for electronics,
              fashion, home essentials, beauty, sports,
              and accessories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-white">
              Quick Links
            </h3>

            <div className="mt-2 flex gap-5">
              <Link
                to="/"
                className="text-xs text-indigo-100 transition-colors hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/shop"
                className="text-xs text-indigo-100 transition-colors hover:text-white"
              >
                Shop
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-white">
              Contact
            </h3>

            <div className="mt-2 space-y-2">

              <div className="flex items-center gap-2">
                <MapPin
                  size={15}
                  className="shrink-0 text-indigo-300"
                />

                <span className="text-xs text-indigo-100">
                  Jaipur, Rajasthan, India
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Mail
                  size={15}
                  className="shrink-0 text-indigo-300"
                />

                <span className="text-xs text-indigo-100">
                  support@commercex.com
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="text-center text-[11px] text-indigo-200">
            © {new Date().getFullYear()} CommerceX. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;