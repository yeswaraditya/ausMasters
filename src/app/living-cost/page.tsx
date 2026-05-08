import type { Metadata } from "next";
import LivingCostCalculator from "@/components/living-cost/LivingCostCalculator";

export const metadata: Metadata = {
  title: "Living Cost Calculator - ausMasters",
  description:
    "Estimate your monthly living expenses across 8 Australian cities with currency conversion, lifestyle scoring, and PDF export.",
};

export default function LivingCostPage() {
  return <LivingCostCalculator />;
}
