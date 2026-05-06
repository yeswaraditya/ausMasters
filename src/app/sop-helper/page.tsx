import type { Metadata } from "next";
import SOPHelper from "@/components/sop/SOPHelper";

export const metadata: Metadata = {
  title: "SOP Helper - ausMasters",
  description:
    "Write and structure your Statement of Purpose for Australian student visa application.",
};

export default function SOPHelperPage() {
  return <SOPHelper />;
}
