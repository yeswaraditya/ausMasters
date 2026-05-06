import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const connectToDatabase = (await import("@/lib/mongodb")).default;
    const mongoose = await import("mongoose");

    const ChatSessionSchema = new mongoose.default.Schema({
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
        },
      ],
      userProfile: {
        studentLevel: String,
        course: String,
        englishScore: Number,
        financialCapacity: Number,
        studyGap: String,
        visaRefusal: String,
        additionalQueries: String,
      },
      analysis: {
        processingTime: String,
        riskLevel: String,
        recommendations: [String],
        drawbacks: [String],
      },
      userId: { type: String },
      country: { type: String, default: "AU" },
      status: {
        type: String,
        enum: ["in-progress", "completed"],
        default: "in-progress",
      },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    });

    const ChatSession =
      mongoose.default.models.ChatSession ||
      mongoose.default.model("ChatSession", ChatSessionSchema);

    await connectToDatabase();
    const body = await request.json();

    const { userId, messages, userProfile, analysis, status } = body;

    const session = await ChatSession.create({
      userId,
      messages,
      userProfile,
      analysis,
      status: status || "in-progress",
    });

    return NextResponse.json(
      {
        message: "Chat session saved",
        sessionId: session._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Chat session save error:", error);
    return NextResponse.json(
      { error: "Failed to save chat session" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const connectToDatabase = (await import("@/lib/mongodb")).default;
    const mongoose = await import("mongoose");

    const ChatSessionSchema = new mongoose.default.Schema({
      messages: Array,
      userId: String,
      status: String,
      createdAt: Date,
    });

    const ChatSession =
      mongoose.default.models.ChatSession ||
      mongoose.default.model("ChatSession", ChatSessionSchema);

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ sessions: [] }, { status: 200 });
    }

    const sessions = await ChatSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Chat session fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat sessions" },
      { status: 500 }
    );
  }
}
