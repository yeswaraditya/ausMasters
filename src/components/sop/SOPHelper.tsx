"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSyncExternalStore } from "react";
import {
  FileText,
  Save,
  Copy,
  Download,
  AlertCircle,
  CheckCircle,
  ListChecks,
  Bold,
  Italic,
  Underline,
  ListOrdered,
  List,
} from "lucide-react";
import jsPDF from "jspdf";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function loadSections(): SOPSection[] | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("sop-sections");
  if (saved) {
    try {
      return JSON.parse(saved) as SOPSection[];
    } catch {
      return null;
    }
  }
  return null;
}

const SOP_SECTIONS = [
  {
    id: "introduction",
    title: "INTRODUCTION",
    description: "Brief introduction about yourself and your motivation for pursuing this course",
    suggestedWords: "150-200",
  },
  {
    id: "educational-background",
    title: "EDUCATIONAL BACKGROUND",
    description: "Your educational qualifications, achievements, and relevant coursework",
    suggestedWords: "200-250",
  },
  {
    id: "motivation-masters",
    title: "MOTIVATION FOR MASTERS IN THIS SPECIFIC COURSE",
    description: "Why you have chosen to pursue this specific master's program",
    suggestedWords: "200-250",
  },
  {
    id: "financials",
    title: "FINANCIALS",
    description: "Details about your financial capability and funding sources for your studies",
    suggestedWords: "150-200",
  },
  {
    id: "reasons-abroad",
    title: "REASONS FOR CHOOSING ABROAD EDUCATION THAN INDIA",
    description: "Why you prefer to study abroad instead of continuing in India",
    suggestedWords: "150-200",
  },
  {
    id: "not-choose-country-1",
    title: "REASONS FOR NOT CHOOSING COUNTRY-1",
    description: "Why you did not choose other popular study destinations",
    suggestedWords: "100-150",
  },
  {
    id: "not-choose-country-2",
    title: "REASONS FOR NOT CHOOSING COUNTRY-2",
    description: "Why you did not choose another alternative country",
    suggestedWords: "100-150",
  },
  {
    id: "australia-destination",
    title: "AUSTRALIA AS A STUDY DESTINATION",
    description: "Why Australia is your preferred study destination",
    suggestedWords: "150-200",
  },
  {
    id: "specific-university",
    title: "WHY THIS SPECIFIC UNIVERSITY",
    description: "Why you chose this particular university for your studies",
    suggestedWords: "150-200",
  },
  {
    id: "not-other-universities",
    title: "WHY NOT OTHER UNIVERSITIES",
    description: "Why you did not choose other universities",
    suggestedWords: "100-150",
  },
  {
    id: "career-plan",
    title: "CAREER PLAN",
    description: "Your short-term and long-term career plans after completing the course",
    suggestedWords: "200-250",
  },
  {
    id: "return-home",
    title: "INTENT TO RETURN TO HOME COUNTRY AFTER STUDIES",
    description: "Your plans to return to your home country after completing studies",
    suggestedWords: "150-200",
  },
  {
    id: "visa-conditions",
    title: "STUDENT VISA CONDITIONS",
    description: "Any additional information about visa conditions (Optional)",
    suggestedWords: "100-150",
  },
  {
    id: "conclusion",
    title: "CONCLUSION",
    description: "Summarize your motivation and readiness for this opportunity",
    suggestedWords: "100-150",
  },
];

interface SOPSection {
  id: string;
  content: string;
  wordCount: number;
}

