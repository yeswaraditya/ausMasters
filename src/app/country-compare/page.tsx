import type { Metadata } from "next";
import CountryComparison from "@/components/compare/CountryComparison";

export const metadata: Metadata = {
  title: "Country Comparison - ausMasters",
  description:
    "Compare study destinations: Australia, USA, Germany side by side.",
};

export default function CountryComparePage() {
  return <CountryComparison />;
}
