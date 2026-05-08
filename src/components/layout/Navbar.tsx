"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu, X, FileText, PenTool, CheckSquare, GraduationCap, Users, MessageSquare, ChevronDown, BarChart2, Plane, Calculator } from "lucide-react";

const navLinks = [
  {
    type: "dropdown" as const,
    label: "Tools",
    icon: FileText,
    children: [
      { href: "/gs-questionnaire", label: "GS Form", icon: FileText },
      { href: "/sop-helper", label: "SOP Helper", icon: PenTool },
      { href: "/checklist", label: "Visa Checklist", icon: CheckSquare },
      { href: "/pre-departure-checklist", label: "Pre-Departure Checklist", icon: Plane },
      { href: "/ielts-calculator", label: "IELTS Calculator", icon: BarChart2 },
      { href: "/living-cost", label: "Living Cost", icon: Calculator },
    ],
  },
  {
    type: "dropdown" as const,
    label: "Resources",
    icon: GraduationCap,
    children: [
      { href: "/university-priorities", label: "University Priorities", icon: GraduationCap },
      { href: "/communities", label: "Communities", icon: Users },
    ],
  },
  { href: "https://forms.gle/trzo4toSxzsddirr9", label: "Feedback", icon: MessageSquare, external: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdowns, setOpenMobileDropdowns] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLinkClick = () => {
    setIsOpen(false);
    setOpenDropdown(null);
    setOpenMobileDropdowns({});
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="flex items-center h-14 lg:h-16 px-4 lg:px-8">
        <Link href="/" className="flex items-center flex-shrink-0 mr-4 lg:mr-8" onClick={handleLinkClick}>
          <span className="text-lg font-bold tracking-tight text-gray-900 whitespace-nowrap">
            aus<span className="text-blue-600">Masters</span>
          </span>
        </Link>

        <nav className="hidden md:flex flex-row items-center gap-1 flex-1 min-w-0">
          {navLinks.map((link) => {
            if ("type" in link && link.type === "dropdown") {
              const Icon = link.icon;
              const isDropdownOpen = openDropdown === link.label;

              return (
                <div key={link.label} className="relative" ref={isDropdownOpen ? dropdownRef : null}>
                  <button
                    onClick={() => setOpenDropdown(isDropdownOpen ? null : link.label)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{link.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[200] min-w-[200px] py-1">
                      {link.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                        >
                          <child.icon className="w-4 h-4" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const Icon = link.icon;
            const isActive = link.href ? pathname === link.href : false;
            const isExternal = link.external || (link.href && link.href.startsWith("http"));

            if (isExternal) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{link.label}</span>
                </a>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href!}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0 ml-auto"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              if ("type" in link && link.type === "dropdown") {
                const Icon = link.icon;
                const isMobileOpen = openMobileDropdowns[link.label];

                return (
                  <div key={link.label}>
                    <button
                      onClick={() =>
                        setOpenMobileDropdowns((prev) => ({
                          ...prev,
                          [link.label]: !prev[link.label],
                        }))
                      }
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full"
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 ml-auto transition-transform ${
                          isMobileOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isMobileOpen && (
                      <div className="ml-8 space-y-1">
                        {link.children?.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <child.icon className="w-5 h-5" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const Icon = link.icon;
              const isActive = link.href ? pathname === link.href : false;
              const isExternal = link.external || (link.href && link.href.startsWith("http"));

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
                  href={link.href!}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
