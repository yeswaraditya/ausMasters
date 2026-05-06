import Link from "next/link";
import { GraduationCap, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">
                aus<span className="text-blue-400">Masters</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your gateway to studying abroad. Expert guidance for student
              visas, applications, and everything in between.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-300 mb-4">
              Features
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/chat"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Visa Profile Chat
                </Link>
              </li>
              <li>
                <Link
                  href="/gs-questionnaire"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  GS Questionnaire
                </Link>
              </li>
              <li>
                <Link
                  href="/sop-helper"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  SOP Helper
                </Link>
              </li>
              <li>
                <Link
                  href="/checklist"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Visa Checklist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-300 mb-4">
              Tools
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/country-compare"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Country Comparison
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Resources & Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-300 mb-4">
              Countries
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-400 text-sm">
                  🇦🇺 Australia
                </span>
              </li>
              <li>
                <span className="text-gray-500 text-sm">
                  🇺🇸 USA (Coming Soon)
                </span>
              </li>
              <li>
                <span className="text-gray-500 text-sm">
                  🇩🇪 Germany (Coming Soon)
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ausMasters. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              support@ausmasters.com
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Sydney, Australia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
