import { z } from "zod";
import type { DoctorProfile } from "@/lib/profile";
import type { PostDraft, PostSlide } from "@/lib/content/schema";
import type { PlannerItem, PlannerItemInput, PlannerItemPatch } from "@/lib/planner/planner";

export type { PlannerItem, PlannerItemInput, PlannerItemPatch } from "@/lib/planner/planner";

export const CarouselJobInputSchema = z.object({
  topic: z.string().trim().min(3, "Informe um tema com pelo menos 3 caracteres.").max(500),
  /** Contexto extraído de notícia/artigo (opcional), já resumido pelo /api/extract-link. */
  sourceContext: z.string().max(4000).optional(),
  tone: z.enum(["didatico", "academico", "consultorio"]).default("didatico"),
  slideCount: z.number().int().min(7).max(10).default(9),
});
export type CarouselJobInput = z.infer<typeof CarouselJobInputSchema>;

export type JobStatus = "queued" | "running" | "done" | "failed";

export interface JobRecord {
  id: string;
  kind: "carousel";
  status: JobStatus;
  progress: number;
  step: string;
  input: CarouselJobInput;
  postId: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

export type JobPatch = Partial<Pick<JobRecord, "status" | "progress" | "step" | "postId" | "error">>;

export interface PostRecord {
  id: string;
  topic: string;
  status: "draft" | "approved" | "scheduled" | "published";
  draft: PostDraft;
  createdAt: string;
}

/** Item da lista "Meus conteúdos": só o necessário para a miniatura (sem o rascunho inteiro). */
export interface PostSummary {
  id: string;
  topic: string;
  status: PostRecord["status"];
  createdAt: string;
  framework: PostDraft["framework"] | null;
  /** Nota do Crivo (0–100) e se passou sem bloqueios automáticos. */
  score: number | null;
  isApproved: boolean | null;
  cover: PostSlide | null;
  slideCount: number | null;
}

export interface PostListFilter {
  status?: PostRecord["status"];
  limit?: number;
}

export interface UsageEvent {
  jobId: string | null;
  model: string;
  inputTokens: number;
  outputTokens: number;
}

/** Acesso a dados já escopado ao usuário autenticado (ou ao usuário local em modo de desenvolvimento). */
export interface Store {
  mode: "supabase" | "local";
  userId: string;
  getProfile(): Promise<DoctorProfile | null>;
  saveProfile(profile: DoctorProfile): Promise<DoctorProfile>;
  createJob(input: CarouselJobInput): Promise<JobRecord>;
  updateJob(id: string, patch: JobPatch): Promise<void>;
  getJob(id: string): Promise<JobRecord | null>;
  createPost(topic: string, draft: PostDraft): Promise<PostRecord>;
  getPost(id: string): Promise<PostRecord | null>;
  logUsage(event: UsageEvent): Promise<void>;
  /** Meus conteúdos: posts do mais novo ao mais antigo. */
  listPosts(filter?: PostListFilter): Promise<PostSummary[]>;
  updatePostStatus(id: string, status: PostRecord["status"]): Promise<PostSummary | null>;
  /** Planner: agendamentos em [from, to) (ISO). */
  listPlannerItems(from: string, to: string): Promise<PlannerItem[]>;
  createPlannerItem(input: PlannerItemInput): Promise<PlannerItem>;
  updatePlannerItem(id: string, patch: PlannerItemPatch): Promise<PlannerItem | null>;
  /** Devolve o item removido (ou null se não existia). */
  deletePlannerItem(id: string): Promise<PlannerItem | null>;
}
