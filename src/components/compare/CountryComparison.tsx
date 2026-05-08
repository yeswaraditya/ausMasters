"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  DollarSign,
  Clock,
  Globe,
  Check,
  X,
} from "lucide-react";
import { countries } from "@/data/countries";

const countryData = [
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    status: "active",
    visaType: "Subclass 500",
    processingTime: "2-8 weeks",
    tuitionRange: "$20,000 - $50,000 AUD/year",
    livingCost: "$2,000 - $3,000 AUD/month",
    workHours: "48 hours/fortnight during study",
    postStudyWork: "2-4 years",
    englishReq: "IELTS 6.0+ / PTE 50+",
    gsRequired: true,
    healthInsurance: "OSHC Mandatory",
    dependents: "Allowed",
    prPathway: "Yes - Points-based system",
    topUniversities:
      "Group of Eight (Go8): ANU, Melbourne, Sydney, UNSW, UQ, Monash, UWA, Adelaide",
    strengths: [
      "World-class education",
      "Post-study work rights",
      "Multicultural society",
      "Strong PR pathways",
    ],
    challenges: [
      "High living costs",
      "Strict GS requirements",
      "Competitive admissions",
    ],
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    status: "coming-soon",
    visaType: "F-1",
    processingTime: "3-5 weeks",
    tuitionRange: "$25,000 - $60,000 USD/year",
    livingCost: "$1,500 - $3,500 USD/month",
    workHours: "20 hours/week on-campus",
    postStudyWork: "1-3 years (OPT)",
    englishReq: "IELTS 6.5+ / TOEFL 80+",
    gsRequired: false,
    healthInsurance: "Required by most universities",
    dependents: "F-2 visa for dependents",
    prPathway: "Yes - Employer sponsorship (H1B)",
    topUniversities:
      "Ivy League, MIT, Stanford, UC Berkeley, Caltech, Chicago",
    strengths: [
      "Top-ranked universities",
      "Research opportunities",
      "OPT work program",
      "Diverse programs",
    ],
    challenges: [
      "Very high tuition",
      "Complex visa process",
      "Limited PR pathways",
      "H1B lottery system",
    ],
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    status: "coming-soon",
    visaType: "Student Visa (National)",
    processingTime: "4-12 weeks",
    tuitionRange: "Free (Public) / €20,000/year (Private)",
    livingCost: "€934/month (Blocked Account)",
    workHours: "120 full days/240 half days per year",
    postStudyWork: "18 months job seeker visa",
    englishReq: "IELTS 6.0+ / TestDaF for German programs",
    gsRequired: false,
    healthInsurance: "Public health insurance mandatory",
    dependents: "Allowed with proof of funds",
    prPathway: "Yes - After 2 years of work",
    topUniversities:
      "TU Munich, LMU Munich, Heidelberg, RWTH Aachen, KIT, Humboldt",
    strengths: [
      "Tuition-free education",
      "Strong economy",
      "Easy PR after work",
      "Central EU location",
    ],
    challenges: [
      "Language barrier",
      "Blocked account required",
      "Bureaucratic processes",
      "Limited English programs",
    ],
  },
];

export default function CountryComparison() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    "AU",
    "US",
    "DE",
  ]);

  const filteredData = countryData.filter((c) =>
    selectedCountries.includes(c.code)
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Country Comparison
          </h1>
          <p className="text-gray-600">
            Compare study destinations side by side
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-3 mb-8">
          {countries.map((country) => (
            <button
              key={country.code}
              onClick={() => {
                if (selectedCountries.includes(country.code)) {
                  setSelectedCountries(
                    selectedCountries.filter((c) => c !== country.code)
                  );
                } else {
                  setSelectedCountries([...selectedCountries, country.code]);
                }
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCountries.includes(country.code)
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300"
              }`}
            >
              {country.flag} {country.name}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid divide-x border-b" style={{ gridTemplateColumns: `repeat(${filteredData.length}, 1fr)` }}>
            <div className="p-4 bg-gray-50 font-medium text-gray-700 text-sm">
              Feature
            </div>
            {filteredData.map((country) => (
              <div
                key={country.code}
                className="p-4 text-center bg-gray-50"
              >
                <span className="text-2xl">{country.flag}</span>
                <p className="font-semibold text-gray-900 mt-1">
                  {country.name}
                </p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                    country.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {country.status === "active" ? "Available" : "Coming Soon"}
                </span>
              </div>
            ))}
          </div>

          {[
            {
              label: "Visa Type",
              icon: Globe,
              key: "visaType",
            },
            {
              label: "Processing Time",
              icon: Clock,
              key: "processingTime",
            },
            {
              label: "Tuition Range",
              icon: DollarSign,
              key: "tuitionRange",
            },
            {
              label: "Living Cost",
              icon: DollarSign,
              key: "livingCost",
            },
            {
              label: "Work Hours",
              icon: Clock,
              key: "workHours",
            },
            {
              label: "Post-Study Work",
              icon: GraduationCap,
              key: "postStudyWork",
            },
            {
              label: "English Requirement",
              icon: Globe,
              key: "englishReq",
            },
          ].map((row, i) => {
            const Icon = row.icon;
            return (
              <div
                key={row.key}
                className={`grid divide-x ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                style={{
                  gridTemplateColumns: `repeat(${filteredData.length + 1}, 1fr)`,
                }}
              >
                <div className="p-4 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Icon className="w-4 h-4 text-gray-500" />
                  {row.label}
                </div>
                {filteredData.map((country) => (
                  <div
                    key={country.code}
                    className="p-4 text-sm text-gray-900 text-center"
                  >
                    {country[row.key as keyof typeof country] as string}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {filteredData.map((country) => (
            <motion.div
              key={country.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{country.flag}</span>
                <h3 className="text-lg font-semibold text-gray-900">
                  {country.name}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-emerald-600 mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {country.strengths.map((s) => (
                      <li
                        key={s}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <Check className="w-3 h-3 text-emerald-500 mt-1 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-red-600 mb-2 flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Challenges
                  </h4>
                  <ul className="space-y-1">
                    {country.challenges.map((c) => (
                      <li
                        key={c}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <X className="w-3 h-3 text-red-500 mt-1 flex-shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Top Universities:</span>{" "}
                    {country.topUniversities}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
