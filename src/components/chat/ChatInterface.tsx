"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import type { ChatMessage, ChatStage } from "@/types";

const STAGES: ChatStage[] = [
  "greeting",
  "student-level",
  "course-selection",
  "english-score",
  "financial-capacity",
  "study-gap",
  "visa-refusal",
  "additional-queries",
  "analyzing",
  "complete",
];

const STAGE_PROMPTS: Record<ChatStage, string> = {
  greeting:
    "Hi there! I'm your ausMasters visa assistant. I'll help you assess your student visa profile for Australia. Let's start with a few questions.\n\nFirst, what level of study are you planning to pursue?\n\n(Options: Undergraduate, Masters, PhD, Diploma/Certificate)",
  "student-level":
    "Great! Now, what course are you interested in and which university (if you've decided)?",
  "course-selection":
    "Now let's talk about your English proficiency.\n\nWhat test have you taken and what was your overall score?\n(Options: IELTS, PTE, TOEFL)",
  "english-score":
    "What's your estimated annual financial capacity for studying in Australia? (in AUD)",
  "financial-capacity":
    "Do you have any gaps in your study history? If yes, how many years and for what reason?",
  "study-gap":
    "Have you ever had a visa refusal from any country? If yes, please share details.",
  "visa-refusal":
    "Almost done! Do you have any additional queries or information you'd like to share about your profile?",
  "additional-queries":
    "",
  analyzing:
    "Analyzing your profile against our visa database...",
  complete: "",
};

function getInitialMessage(): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content: STAGE_PROMPTS.greeting,
    timestamp: new Date(),
    stage: "greeting",
  };
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage()]);
  const [input, setInput] = useState("");
  const [currentStage, setCurrentStage] = useState<ChatStage>("greeting");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateAnalysis = useCallback(() => {
    const processingTime = Math.floor(Math.random() * 6) + 2;
    const riskLevel = Math.random() > 0.6 ? "medium" : "low";

    const analysis: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `Your Visa Profile Analysis

Based on the information you provided:

Processing Time
Estimated processing time: ${processingTime}-${processingTime + 2} weeks

Risk Assessment
${riskLevel === "low" ? "Low Risk - Your profile looks strong for a student visa application." : "Medium Risk - There are some factors that may need attention."}

Recommendations
- Ensure all financial documents are up to date
- Prepare strong ties to your home country evidence
- If you have a study gap, prepare a clear explanation

Potential Drawbacks
${riskLevel === "medium" ? "- Your profile may require additional documentation\n- Consider getting an education agent consultation" : "- No major concerns identified\n- Standard documentation should suffice"}

---

Would you like to:
1. Complete the GS Questionnaire
2. Start a new assessment
3. Get more specific advice`,
      timestamp: new Date(),
      stage: "complete",
    };

    setMessages((prev) => [...prev, analysis]);
    setIsComplete(true);
    setCurrentStage("complete");
  }, []);

  const addBotMessage = useCallback((content: string, stage?: ChatStage) => {
    const botMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content,
      timestamp: new Date(),
      stage,
    };
    setMessages((prev) => [...prev, botMsg]);
  }, []);

  const advanceStage = useCallback(
    (stage: ChatStage, userResponse: string) => {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: userResponse,
        timestamp: new Date(),
        stage,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const nextStageIndex = STAGES.indexOf(stage) + 1;
        const nextStage = STAGES[nextStageIndex];

        if (nextStage === "analyzing") {
          setCurrentStage("analyzing");
          addBotMessage(STAGE_PROMPTS.analyzing, "analyzing");

          setTimeout(() => {
            generateAnalysis();
          }, 2500);
          return;
        }

        if (nextStage && STAGE_PROMPTS[nextStage]) {
          setCurrentStage(nextStage);
          addBotMessage(STAGE_PROMPTS[nextStage], nextStage);
        }
      }, 1200);
    },
    [addBotMessage, generateAnalysis]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const response = input.trim();
    setInput("");

    switch (currentStage) {
      case "greeting":
      case "student-level":
        advanceStage("student-level", response);
        break;
      case "course-selection":
        advanceStage("course-selection", response);
        break;
      case "english-score":
        advanceStage("english-score", response);
        break;
      case "financial-capacity":
        advanceStage("financial-capacity", response);
        break;
      case "study-gap":
        advanceStage("study-gap", response);
        break;
      case "visa-refusal":
        advanceStage("visa-refusal", response);
        break;
      case "additional-queries":
        advanceStage("additional-queries", response);
        break;
      default:
        advanceStage("greeting", response);
    }
  };

  const progress =
    (STAGES.indexOf(currentStage) / (STAGES.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-8rem)] flex flex-col">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Visa Assistant
                  </h2>
                  <p className="text-xs text-gray-500">
                    Australia Student Visa (Subclass 500)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                AI Powered
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Step {STAGES.indexOf(currentStage) + 1} of {STAGES.length}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === "assistant" && (
                        <Bot className="w-4 h-4 mt-1 flex-shrink-0 text-blue-500" />
                      )}
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      {message.role === "user" && (
                        <User className="w-4 h-4 mt-1 flex-shrink-0 text-white/70" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-gray-100 rounded-2xl rounded-bl-md w-fit"
              >
                <Bot className="w-4 h-4 text-blue-500" />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-100 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isComplete
                    ? "Type your choice (1, 2, or 3)..."
                    : "Type your answer..."
                }
                disabled={isTyping}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 text-sm"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                disabled={isTyping || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
