"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Headphones,
  PenTool,
  MessageCircle,
  GraduationCap,
  Shield,
  Heart,
  CheckCircle,
  XCircle,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SectionKey = "listening" | "reading" | "writing" | "speaking";

interface SectionScores {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
}

interface Requirement {
  id: string;
  label: string;
  description: string;
  minSection: number;
  minOverall: number;
  icon: typeof Shield;
}

interface RequirementResult {
  requirement: Requirement;
  sectionsPass: boolean;
  overallPass: boolean;
  fullyMet: boolean;
  failingSections: SectionKey[];
}

// Constants
const BAND_DESCRIPTORS: Record<number, string> = {
  9: "Expert",
  8: "Very Good",
  7: "Good",
  6: "Competent",
  5: "Modest",
  4: "Limited",
  3: "Extremely Limited",
  2: "Intermittent",
  1: "Non-user",
  0: "Did not attempt",
};

const AUSTRALIAN_REQUIREMENTS: Requirement[] = [
  {
    id: "student-visa",
    label: "Student Visa (Subclass 500)",
    description: "5.5+ each section, 6.0 overall",
    minSection: 5.5,
    minOverall: 6.0,
    icon: Shield,
  },
  {
    id: "most-universities",
    label: "Most Universities",
    description: "6.0+ each section, 6.5 overall",
    minSection: 6.0,
    minOverall: 6.5,
    icon: GraduationCap,
  },
  {
    id: "nursing-teaching",
    label: "Nursing / Teaching Courses",
    description: "7.0 each section, 7.0 overall",
    minSection: 7.0,
    minOverall: 7.0,
    icon: Heart,
  },
];

const SECTION_META = [
  {
    key: "listening" as SectionKey,
    label: "Listening",
    icon: Headphones,
    color: "from-blue-500 to-cyan-500",
  },
  {
    key: "reading" as SectionKey,
    label: "Reading",
    icon: BookOpen,
    color: "from-violet-500 to-purple-500",
  },
  {
    key: "writing" as SectionKey,
    label: "Writing",
    icon: PenTool,
    color: "from-amber-500 to-orange-500",
  },
  {
    key: "speaking" as SectionKey,
    label: "Speaking",
    icon: MessageCircle,
    color: "from-emerald-500 to-teal-500",
  },
];

// IELTS Raw Score to Band Conversion Tables
const LISTENING_RAW_TO_BAND: [number, number][] = [
  [39, 9.0],
  [37, 8.5],
  [35, 8.0],
  [33, 7.5],
  [30, 7.0],
  [27, 6.5],
  [23, 6.0],
  [19, 5.5],
  [15, 5.0],
  [11, 4.5],
  [6, 4.0],
  [0, 3.5],
];

const READING_ACADEMIC_RAW_TO_BAND: [number, number][] = [
  [40, 9.0],
  [39, 8.5],
  [37, 8.0],
  [35, 7.5],
  [33, 7.0],
  [30, 6.5],
  [27, 6.0],
  [23, 5.5],
  [19, 5.0],
  [15, 4.5],
  [10, 4.0],
  [6, 3.5],
  [0, 3.0],
];

const READING_GENERAL_RAW_TO_BAND: [number, number][] = [
  [40, 9.0],
  [39, 8.5],
  [37, 8.0],
  [34, 7.5],
  [32, 7.0],
  [30, 6.5],
  [27, 6.0],
  [23, 5.5],
  [19, 5.0],
  [15, 4.5],
  [10, 4.0],
  [6, 3.5],
  [0, 3.0],
];

// Helper Functions
function roundToIELTSBand(raw: number): number {
  const floor = Math.floor(raw);
  const decimal = raw - floor;

  if (decimal < 0.25) return floor;
  if (decimal < 0.75) return floor + 0.5;
  return floor + 1;
}

function getBandDescriptor(band: number): string {
  return BAND_DESCRIPTORS[Math.floor(band)] ?? "Unknown";
}

function getBandColor(
  band: number
): "emerald" | "amber" | "red" {
  if (band >= 7) return "emerald";
  if (band >= 5.5) return "amber";
  return "red";
}

