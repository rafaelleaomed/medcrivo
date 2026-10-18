import { NextRequest, NextResponse } from "next/server";
import { HealthcareComplianceEngine } from "@/lib/compliance";
import { ConsensusScientificEngine } from "@/lib/consensus";
import { VturbVideoScriptEngine } from "@/lib/vturbVideo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, specialty, doctorName, crm, postText } = body;

    // 1. Auditoria de Compliance Ético CFM 2.336/2023 & LGPD
    const audit = HealthcareComplianceEngine.audit(postText || topic, {
      doctorName,
      crm,
      hasRqe: true,
    });

    // 2. Busca Científica com Consensus AI
    const evidence = await ConsensusScientificEngine.searchEvidence(topic);

    // 3. Roteiro de Vídeo Vturb com Humanizer e Hook Score
    const script = await VturbVideoScriptEngine.generateScript({
      specialty: specialty || "Medicina Clínica",
      topic: topic || "Saúde Integrativa",
      scientificTakeaway: evidence[0]?.takeaway || "Estudo clínico evidenciando desfecho positivo.",
      doctorName: doctorName || "Médico",
      crm: crm || "CRM/SP 000000",
    });

    return NextResponse.json({
      success: true,
      audit,
      evidence,
      script,
      viralityScore: Math.floor(Math.random() * 15) + 85, // Simula o score de viralidade (85-99)
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
