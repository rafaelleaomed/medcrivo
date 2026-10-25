import type { Metadata } from "next";
import { ApprovalHub } from "@/components/editorial/ApprovalHub";

export const metadata: Metadata = { title: "Central de aprovação" };

export default function AprovacoesPage() {
  return <ApprovalHub />;
}
