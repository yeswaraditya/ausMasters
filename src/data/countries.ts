export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  status: "active" | "coming-soon";
  visaTypes: VisaType[];
  processingTimeRange: { min: number; max: number; unit: string };
  gsQuestions?: string[];
  description: string;
  tuitionRange: string;
  livingCost: string;
  workHours: string;
  postStudyWork: string;
  englishReq: string;
  topUniversities: string;
  strengths: string[];
  challenges: string[];
}

export interface VisaType {
  name: string;
  code: string;
  description: string;
  requirements: string[];
}

export const countries: CountryConfig[] = [
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    status: "active",
    visaTypes: [
      {
        name: "Student Visa (Subclass 500)",
        code: "500",
        description:
          "Study full-time in Australia for up to 5 years depending on course duration",
        requirements: [
          "Confirmation of Enrolment (CoE)",
          "Genuine Student (GS) requirement",
          "English language proficiency",
          "Financial capacity evidence",
          "Overseas Student Health Cover (OSHC)",
        ],
      },
      {
        name: "Temporary Graduate Visa (Subclass 485)",
        code: "485",
        description:
          "Work in Australia for 2-4 years after completing your studies",
        requirements: [
          "Completed eligible qualification",
          "Held Student Visa (Subclass 500)",
          "Meet English language requirements",
          "Adequate health insurance",
        ],
      },
      {
        name: "Student Guardian Visa (Subclass 590)",
        code: "590",
        description:
          "Accompany and care for a student visa holder under 18 or 18+",
        requirements: [
          "Must be parent, guardian, or relative of the student",
          "Financial capacity to support yourself and the student",
          "Adequate health insurance",
        ],
      },
    ],
    processingTimeRange: { min: 2, max: 8, unit: "weeks" },
    gsQuestions: [
      "1. Details of the applicant's current circumstances, including ties to family, community, employment and economic circumstances.",
      "2. Explain why the applicant wishes to study this course in Australia with this particular education provider.",
      "3. Explain how completing the course will benefit the applicant.",
      "4. Give details of any other relevant information the applicant would like to include.",
      "5. Provide a detailed history of the applicant's study record in Australia from the date of first arrival.",
    ],
    description:
      "Australia is a top destination for international students, offering world-class universities, diverse culture, and excellent post-study work opportunities.",
    tuitionRange: "$20,000 - $50,000 AUD/year",
    livingCost: "$2,000 - $3,000 AUD/month",
    workHours: "48 hours/fortnight during study",
    postStudyWork: "2-4 years",
    englishReq: "IELTS 6.0+ / PTE 50+",
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
  // USA and Germany are commented out until country comparison feature is re-enabled
  // { code: "US", name: "United States", flag: "🇺🇸", status: "coming-soon", ... }
  // { code: "DE", name: "Germany", flag: "🇩🇪", status: "coming-soon", ... }
];

export const activeCountries = countries.filter((c) => c.status === "active");

export const comingSoonCountries = countries.filter(
  (c) => c.status === "coming-soon"
);