export default function SOPHelper() {
  const hydrated = useHydrated();
  const [sections, setSections] = useState<SOPSection[]>(() => {
    if (!hydrated) {
      return SOP_SECTIONS.map((s) => ({ id: s.id, content: "", wordCount: 0 }));
    }
    const saved = loadSections();
    return saved ?? SOP_SECTIONS.map((s) => ({ id: s.id, content: "", wordCount: 0 }));
  });
  const [activeSection, setActiveSection] = useState(0);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem("sop-sections", JSON.stringify(sections));
      setShowSaveMessage(true);
    }, 1500);

    const hideTimer = setTimeout(() => setShowSaveMessage(false), 3000);

    return () => {
      clearTimeout(saveTimer);
      clearTimeout(hideTimer);
    };
  }, [sections]);

  const updateSectionContent = useCallback((content: string) => {
    const words = content.trim().split(/\s+/).filter((w) => w.length > 0);
    setSections((prev) =>
      prev.map((s, i) =>
        i === activeSection
          ? { ...s, content, wordCount: words.length }
          : s
      )
    );
  }, [activeSection]);

  const totalWords = sections.reduce((sum, s) => sum + s.wordCount, 0);
  const currentSection = SOP_SECTIONS[activeSection];
  const currentSectionData = sections[activeSection];

  const isWithinSuggested =
    currentSectionData.wordCount >=
      parseInt(currentSection.suggestedWords.split("-")[0]) &&
    currentSectionData.wordCount <=
      parseInt(currentSection.suggestedWords.split("-")[1]);

  const getWordCounterColor = () => {
    if (isWithinSuggested) return "text-emerald-500";
    return "text-amber-500";
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(20);
    doc.text("Statement of Purpose", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("ausMasters - Australia Student Visa", 105, 28, {
      align: "center",
    });

    let yPosition = 45;

    SOP_SECTIONS.forEach((section, i) => {
      const sectionData = sections[i];
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text(section.title, 20, yPosition);
      yPosition += 8;

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(sectionData.content || "Not written yet", 170);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 6 + 10;
    });

    doc.save("statement-of-purpose.pdf");
  };

  const copyToClipboard = () => {
    const fullSOP = sections
      .map((s, i) => `${SOP_SECTIONS[i].title}\n\n${s.content}`)
      .join("\n\n---\n\n");
    navigator.clipboard.writeText(fullSOP);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                  SOP Helper
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Structure and write your Statement of Purpose
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all card-hover"
              >
                <Copy className="w-4 h-4" />
                Copy All
              </button>
              <button
                onClick={exportToPDF}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ListChecks className="w-4 h-4" />
                  SOP Structure
                </div>
              </div>
              <div className="p-2">
                {SOP_SECTIONS.map((section, i) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(i)}
                    className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-colors mb-1 ${
                      i === activeSection
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{section.title}</span>
                      {sections[i].wordCount > 0 && (
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {sections[i].wordCount} words
                    </p>
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">
                    {totalWords}
                  </p>
                  <p className="text-xs text-gray-500">Total Words</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentSection.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {currentSection.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Suggested: {currentSection.suggestedWords} words
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <Bold className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <Italic className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <Underline className="w-4 h-4 text-gray-600" />
                  </button>
                  <div className="w-px h-5 bg-gray-300" />
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <ListOrdered className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded">
                    <List className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <textarea
                  value={currentSectionData.content}
                  onChange={(e) => updateSectionContent(e.target.value)}
                  placeholder={`Write your ${currentSection.title.toLowerCase()} here...`}
                  rows={12}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm leading-relaxed"
                />

                <div className="flex items-center justify-between mt-3">
                  <div
                    className={`flex items-center gap-2 text-sm ${getWordCounterColor()}`}
                  >
                    {isWithinSuggested ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : null}
                    {currentSectionData.wordCount} words
                  </div>
                  <AnimatePresence>
                    {showSaveMessage && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="inline-flex items-center gap-1 text-emerald-600 text-sm"
                      >
                        <Save className="w-4 h-4" />
                        Saved
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                <button
                  onClick={() =>
                    setActiveSection((prev) => Math.max(0, prev - 1))
                  }
                  disabled={activeSection === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous Section
                </button>
                {activeSection === SOP_SECTIONS.length - 1 && currentSectionData.wordCount > 0 ? (
                  <button
                    onClick={exportToPDF}
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setActiveSection((prev) =>
                        Math.min(SOP_SECTIONS.length - 1, prev + 1)
                      )
                    }
                    disabled={activeSection === SOP_SECTIONS.length - 1}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next Section
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
