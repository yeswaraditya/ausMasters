"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Circle,
  FileText,
  DollarSign,
  GraduationCap,
  Shield,
  Globe,
  Clock,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CHECKLIST_CATEGORIES = [
  {
    id: "academic",
    title: "Academic Documents",
    icon: GraduationCap,
    color: "text-blue-500",
    items: [
      { id: "coe", label: "Confirmation of Enrolment (CoE)", required: true },
      {
        id: "transcripts",
        label: "Academic transcripts and certificates",
        required: true,
      },
      {
        id: "degree-cert",
        label: "Degree completion certificates",
        required: true,
      },
      {
        id: "course-details",
        label: "Course description and syllabus",
        required: false,
      },
      {
        id: "gap-explanation",
        label: "Study gap explanation letter",
        required: false,
      },
    ],
  },
  {
    id: "financial",
    title: "Financial Evidence",
    icon: DollarSign,
    color: "text-emerald-500",
    items: [
      {
        id: "bank-statements",
        label: "Bank statements (last 3-6 months)",
        required: true,
      },
      {
        id: "scholarship",
        label: "Scholarship/sponsorship letters",
        required: false,
      },
      {
        id: "income-proof",
        label: "Income proof of sponsor/parents",
        required: true,
      },
      {
        id: "education-loan",
        label: "Education loan sanction letter",
        required: false,
      },
{
    id: "financial-affidavit",
    label: "Financial affidavit/support letter",
    required: true,
  },
  {
    id: "itr-returns",
    label: "Previous 3 years ITRs (Income Tax Returns)",
    required: true,
  },
  {
    id: "itr-sources",
    label: "Proof of sources of money (as per latest ITR activities)",
    required: true,
  },
  {
    id: "parent-pay-slips",
    label: "Parent's pay slips (if employed)",
    required: false,
  },
  {
    id: "sponsor-affidavit",
    label: "Sponsor affidavit",
    required: true,
  },
  {
    id: "self-affidavit",
    label: "Self affidavit",
    required: true,
  },
  {
    id: "ca-report",
    label: "CA report/financial certificate",
    required: false,
  },
  {
    id: "loan-statement",
    label: "Loan account statement (verified & attested by bank)",
    required: false,
  },
  {
    id: "loan-sanction",
    label: "Loan sanction letter",
    required: false,
  },
  {
    id: "loan-disbursement",
    label: "Loan disbursement letter",
    required: false,
  },
  {
    id: "loan-verification",
    label: "Loan verification document (by consultancy)",
    required: false,
  },
    ],
  },
  {
    id: "english",
    title: "English Proficiency",
    icon: Globe,
    color: "text-purple-500",
    items: [
{
    id: "ielts-score",
    label: "IELTS/PTE/TOEFL scorecard",
    required: true,
  },
  {
    id: "english-verification",
    label: "English score verification/credential report",
    required: true,
  },
      {
        id: "english-waiver",
        label: "English waiver letter (if applicable)",
        required: false,
      },
    ],
  },
  {
    id: "personal",
    title: "Personal Documents",
    icon: FileText,
    color: "text-amber-500",
    items: [
      {
    id: "passport",
    label: "Valid passport (all pages)",
    required: true,
  },
  {
    id: "aadhar-card",
    label: "Aadhaar card",
    required: true,
  },
  {
    id: "pan-card",
    label: "PAN card",
    required: true,
  },
  {
    id: "eaadhaar",
    label: "E-Aadhaar (digital copy)",
    required: false,
  },
      {
        id: "passport-photo",
        label: "Passport-size photographs",
        required: true,
      },
      {
        id: "birth-cert",
        label: "Birth certificate",
        required: false,
      },
      {
        id: "gs-questionnaire",
        label: "Genuine Student (GS) Q&A",
        required: true,
      },
      { id: "sop", label: "Statement of Purpose (SOP)", required: true },
      {
        id: "cv-resume",
        label: "CV/Resume",
        required: false,
      },
    ],
  },
  {
    id: "insurance",
    title: "Insurance & Health",
    icon: Shield,
    color: "text-red-500",
    items: [
      {
        id: "oshc",
        label: "OSHC statement and policy details",
        required: true,
      },
      {
        id: "health-checkup",
        label: "Medical examination results",
        required: true,
      },
      {
        id: "police-clearance",
        label: "Police clearance certificate",
        required: true,
      },
      { id: "vaccination", label: "Vaccination records", required: false },
    ],
  },
  {
    id: "visa",
    title: "Visa Application",
    icon: Clock,
    color: "text-cyan-500",
    items: [
      {
        id: "visa-form",
        label: "Completed visa application form",
        required: true,
      },
      {
        id: "visa-fee",
        label: "Visa application fee payment",
        required: true,
      },
      {
        id: "biometrics",
        label: "Biometrics appointment",
        required: true,
      },
      {
        id: "immi-account",
        label: "ImmiAccount registration",
        required: true,
      },
    ],
  },
];

