"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Circle,
  Plane,
  Home,
  CreditCard,
  Heart,
  BookOpen,
  FileCheck,
  Luggage,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CHECKLIST_CATEGORIES = [
  {
    id: "travel",
    title: "Travel Arrangements",
    icon: Plane,
    color: "text-blue-500",
    items: [
      { id: "flight-booked", label: "Book flights to Australia", required: true },
      { id: "travel-insurance", label: "Purchase travel insurance", required: true },
      { id: "visa-grant", label: "Receive visa grant notification", required: true },
      { id: "iata-form", label: "Complete IATA travel form", required: false },
      { id: "covid-check", label: "Check COVID-19 travel requirements", required: false },
    ],
  },
  {
    id: "accommodation",
    title: "Accommodation",
    icon: Home,
    color: "text-emerald-500",
    items: [
      { id: "accom-booked", label: "Confirm accommodation booking", required: true },
      { id: "accom-address", label: "Collect accommodation address", required: true },
      { id: "arrival-plan", label: "Plan arrival and check-in details", required: true },
      { id: "transport-airport", label: "Arrange airport to accommodation transport", required: false },
      { id: "utility-setup", label: "Arrange utilities (electricity, internet)", required: false },
      { id: "roommate-contact", label: "Contact roommate/housemates (if applicable)", required: false },
    ],
  },
  {
    id: "banking",
    title: "Banking & Finance",
    icon: CreditCard,
    color: "text-amber-500",
    items: [
      { id: "forex-card", label: "Apply for forex card/international debit card", required: true },
      { id: "bank-notify", label: "Inform bank about travel dates", required: true },
      { id: "currency-exchange", label: "Exchange initial AUD currency", required: true },
      { id: "tuition-payment", label: "Confirm tuition fee payment method", required: true },
      { id: "emergency-fund", label: "Set up emergency fund (AUD account)", required: false },
      { id: "intl-transfer", label: "Set up international money transfer account", required: false },
    ],
  },
  {
    id: "health",
    title: "Health & Wellness",
    icon: Heart,
    color: "text-red-500",
    items: [
      { id: "medical-checkup", label: "Complete pre-departure medical checkup", required: true },
      { id: "medications", label: "Procure required medications (3-6 month supply)", required: true },
      { id: "health-insurance", label: "Confirm OSHC/health insurance activation date", required: true },
      { id: "vaccination-records", label: "Carry vaccination certificate copies", required: true },
      { id: "prescriptions", label: "Get copies of prescriptions for medications", required: false },
      { id: "doctor-reference", label: "Get contact of healthcare provider in Australia", required: false },
    ],
  },
  {
    id: "university",
    title: "University Matters",
    icon: BookOpen,
    color: "text-purple-500",
    items: [
      { id: "course-reg", label: "Complete course registration/enrolment", required: true },
      { id: "orientation", label: "Register for orientation/welcome programs", required: true },
      { id: "student-id", label: "Receive student ID details", required: false },
      { id: "learning-platform", label: "Familiarize with learning platform (Canvas/Blackboard)", required: false },
      { id: "timetable", label: "Download course timetable and syllabus", required: false },
      { id: "campus-tour", label: "Attend virtual/physical campus tour", required: false },
      { id: "contact-info", label: "Save university emergency contacts", required: true },
    ],
  },
  {
    id: "administrative",
    title: "Administrative",
    icon: FileCheck,
    color: "text-cyan-500",
    items: [
      { id: "student-visa-register", label: "Register on DHA Visa Entitlement Verification Online (VEVO)", required: true },
      { id: "tax-file", label: "Apply for Tax File Number (TFN)", required: true },
      { id: "intl-student-register", label: "Register as international student on university portal", required: true },
      { id: "immi-account-update", label: "Update ImmiAccount with final accommodation address", required: true },
      { id: "emergency-contact", label: "Register emergency contacts with university", required: false },
      { id: "departure-card", label: "Arrange departure mobility card (if needed)", required: false },
    ],
  },
  {
    id: "logistics",
    title: "Packing & Logistics",
    icon: Luggage,
    color: "text-indigo-500",
    items: [
      { id: "luggage-plan", label: "Plan luggage and baggage allowance", required: true },
      { id: "essential-items", label: "Pack essential documents and valuables", required: true },
      { id: "clothing", label: "Pack appropriate clothing for Australian weather", required: true },
      { id: "electronics", label: "Pack electronics and check power adapters", required: true },
      { id: "shipping", label: "Arrange shipping for oversized luggage (if needed)", required: false },
      { id: "storage", label: "Arrange home country storage (if needed)", required: false },
      { id: "farewell", label: "Schedule farewell with family and friends", required: false },
    ],
  },
];

interface ChecklistItem {
  id: string;
  checked: boolean;
}

export default function PreDepartureChecklist() {
  const [checklist, setChecklist] = useState<Record<string, ChecklistItem>>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("pre-departure-checklist") : null;
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
      localStorage.setItem("pre-departure-checklist", JSON.stringify(checklist));
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
    doc.text("Pre-Departure Checklist", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Your Australian Masters Journey Begins", 105, 28, {
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
        head: [["Status", "Task", "Type"]],
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

    doc.save("pre-departure-checklist.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Pre-Departure Checklist
                </h1>
                <p className="text-gray-600">
                  Your Australian Masters Journey Begins
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                Getting Ready
              </span>
              <button
                onClick={exportToPDF}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
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
          className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl"
        >
          <p className="text-sm text-indigo-800">
            <strong>Tip:</strong> Complete this checklist before your departure date. Some tasks may take time, so start early. Customize based on your specific circumstances.
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
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {progressPercent === 100
              ? "All set! You're ready to depart."
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
