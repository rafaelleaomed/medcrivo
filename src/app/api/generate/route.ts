import { NextRequest, NextResponse } from "next/server";
import { HealthcareComplianceEngine } from "@/lib/compliance";
import { ConsensusScientificEngine } from "@/lib/consensus";
import { VturbVideoScriptEngine } from "@/lib/vturbVideo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, specialty, doctorName, crm, profession, postText } = body;

    // 1. Triagem ética por profissão (CFM/CFO) e regras gerais de privacidade
    const audit = HealthcareComplianceEngine.audit(postText || topic, {
      profession: profession === "dentista" ? "dentista" : "medico",
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
      scientificTakeaway: evidence[0]?.takeaway || "",
      doctorName: doctorName || "Médico",
      crm: crm || "CRM/SP 000000",
    });

    return NextResponse.json({
      success: true,
      audit,
      evidence,
      script,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
