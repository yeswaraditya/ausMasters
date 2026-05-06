"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Globe,
  MessageSquare,
  FileText,
  Home,
  ChevronDown,
  GraduationCap,
  PenTool,
  CheckSquare,
  BookOpen,
  LayoutDashboard,
  Moon,
  Sun,
  LogIn,
  LogOut,
} from "lucide-react";
import { countries } from "@/data/countries";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Visa Chat", icon: MessageSquare },
  { href: "/gs-questionnaire", label: "GS Form", icon: FileText },
  { href: "/sop-helper", label: "SOP Helper", icon: PenTool },
  { href: "/checklist", label: "Checklist", icon: CheckSquare },
  { href: "/country-compare", label: "Compare", icon: Globe },
  { href: "/resources", label: "Resources", icon: BookOpen },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeCountry = countries.find((c) => c.status === "active");
  const isDark = theme === "dark";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const textColor = scrolled || isDark
    ? isDark
      ? "text-gray-300 hover:text-white hover:bg-gray-800"
      : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
    : "text-white/90 hover:text-white hover:bg-white/10";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? "bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-800"
            : "bg-white/90 backdrop-blur-md shadow-md"
          : isDark
            ? "bg-transparent"
            : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap
              className={`w-8 h-8 ${isDark ? "text-blue-400" : "text-blue-600"}`}
            />
            <span
              className={`text-xl font-bold ${scrolled || isDark ? (isDark ? "text-white" : "text-gray-900") : "text-white"}`}
            >
              aus<span className="text-blue-500">Masters</span>
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : textColor
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}

            <div className="relative ml-2">
              <button
                onClick={() => setCountryOpen(!countryOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${textColor}`}
              >
                <Globe className="w-4 h-4" />
                {activeCountry?.flag} {activeCountry?.name}
                <ChevronDown className="w-3 h-3" />
              </button>

              <AnimatePresence>
                {countryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className={`absolute right-0 mt-2 w-64 rounded-xl shadow-lg border py-2 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                  >
                    {countries.map((country) => (
                      <div
                        key={country.code}
                        className={`px-4 py-3 flex items-center justify-between ${country.status === "coming-soon" ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{country.flag}</span>
                          <div>
                            <p
                              className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              {country.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {country.status === "active"
                                ? "Available"
                                : "Coming soon"}
                            </p>
                          </div>
                        </div>
                        {country.status === "active" && (
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={toggleTheme}
              className={`ml-2 p-2 rounded-lg transition-colors ${textColor}`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <Link
              href="/dashboard"
              className={`ml-2 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${textColor}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="ml-2 flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="ml-2 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${scrolled || isDark ? (isDark ? "text-gray-300" : "text-gray-700") : "text-white"}`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg ${scrolled || isDark ? (isDark ? "text-gray-300" : "text-gray-700") : "text-white"}`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`xl:hidden ${isDark ? "bg-gray-900 border-t border-gray-800" : "bg-white border-t"}`}
          >
            <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : isDark
                          ? "text-gray-300 hover:bg-gray-800"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </Link>
                )}
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p
                  className={`px-4 text-xs uppercase tracking-wide mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}
                >
                  Countries
                </p>
                {countries.map((country) => (
                  <div
                    key={country.code}
                    className={`flex items-center gap-3 px-4 py-2 ${country.status === "coming-soon" ? "opacity-50" : ""}`}
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {country.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
