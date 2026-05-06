export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  stage?: ChatStage;
}

export type ChatStage =
  | "greeting"
  | "student-level"
  | "course-selection"
  | "english-score"
  | "financial-capacity"
  | "study-gap"
  | "visa-refusal"
  | "additional-queries"
  | "analyzing"
  | "complete";

export interface UserProfile {
  studentLevel?: string;
  course?: string;
  university?: string;
  englishScore?: {
    type: "IELTS" | "PTE" | "TOEFL";
    overall: number;
    breakdown?: Record<string, number>;
  };
  financialCapacity?: number;
  studyGap?: {
    hasGap: boolean;
    years?: number;
    reason?: string;
  };
  visaRefusal?: {
    hasRefusal: boolean;
    country?: string;
    reason?: string;
  };
  additionalQueries?: string;
}

export interface VisaProfile {
  id: string;
  studentLevel: string;
  course: string;
  englishScore: number;
  financialCapacity: number;
  studyGapYears: number;
  visaRefusal: boolean;
  processingTimeWeeks: number;
  outcome: "approved" | "rejected" | "pending";
  riskFactors: string[];
  country: string;
  createdAt: Date;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  userProfile: UserProfile;
  currentStage: ChatStage;
  status: "in-progress" | "completed";
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GSAnswer {
  question: string;
  answer: string;
  characterCount: number;
  maxCharacters: number;
}

export interface GSSubmission {
  id: string;
  country: string;
  answers: GSAnswer[];
  submittedAt: Date;
  status: "draft" | "submitted";
}
