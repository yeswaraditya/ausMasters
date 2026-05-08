import type { Metadata } from "next";
import IELTSCalculator from "@/components/ielts-calculator/IELTSCalculator";

export const metadata: Metadata = {
  title: "IELTS Score Calculator - ausMasters",
  description:
    "Calculate your IELTS overall band score and check if you meet Australian student visa and university requirements.",
};

export default function IELTSCalculatorPage() {
  return <IELTSCalculator />;
}
