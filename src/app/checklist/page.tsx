import type { Metadata } from "next";
import VisaChecklist from "@/components/checklist/VisaChecklist";

export const metadata: Metadata = {
  title: "Visa Checklist - ausMasters",
  description:
    "Complete checklist for your Australian student visa application.",
};

export default function ChecklistPage() {
  return <VisaChecklist />;
}
