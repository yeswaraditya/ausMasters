"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, FileText, PenTool, CheckSquare, GraduationCap } from "lucide-react";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

const tools = [
  {
    icon: FileText,
    title: "GS Questionnaire",
    description: "Complete your Genuine Student questionnaire with guided prompts and character limits built in.",
    href: "/gs-questionnaire",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: PenTool,
    title: "SOP Helper",
    description: "Write a compelling Statement of Purpose with structured sections and word count tracking.",
    href: "/sop-helper",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: CheckSquare,
    title: "Visa Checklist",
    description: "Track every document you need for your student visa application in one place.",
    href: "/checklist",
    gradient: "from-emerald-500 to-teal-600",
  },
];

export default function Home() {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="overflow-hidden">
        <section className="relative min-h-[95vh] hero-gradient overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />
        </section>
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
                Free Tools
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Everything you need to{" "}
                <span className="gradient-text">apply successfully</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div key={tool.title} className="bg-white rounded-2xl border border-gray-200 p-8 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${tool.gradient} opacity-5 rounded-bl-3xl`} />
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{tool.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[95vh] hero-gradient overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />

        <div className="relative flex items-center justify-center min-h-[95vh] px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm backdrop-blur-sm border border-white/10 mb-8">
              <GraduationCap className="w-4 h-4 text-blue-300" />
              Built by a student, for students
            </span>

            <h1 
              style={{ fontFamily: '"Awesome Serif", Georgia, serif', letterSpacing: "0.05em", fontSize: "clamp(1.8rem, 5vw, 5rem)" }} 
              className="font-bold text-white mb-8 leading-[1] tracking-tight"
            >
              Your Australian{" "}
              <span className="gradient-text-blue">Student Visa</span>
              <br />
              Guidance Platform
            </h1>

            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              When I was planning my journey to Australia, I struggled to find clear visa guidance.
              So I built this platform — completely free — to help students navigate the process with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gs-questionnaire"
                style={{ fontFamily: '"Awesome Serif", Georgia, serif' }}
                className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-full hover:from-blue-700 hover:to-blue-600 transition-all shadow-2xl shadow-blue-600/40 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/checklist"
                style={{ fontFamily: '"Awesome Serif", Georgia, serif' }}
                className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-white/20 text-white font-semibold rounded-full hover:bg-white/30 transition-all backdrop-blur-md border border-white/30"
              >
                View Checklist
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8 relative z-10">
              <span className="text-white/70 text-sm">Follow my journey:</span>
              <span className="text-white font-medium text-sm">Eswar Aditya Yarlagadda</span>
              <a
                href="https://www.linkedin.com/in/yarlagaddaeswaraditya/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/eswaraditya5/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 block">
              Free Tools
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Everything you need to{" "}
              <span className="gradient-text">apply successfully</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
              Three powerful tools to prepare your Australian student visa application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.title}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                >
                  <Link
                    href={tool.href}
                    className="card-hover group block bg-white rounded-2xl border border-gray-200 p-8 relative overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${tool.gradient} opacity-5 rounded-bl-3xl group-hover:opacity-10 transition-opacity`} />
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{tool.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                      Open tool
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}