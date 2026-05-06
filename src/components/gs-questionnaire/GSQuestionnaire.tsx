"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Check,
  AlertCircle,
  Save,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Upload,
  X,
  Download,
  Paperclip,
} from "lucide-react";
import type { GSAnswer } from "@/types";
import { countries } from "@/data/countries";
import jsPDF from "jspdf";
import "jspdf-autotable";

const MAX_CHARACTERS = 1000;

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

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  data: string;
}

export default function GSQuestionnaire() {
  const questions = getQuestions();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<GSAnswer[]>(() => {
    const saved = loadAnswers();
    return saved ?? initializeAnswers(questions);
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [email, setEmail] = useState("");

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
    if (answers.length > 0) {
      const timer = setTimeout(() => {
        localStorage.setItem("gs-answers", JSON.stringify(answers));
        setShowSaveMessage(true);
        setTimeout(() => setShowSaveMessage(false), 2000);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [answers]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFiles((prev) => [
            ...prev,
            {
              name: file.name,
              size: file.size,
              type: file.type,
              data: event.target?.result as string,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

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

  const handlePrevious = useCallback(() => {
    setCurrentQuestion((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1));
  }, [questions.length]);

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

    if (files.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text("Uploaded Documents", 20, 20);
      yPosition = 30;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      files.forEach((file) => {
        doc.text(`- ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 20, yPosition);
        yPosition += 6;
      });
    }

    doc.save("gs-questionnaire.pdf");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/gs-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: answers.map((a) => ({
            question: a.question,
            answer: a.answer,
            characterCount: a.characterCount,
          })),
          email,
          status: "submitted",
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        localStorage.removeItem("gs-answers");
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  Genuine Student Questionnaire
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Australia Student Visa (Subclass 500)
                </p>
              </div>
            </div>
            <button
              onClick={exportToPDF}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {completedCount} / {questions.length} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="p-6 lg:p-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
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
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 leading-relaxed">
                  {currentAnswer?.question}
                </h2>

                <div className="relative">
                  <textarea
                    value={currentAnswer?.answer ?? ""}
                    onChange={(e) => updateAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    maxLength={MAX_CHARACTERS}
                    rows={6}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm leading-relaxed text-gray-900 dark:text-white"
                  />
                  <div
                    className={`absolute bottom-3 right-3 text-xs font-medium ${getCounterColor(currentAnswer?.characterCount ?? 0)}`}
                  >
                    {currentAnswer?.characterCount ?? 0} /{" "}
                    {MAX_CHARACTERS}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
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

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Supporting Documents (Optional)
              </h3>
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Upload files (max 5MB each)
                </span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(i)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="px-6 lg:px-8 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
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

        <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Submit Your Questionnaire
          </h3>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
            />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !email}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
          {submitStatus === "success" && (
            <p className="mt-2 text-sm text-emerald-600">
              Successfully submitted!
            </p>
          )}
          {submitStatus === "error" && (
            <p className="mt-2 text-sm text-red-600">
              Submission failed. Please try again.
            </p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 lg:p-8 text-white"
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
