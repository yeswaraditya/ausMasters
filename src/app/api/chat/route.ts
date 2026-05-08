import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are ausMasters AI visa assistant specializing in Australian student visas (Subclass 500). Your role is to:

1. Guide students through a structured questionnaire to collect their profile information
2. Analyze their profile against historical visa data
3. Provide honest, accurate feedback about processing times, risk factors, and recommendations

Follow this question flow strictly:
- Stage 1: Ask about student level (Undergraduate, Masters, PhD, Diploma)
- Stage 2: Ask about intended course and university
- Stage 3: Ask about English proficiency (IELTS/PTE/TOEFL scores)
- Stage 4: Ask about financial capacity (annual budget in AUD)
- Stage 5: Ask about study gaps (years and reasons)
- Stage 6: Ask about prior visa refusals from any country
- Stage 7: Ask for additional queries or information

After collecting all information, provide a comprehensive analysis including:
- Estimated processing time based on profile complexity
- Risk assessment (Low/Medium/High) with reasoning
- Specific recommendations to strengthen the application
- Potential drawbacks or red flags
- Suggested next steps

Be professional, encouraging, but honest about risks. Never guarantee visa approval.

Current stages to track: greeting -> student-level -> course-selection -> english-score -> financial-capacity -> study-gap -> visa-refusal -> additional-queries -> analysis -> complete`;

export async function POST(request: NextRequest) {
  try {
    const { messages, stage } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenAI API key not configured",
          fallback: true,
          response: getFallbackResponse(stage),
        },
        { status: 200 }
      );
    }

    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0]?.message?.content || "";

    return NextResponse.json({
      response: aiResponse,
      nextStage: determineNextStage(stage),
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}

function getFallbackResponse(stage: string): string {
  const responses: Record<string, string> = {
    greeting:
      "Hi! I'm your ausMasters visa assistant. What level of study are you planning?",
    "student-level":
      "Great! What course and university are you interested in?",
    "course-selection":
      "What's your English test score? (IELTS/PTE/TOEFL)",
    "english-score":
      "What's your estimated annual budget for studying in Australia (in AUD)?",
    "financial-capacity":
      "Do you have any gaps in your study history?",
    "study-gap":
      "Have you ever had a visa refusal from any country?",
    "visa-refusal":
      "Any additional queries or information to share?",
    analysis:
      "Based on your profile:\n\n- Processing Time: 4-6 weeks\n- Risk Level: Low-Medium\n- Recommendations: Ensure all documents are ready, prepare strong financial evidence\n\nComplete the GS Questionnaire next for your application.",
  };

  return (
    responses[stage] ||
    "Thank you for that information. Let me continue with the next question."
  );
}

function determineNextStage(currentStage: string): string {
  const stages = [
    "greeting",
    "student-level",
    "course-selection",
    "english-score",
    "financial-capacity",
    "study-gap",
    "visa-refusal",
    "additional-queries",
    "analysis",
    "complete",
  ];

  const currentIndex = stages.indexOf(currentStage);
  return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : "complete";
}
