import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const connectToDatabase = (await import("@/lib/mongodb")).default;
    const mongoose = await import("mongoose");

    const GSSubmissionSchema = new mongoose.default.Schema({
      country: { type: String, required: true, default: "AU" },
      answers: [
        {
          question: { type: String, required: true },
          answer: { type: String, required: true },
          characterCount: { type: Number, required: true },
        },
      ],
      userId: { type: String },
      email: { type: String },
      submittedAt: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ["draft", "submitted"],
        default: "draft",
      },
    });

    const GSSubmission =
      mongoose.default.models.GSSubmission ||
      mongoose.default.model("GSSubmission", GSSubmissionSchema);

    await connectToDatabase();
    const body = await request.json();

    const { answers, email, status = "draft" } = body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Answers are required" },
        { status: 400 }
      );
    }

    const submission = await GSSubmission.create({
      answers,
      email,
      status,
      country: "AU",
    });

    return NextResponse.json(
      {
        message: "GS submission saved successfully",
        id: submission._id,
        status: submission.status,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("GS submission error:", error);
    return NextResponse.json(
      { error: "Failed to save GS submission" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const connectToDatabase = (await import("@/lib/mongodb")).default;
    const mongoose = await import("mongoose");

    const GSSubmissionSchema = new mongoose.default.Schema({
      country: String,
      answers: Array,
      email: String,
      submittedAt: Date,
      status: String,
    });

    const GSSubmission =
      mongoose.default.models.GSSubmission ||
      mongoose.default.model("GSSubmission", GSSubmissionSchema);

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const submissions = await GSSubmission.find({ email }).sort({
      submittedAt: -1,
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("GS fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GS submissions" },
      { status: 500 }
    );
  }
}