interface ChecklistItem {
  id: string;
  checked: boolean;
}

export default function VisaChecklist() {
  const [checklist, setChecklist] = useState<Record<string, ChecklistItem>>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("visa-checklist") : null;
    const initial: Record<string, ChecklistItem> = {};
    CHECKLIST_CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        initial[item.id] = {
          id: item.id,
          checked: saved ? JSON.parse(saved)[item.id]?.checked || false : false,
        };
      });
    });
    return initial;
  });

  useEffect(() => {
    if (Object.keys(checklist).length > 0) {
      localStorage.setItem("visa-checklist", JSON.stringify(checklist));
    }
  }, [checklist]);

  const toggleItem = (id: string) => {
    setChecklist((prev) => ({
      ...prev,
      [id]: { ...prev[id], checked: !prev[id]?.checked },
    }));
  };

  const completedCount = Object.values(checklist).filter(
    (i) => i.checked
  ).length;
  const totalCount = Object.keys(checklist).length;
  const progressPercent =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(18);
    doc.text("Visa Application Checklist", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Australia Student Visa (Subclass 500)", 105, 28, {
      align: "center",
    });

    let yPosition = 45;

    CHECKLIST_CATEGORIES.forEach((cat) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setTextColor(37, 99, 235);
      doc.text(cat.title, 20, yPosition);
      yPosition += 8;

      const rows = cat.items.map((item) => {
        const checked = checklist[item.id]?.checked || false;
        return [
          checked ? "[X]" : "[ ]",
          item.label,
          item.required ? "Required" : "Optional",
        ];
      });

      autoTable(doc, {
        startY: yPosition,
        head: [["Status", "Document", "Type"]],
        body: rows,
        theme: "striped",
        margin: { left: 20, right: 20 },
        styles: { fontSize: 9 },
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: 255,
        },
      });

      yPosition = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY + 12 || yPosition + 12;
    });

    doc.save("visa-checklist.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
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
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Visa Application Checklist
                </h1>
                <p className="text-gray-600">
                  Australia Student Visa (Subclass 500)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                Customized for your profile
              </span>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl"
        >
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> The visa application checklist is unique for every student profile. Below is a general checklist that majorly serves your purpose. Additional documents may be required based on your specific circumstances.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              Overall Progress
            </span>
            <span className="text-sm text-gray-500">
              {completedCount} / {totalCount} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {progressPercent === 100
              ? "All items completed! You're ready to apply."
              : `${Math.round(progressPercent)}% complete`}
          </p>
        </motion.div>

        <div className="space-y-6">
          {CHECKLIST_CATEGORIES.map((category, catIndex) => {
            const Icon = category.icon;
            const categoryChecked = category.items.filter(
              (item) => checklist[item.id]?.checked
            ).length;
            const categoryTotal = category.items.length;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${category.color}`} />
                      <h3 className="font-semibold text-gray-900">
                        {category.title}
                      </h3>
                    </div>
                    <span className="text-sm text-gray-500">
                      {categoryChecked}/{categoryTotal}
                    </span>
                  </div>
                </div>
                <div className="divide-y">
                  {category.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <AnimatePresence mode="wait">
                        {checklist[item.id]?.checked ? (
                          <motion.div
                            key="checked"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="unchecked"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Circle className="w-5 h-5 text-gray-300" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <span
                        className={`flex-1 text-sm ${checklist[item.id]?.checked ? "text-gray-400 line-through" : "text-gray-700"}`}
                      >
                        {item.label}
                      </span>
                      {item.required && (
                        <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded-full">
                          Required
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
