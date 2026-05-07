"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText, PenTool, CheckSquare, GraduationCap, Users, MessageSquare } from "lucide-react";

const navLinks = [
  { href: "/gs-questionnaire", label: "GS Form", icon: FileText },
  { href: "/sop-helper", label: "SOP Helper", icon: PenTool },
  { href: "/checklist", label: "Checklist", icon: CheckSquare },
  { href: "/university-priorities", label: "Priorities", icon: GraduationCap },
  { href: "/communities", label: "Communities", icon: Users },
  { href: "https://forms.gle/trzo4toSxzsddirr9", label: "Feedback", icon: MessageSquare, external: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-500`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-gray-900 transition-colors duration-300">
              aus<span className="text-blue-600">Masters</span>
            </span>
          </Link>

          <nav style={{ display: "flex", flexDirection: "row", gap: "4px" }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              const isExternal = link.external || link.href.startsWith("http");
              
              if (isExternal) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                      color: "#4b5563",
                      textDecoration: "none",
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ width: 16, height: 16 }} />
                    {link.label}
                  </a>
                );
              }
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                    color: isActive ? "#1d4ed8" : "#4b5563",
                    backgroundColor: isActive ? "#eff6ff" : "transparent",
                    textDecoration: "none",
                  }}
                >
                  <Icon className="w-4 h-4" style={{ width: 16, height: 16 }} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                const isExternal = link.external || link.href.startsWith("http");
                
                if (isExternal) {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </a>
                  );
                }
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}