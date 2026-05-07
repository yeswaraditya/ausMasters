"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Check,
  AlertCircle,
  Save,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Download,
  Info,
} from "lucide-react";
import type { GSAnswer } from "@/types";
import { countries } from "@/data/countries";
import jsPDF from "jspdf";
import "jspdf-autotable";

const MAX_CHARACTERS = 1000;

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function getQuestions(): string[] {
  const au = countries.find((c) => c.code === "AU");
  return au?.gsQuestions ?? [];
}

function initializeAnswers(questions: string[]): GSAnswer[] {
  return questions.map((q) => ({
    question: q,
    answer: "",
    characterCount: 0,
    maxCharacters: MAX_CHARACTERS,
  }));
}

function loadAnswers(): GSAnswer[] | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("gs-answers");
  if (saved) {
    try {
      return JSON.parse(saved) as GSAnswer[];
    } catch {
      return null;
    }
  }
  return null;
}

export default function GSQuestionnaire() {
  const hydrated = useHydrated();
  const questions = getQuestions();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<GSAnswer[]>(() => {
    if (!hydrated) return initializeAnswers(questions);
    const saved = loadAnswers();
    return saved ?? initializeAnswers(questions);
  });
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const updateAnswer = (value: string) => {
    setAnswers((prev) =>
      prev.map((a, i) =>
        i === currentQuestion
          ? { ...a, answer: value, characterCount: value.length }
          : a
      )
    );
  };

  useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem("gs-answers", JSON.stringify(answers));
      setShowSaveMessage(true);
    }, 1500);

    const hideTimer = setTimeout(() => setShowSaveMessage(false), 3000);

    return () => {
      clearTimeout(saveTimer);
      clearTimeout(hideTimer);
    };
  }, [answers]);

  const getCounterColor = (count: number) => {
    if (count >= MAX_CHARACTERS) return "text-red-500";
    if (count >= 900) return "text-amber-500";
    return "text-emerald-500";
  };

  const getProgressBarColor = (count: number) => {
    if (count >= MAX_CHARACTERS) return "bg-red-500";
    if (count >= 900) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const completedCount = answers.filter(
    (a) => a.characterCount > 0
  ).length;
  const progressPercent = (completedCount / questions.length) * 100;

  const currentAnswer = answers[currentQuestion];

  const handlePrevious = () => {
    setCurrentQuestion((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(20);
    doc.text("Genuine Student Questionnaire", 105, 20, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Australia Student Visa (Subclass 500)", 105, 28, {
      align: "center",
    });

    let yPosition = 45;

    answers.forEach((answer, i) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text(`Q${i + 1}: ${answer.question}`, 20, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(answer.answer || "Not answered", 170);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 5 + 10;
    });

    doc.save("gs-questionnaire.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                  Genuine Student Questionnaire
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Australia Student Visa (Subclass 500)
                </p>
              </div>
            </div>
            <button
              onClick={exportToPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all card-hover"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden card-hover"
        >
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">
                Progress
              </span>
              <span className="text-sm text-gray-500 font-medium">
                {completedCount} / {questions.length} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="p-6 lg:p-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <AnimatePresence>
                {showSaveMessage && (
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="inline-flex items-center gap-1 text-emerald-600 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    Draft saved
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4 leading-relaxed">
                  {currentAnswer?.question}
                </h2>

                {currentQuestion === 4 && (
                  <div className="mb-4 flex items-start gap-2 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-900">
                      <strong>Important:</strong> This question (Question 5) is only asked for a few candidates. 
                      However, it&apos;s best to prepare for it in case you are asked about your 
                      previous study history in Australia.
                    </p>
                  </div>
                )}

                <div className="relative">
                  <textarea
                    value={currentAnswer?.answer ?? ""}
                    onChange={(e) => updateAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    maxLength={MAX_CHARACTERS}
                    rows={6}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm leading-relaxed text-gray-900"
                  />
                  <div
                    className={`absolute bottom-3 right-3 text-xs font-medium ${getCounterColor(currentAnswer?.characterCount ?? 0)}`}
                  >
                    {currentAnswer?.characterCount ?? 0} /{" "}
                    {MAX_CHARACTERS}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <motion.div
                      className={`h-1.5 rounded-full ${getProgressBarColor(currentAnswer?.characterCount ?? 0)}`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentAnswer?.characterCount ?? 0) / MAX_CHARACTERS) * 100}%`,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  {currentAnswer &&
                    currentAnswer.characterCount >= 900 && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {currentAnswer.characterCount >= MAX_CHARACTERS
                          ? "Character limit reached"
                          : "Approaching character limit"}
                      </p>
                    )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="px-6 lg:px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestion(i)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    i === currentQuestion
                      ? "bg-blue-600 text-white"
                      : answers[i]?.characterCount > 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                  }`}
                >
                  {answers[i]?.characterCount > 0 ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 lg:p-8 text-white shadow-xl shadow-blue-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Tips for Success</h3>
              <ul className="space-y-2 text-white/90 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Be specific and honest in your answers
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Connect your course choice to your career goals
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Demonstrate strong ties to your home country
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Each answer has a 1000-character limit
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}