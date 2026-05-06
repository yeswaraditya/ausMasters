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
      "Why do you want to study in Australia specifically?",
      "What course have you chosen and why?",
      "How does this course relate to your current or future career?",
      "What do you know about the education provider you chose?",
      "What are your plans after completing your studies?",
      "How will you support yourself financially during your stay?",
      "What ties do you have to your home country?",
      "Have you researched similar courses in your home country?",
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
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    status: "coming-soon",
    visaTypes: [
      {
        name: "F-1 Student Visa",
        code: "F-1",
        description:
          "Academic study at accredited US institutions",
        requirements: [
          "Acceptance at SEVP-certified school",
          "Form I-20 from school",
          "Proof of financial support",
          "SEVIS fee payment",
          "Visa interview",
        ],
      },
      {
        name: "M-1 Student Visa",
        code: "M-1",
        description:
          "Vocational or non-academic study",
        requirements: [
          "Acceptance at SEVP-certified vocational school",
          "Form I-20",
          "Proof of funds",
          "Ties to home country",
        ],
      },
    ],
    processingTimeRange: { min: 3, max: 5, unit: "weeks" },
    gsQuestions: [
      "Why have you chosen this specific university?",
      "How will you fund your education in the US?",
      "What are your career plans after graduation?",
      "Why not study in your home country?",
      "What research opportunities interest you?",
    ],
    description:
      "The US hosts some of the world's top universities with diverse programs and research opportunities.",
    tuitionRange: "$25,000 - $60,000 USD/year",
    livingCost: "$1,500 - $3,500 USD/month",
    workHours: "20 hours/week on-campus",
    postStudyWork: "1-3 years (OPT)",
    englishReq: "IELTS 6.5+ / TOEFL 80+",
    topUniversities:
      "Ivy League, MIT, Stanford, UC Berkeley, Caltech, University of Chicago",
    strengths: [
      "Top-ranked universities globally",
      "Extensive research opportunities",
      "OPT work program",
      "Diverse program options",
    ],
    challenges: [
      "Very high tuition fees",
      "Complex visa application process",
      "Limited PR pathways",
      "H1B lottery system for work visa",
    ],
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    status: "coming-soon",
    visaTypes: [
      {
        name: "Student Visa (National Visa)",
        code: "D",
        description:
          "Study at German universities for programs longer than 90 days",
        requirements: [
          "University admission letter",
          "Blocked account (Sperrkonto) with €11,208",
          "Health insurance",
          "Academic qualifications",
          "Language proficiency (German or English)",
        ],
      },
      {
        name: "Student Applicant Visa",
        code: "D",
        description:
          "Enter Germany to finalize university admission",
        requirements: [
          "Proof of application to German universities",
          "Blocked account",
          "Health insurance",
          "Qualifications",
        ],
      },
    ],
    processingTimeRange: { min: 4, max: 12, unit: "weeks" },
    gsQuestions: [
      "Why have you chosen Germany for your studies?",
      "What is your German language proficiency level?",
      "How will you finance your studies?",
      "What are your plans after graduation?",
      "Why not study in your home country or another EU country?",
    ],
    description:
      "Germany offers tuition-free education at public universities with a strong economy and easy PR pathways.",
    tuitionRange: "Free (Public) / €20,000/year (Private)",
    livingCost: "€934/month (Blocked Account requirement)",
    workHours: "120 full days/240 half days per year",
    postStudyWork: "18 months job seeker visa",
    englishReq: "IELTS 6.0+ / TestDaF for German programs",
    topUniversities:
      "TU Munich, LMU Munich, Heidelberg, RWTH Aachen, KIT, Humboldt University",
    strengths: [
      "Tuition-free education at public universities",
      "Strong economy and job market",
      "Easy PR after 2 years of work",
      "Central location in Europe",
    ],
    challenges: [
      "Language barrier for daily life",
      "Blocked account requirement (€11,208)",
      "Bureaucratic processes",
      "Limited English-taught programs",
    ],
  },
];

export const activeCountries = countries.filter((c) => c.status === "active");

export const comingSoonCountries = countries.filter(
  (c) => c.status === "coming-soon"
);
