import mongoose from "mongoose";
import type { VisaProfile as VisaProfileType } from "@/types";

const visaProfileSchema = new mongoose.Schema<VisaProfileType>(
  {
    studentLevel: { type: String, required: true },
    course: { type: String, required: true },
    englishScore: { type: Number, required: true },
    financialCapacity: { type: Number, required: true },
    studyGapYears: { type: Number, default: 0 },
    visaRefusal: { type: Boolean, default: false },
    processingTimeWeeks: { type: Number, required: true },
    outcome: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      required: true,
    },
    riskFactors: [{ type: String }],
    country: { type: String, required: true, default: "AU" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const VisaProfile =
  mongoose.models.VisaProfile ||
  mongoose.model<VisaProfileType>("VisaProfile", visaProfileSchema);
