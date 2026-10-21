import { HealthcareComplianceEngine } from "@/lib/compliance";
import { LIBRARY_MODELS, modelText, specialtyById } from "./templates";

export type ModelCrivo = { score: number; isApproved: boolean };

/**
 * Nota do Crivo de cada modelo (gancho + tema). A identificação (nome, CRM/CRO) entra no rodapé dos slides
 * na geração, por isso o aviso de identificação não conta aqui; o post gerado passa pelo Crivo completo.
 */
export function libraryCrivo(): Record<string, ModelCrivo> {
  const result: Record<string, ModelCrivo> = {};
  for (const model of LIBRARY_MODELS) {
    const audit = HealthcareComplianceEngine.audit(modelText(model), { profession: specialtyById(model.specialty).profession });
    const infractions = audit.infractions.filter((i) => i.category !== "identificacao_obrigatoria");
    let score = 100;
    for (const i of infractions) score -= i.severity === "CRITICAL" ? 30 : i.severity === "WARNING" ? 10 : 5;
    result[model.id] = {
      score: Math.max(0, score),
      isApproved: score >= 80 && !infractions.some((i) => i.severity === "CRITICAL"),
    };
  }
  return result;
}
