import type { Metadata } from "next";
import UniversityPriorities from "@/components/priorities/UniversityPriorities";

export const metadata: Metadata = {
  title: "University Priorities List - ausMasters",
  description: "Latest university priorities and allocation status for Australian student visas. Data from PRISMS as of 1 May 2026.",
};

export default function UniversityPrioritiesPage() {
  return <UniversityPriorities />;
}