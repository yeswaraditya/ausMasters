import type { Metadata } from "next";
import GSQuestionnaire from "@/components/gs-questionnaire/GSQuestionnaire";

export const metadata: Metadata = {
  title: "GS Questionnaire - ausMasters",
  description:
    "Complete your Genuine Student questionnaire for Australian student visa.",
};

export default function GSQuestionnairePage() {
  return <GSQuestionnaire />;
}
