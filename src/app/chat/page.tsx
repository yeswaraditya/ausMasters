import type { Metadata } from "next";
import ChatInterface from "@/components/chat/ChatInterface";

export const metadata: Metadata = {
  title: "Visa Chat - ausMasters",
  description:
    "AI-powered visa profile assessment chat for Australian student visas.",
};

export default function ChatPage() {
  return <ChatInterface />;
}
