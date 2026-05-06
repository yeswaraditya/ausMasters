import mongoose from "mongoose";
import type { ChatSession as ChatSessionType } from "@/types";

const chatSessionSchema = new mongoose.Schema<ChatSessionType>(
  {
    messages: [
      {
        id: { type: String, required: true },
        role: {
          type: String,
          enum: ["user", "assistant", "system"],
          required: true,
        },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        stage: { type: String },
      },
    ],
    userProfile: {
      studentLevel: String,
      course: String,
      university: String,
      englishScore: {
        type: { type: String, enum: ["IELTS", "PTE", "TOEFL"] },
        overall: Number,
        breakdown: mongoose.Schema.Types.Mixed,
      },
      financialCapacity: Number,
      studyGap: {
        hasGap: Boolean,
        years: Number,
        reason: String,
      },
      visaRefusal: {
        hasRefusal: Boolean,
        country: String,
        reason: String,
      },
      additionalQueries: String,
    },
    currentStage: { type: String, default: "greeting" },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
    country: { type: String, required: true, default: "AU" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ChatSession =
  mongoose.models.ChatSession ||
  mongoose.model<ChatSessionType>("ChatSession", chatSessionSchema);
