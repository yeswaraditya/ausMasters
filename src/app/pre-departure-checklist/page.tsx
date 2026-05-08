import type { Metadata } from "next";
import PreDepartureChecklist from "@/components/checklist/PreDepartureChecklist";

export const metadata: Metadata = {
  title: "Pre-Departure Checklist - ausMasters",
  description:
    "Complete checklist for preparing to depart to Australia for your Masters studies.",
};

export default function PreDepartureChecklistPage() {
  return <PreDepartureChecklist />;
}
