"use client";

import { motion } from "framer-motion";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  FileText,
  Download,
  Shield,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface AnalysisResult {
  processingTime: string;
  riskLevel: "low" | "medium" | "high";
  recommendations: string[];
  drawbacks: string[];
  profileStrength: number;
}

interface ResultsDashboardProps {
  result: AnalysisResult;
  onNewChat?: () => void;
}

export default function ResultsDashboard({
  result,
  onNewChat,
}: ResultsDashboardProps) {
  const riskColors = {
    low: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      icon: "text-emerald-500",
      badge: "bg-emerald-100 text-emerald-800",
    },
    medium: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-800",
    },
    high: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: "text-red-500",
      badge: "bg-red-100 text-red-800",
    },
  };

  const colors = riskColors[result.riskLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className={`p-6 rounded-2xl border ${colors.bg} ${colors.border}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${colors.text}`}>
            Risk Assessment
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}
          >
            {result.riskLevel.toUpperCase()} RISK
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${result.profileStrength * 2.51} 251`}
                className={colors.icon}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-bold ${colors.text}`}>
                {result.profileStrength}%
              </span>
            </div>
          </div>
          <div>
            <p className={`text-sm ${colors.text}`}>
              Your profile strength is{" "}
              {result.riskLevel === "low"
                ? "strong"
                : result.riskLevel === "medium"
                  ? "moderate"
                  : "needs improvement"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Based on historical visa approval data
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Processing Time
          </h3>
        </div>
        <p className="text-3xl font-bold gradient-text">
          {result.processingTime}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Estimated based on current processing trends
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Recommendations
            </h3>
          </div>
          <ul className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <ArrowRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Potential Drawbacks
            </h3>
          </div>
          {result.drawbacks.length > 0 ? (
            <ul className="space-y-3">
              {result.drawbacks.map((drawback, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <Shield className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  {drawback}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-emerald-600">
              No significant drawbacks identified in your profile.
            </p>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <TrendingUp className="w-8 h-8 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
            <p className="text-white/90 text-sm mb-4">
              Complete your Genuine Student questionnaire to strengthen your
              application.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/gs-questionnaire"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
              >
                <FileText className="w-4 h-4" />
                GS Questionnaire
              </Link>
              {onNewChat && (
                <button
                  onClick={onNewChat}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  New Assessment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