function checkRequirements(
  scores: SectionScores,
  overall: number,
  requirements: Requirement[]
): RequirementResult[] {
  const sectionEntries = Object.entries(scores) as [SectionKey, number][];
  return requirements.map((req) => {
    const failingSections = sectionEntries
      .filter(([, val]) => val < req.minSection)
      .map(([key]) => key);
    const sectionsPass = failingSections.length === 0;
    const overallPass = overall >= req.minOverall;
    return {
      requirement: req,
      sectionsPass,
      overallPass,
      fullyMet: sectionsPass && overallPass,
      failingSections,
    };
  });
}

const scoreToBarWidth = (score: number) => `${(score / 9) * 100}%`;

const sectionLabelMap: Record<SectionKey, string> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

function rawScoreToBand(raw: number, table: [number, number][]): number {
  for (const [minRaw, band] of table) {
    if (raw >= minRaw) return band;
  }
  return 0;
}

export default function IELTSCalculator() {
  const [scores, setScores] = useState<SectionScores>({
    listening: 6.0,
    reading: 6.0,
    writing: 6.0,
    speaking: 6.0,
  });

  const [inputMode, setInputMode] = useState<"band" | "raw">("band");
  const [ieltsType, setIeltsType] = useState<"academic" | "general">("academic");
  const [rawCorrect, setRawCorrect] = useState<{
    listening: number | "";
    reading: number | "";
  }>({ listening: "", reading: "" });

  const overallBand = useMemo(() => {
    const raw =
      (scores.listening +
        scores.reading +
        scores.writing +
        scores.speaking) /
      4;
    return roundToIELTSBand(raw);
  }, [scores]);

  const bandDescriptor = getBandDescriptor(overallBand);
  const bandColor = getBandColor(overallBand);

  const requirementResults = useMemo(
    () => checkRequirements(scores, overallBand, AUSTRALIAN_REQUIREMENTS),
    [scores, overallBand]
  );

  const handleScoreChange = (section: SectionKey, value: number) => {
    setScores((prev) => ({ ...prev, [section]: value }));
  };

  const handleRawCorrectChange = (
    section: "listening" | "reading",
    value: string
  ) => {
    const numValue = value === "" ? "" : Math.min(40, Math.max(0, parseInt(value, 10) || 0));
    setRawCorrect((prev) => ({ ...prev, [section]: numValue }));

    // Convert to band and update score
    if (numValue !== "") {
      const num = numValue as number;
      let band = 0;
      if (section === "listening") {
        band = rawScoreToBand(num, LISTENING_RAW_TO_BAND);
      } else {
        const table = ieltsType === "academic" ? READING_ACADEMIC_RAW_TO_BAND : READING_GENERAL_RAW_TO_BAND;
        band = rawScoreToBand(num, table);
      }
      handleScoreChange(section, band);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                IELTS Score Calculator
              </h1>
              <p className="text-gray-600">
                Check your band score and Australian requirements
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* LEFT: Section Score Sliders or Raw Input */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Section Scores
              </h2>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-5">
              {(["band", "raw"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setInputMode(mode)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    inputMode === mode
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                  )}
                >
                  {mode === "band" ? "Band Score" : "Correct Answers"}
                </button>
              ))}
            </div>

            {/* IELTS Type Selector (raw mode only) */}
            {inputMode === "raw" && (
              <div className="flex gap-2 mb-5">
                {(["academic", "general"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setIeltsType(type)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                      ieltsType === type
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                    )}
                  >
                    {type === "academic" ? "Academic" : "General Training"}
                  </button>
                ))}
              </div>
            )}

            {/* Sections */}
            <div className="space-y-6">
              {SECTION_META.map(({ key, label, icon: Icon, color }) => {
                const isRawSection =
                  inputMode === "raw" &&
                  (key === "listening" || key === "reading");

                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center",
                            color
                          )}
                        >
                          <Icon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {label}
                        </span>
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        {scores[key].toFixed(1)}
                      </span>
                    </div>

                    {isRawSection ? (
                      // Raw Score Input Mode
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={40}
                            value={
                              rawCorrect[key as "listening" | "reading"]
                            }
                            onChange={(e) =>
                              handleRawCorrectChange(
                                key as "listening" | "reading",
                                e.target.value
                              )
                            }
                            className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                          <span className="text-sm text-gray-500">/40</span>
                        </div>
                        <span className="text-sm text-gray-400">→</span>
                        <div className="bg-blue-50 px-2.5 py-1 rounded-lg">
                          <span className="text-sm font-semibold text-blue-700">
                            Band {scores[key].toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      // Slider Mode
                      <>
                        <input
                          type="range"
                          min={0}
                          max={9}
                          step={0.5}
                          value={scores[key]}
                          onChange={(e) =>
                            handleScoreChange(key, parseFloat(e.target.value))
                          }
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>0</span>
                          <span>4.5</span>
                          <span>9</span>
                        </div>
                        {(key === "writing" || key === "speaking") && (
                          <p className="text-xs text-gray-500 mt-2">
                            Examiner scored
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT: Overall Band + Requirements */}
          <div className="space-y-6">
            {/* Overall Band Display */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center"
            >
              <p className="text-sm font-medium text-gray-500 mb-3">
                Overall Band Score
              </p>
              <motion.div
                key={overallBand}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "text-7xl font-black mb-2",
                  bandColor === "emerald" && "text-emerald-600",
                  bandColor === "amber" && "text-amber-600",
                  bandColor === "red" && "text-red-500"
                )}
              >
                {overallBand.toFixed(1)}
              </motion.div>
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold mb-2",
                  bandColor === "emerald" && "bg-emerald-100 text-emerald-700",
                  bandColor === "amber" && "bg-amber-100 text-amber-700",
                  bandColor === "red" && "bg-red-100 text-red-600"
                )}
              >
                {bandDescriptor}
              </div>
              <p className="text-xs text-gray-500">
                Band {overallBand.toFixed(1)} — {bandDescriptor} user
              </p>
            </motion.div>

            {/* Australian Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Australian Requirements
              </h2>
              <div className="space-y-3">
                {requirementResults.map(
                  ({
                    requirement,
                    fullyMet,
                    sectionsPass,
                    overallPass,
                    failingSections,
                  }) => {
                    const ReqIcon = requirement.icon;
                    return (
                      <div
                        key={requirement.id}
                        className={cn(
                          "rounded-xl border p-4 transition-colors",
                          fullyMet
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-red-50 border-red-200"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                              fullyMet ? "bg-emerald-100" : "bg-red-100"
                            )}
                          >
                            <ReqIcon
                              className={cn(
                                "w-4 h-4",
                                fullyMet
                                  ? "text-emerald-600"
                                  : "text-red-500"
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-gray-900">
                                {requirement.label}
                              </p>
                              {fullyMet ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {requirement.description}
                            </p>
                            {!fullyMet && (
                              <div className="flex gap-3 mt-2 text-xs flex-wrap">
                                <span
                                  className={
                                    overallPass
                                      ? "text-emerald-600"
                                      : "text-red-500"
                                  }
                                >
                                  {overallPass ? "✓" : "✗"} Overall{" "}
                                  {overallPass ? "met" : "not met"}
                                </span>
                                <span
                                  className={
                                    sectionsPass
                                      ? "text-emerald-600"
                                      : "text-red-500"
                                  }
                                >
                                  {sectionsPass
                                    ? "✓"
                                    : "✗"}{" "}
                                  Sections{" "}
                                  {sectionsPass
                                    ? "met"
                                    : `(${failingSections
                                        .map(
                                          (s) => sectionLabelMap[s]
                                        )
                                        .join(", ")})`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom: Section Breakdown Bars */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            Section Breakdown
          </h2>
          <div className="space-y-4">
            {SECTION_META.map(({ key, label }) => {
              const score = scores[key];
              const sectionBandColor = getBandColor(score);
              return (
                <div key={key} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-20 flex-shrink-0">
                    {label}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className={cn(
                        "h-3 rounded-full",
                        sectionBandColor === "emerald" &&
                          "bg-gradient-to-r from-emerald-400 to-emerald-600",
                        sectionBandColor === "amber" &&
                          "bg-gradient-to-r from-amber-400 to-amber-500",
                        sectionBandColor === "red" &&
                          "bg-gradient-to-r from-red-400 to-red-500"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: scoreToBarWidth(score) }}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8 text-right">
                    {score.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
