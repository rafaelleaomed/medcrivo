import type { SupabaseClient } from "@supabase/supabase-js";
import { DoctorProfileSchema, type DoctorProfile } from "@/lib/profile";
import type { PostDraft } from "@/lib/content/schema";
import type { CarouselJobInput, JobPatch, JobRecord, PlannerItem, PlannerItemPatch, PostRecord, PostSummary, Store } from "./types";

/* Linhas do Postgres (snake_case) <-> modelos do app (camelCase). As políticas RLS garantem o escopo por usuário. */

interface ProfileRow {
  name: string;
  profession: string;
  career_stage: string;
  specialty: string;
  council_id: string;
  rqe: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  booking_link: string;
  interests: string[];
  audience_pains: string[];
  tone: string;
  brand: unknown;
  onboarded: boolean;
}

interface JobRow {
  id: string;
  kind: "carousel";
  status: JobRecord["status"];
  progress: number;
  step: string;
  input: CarouselJobInput;
  post_id: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

interface PostRow {
  id: string;
  topic: string;
  status: PostRecord["status"];
  draft: PostDraft;
  created_at: string;
}

function profileFromRow(row: ProfileRow): DoctorProfile {
  return DoctorProfileSchema.parse({
    name: row.name,
    profession: row.profession,
    careerStage: row.career_stage,
    specialty: row.specialty,
    crm: row.council_id,
    rqe: row.rqe,
    instagram: row.instagram,
    tiktok: row.tiktok,
    youtube: row.youtube,
    bookingLink: row.booking_link,
    interests: row.interests,
    audiencePains: row.audience_pains,
    tone: row.tone,
    brand: row.brand,
    onboarded: row.onboarded,
  });
}

function jobFromRow(row: JobRow): JobRecord {
  return {
    id: row.id,
    kind: row.kind,
    status: row.status,
    progress: row.progress,
    step: row.step,
    input: row.input,
    postId: row.post_id,
    error: row.error,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function postFromRow(row: PostRow): PostRecord {
  return { id: row.id, topic: row.topic, status: row.status, draft: row.draft, createdAt: row.created_at };
}

/* Meus conteúdos: só a capa e a nota do Crivo saem do jsonb (a lista não carrega o rascunho inteiro). */
const POST_SUMMARY_COLUMNS =
  "id, topic, status, created_at, framework:draft->>framework, score:draft->audit->score, approved:draft->audit->isApproved, cover:draft->slides->0, last_number:draft->slides->-1->number";

interface PostSummaryRow {
  id: string;
  topic: string;
  status: PostRecord["status"];
  created_at: string;
  framework: PostSummary["framework"];
  score: number | null;
  approved: boolean | null;
  cover: PostSummary["cover"];
  last_number: number | null;
}

function postSummaryFromRow(row: PostSummaryRow): PostSummary {
  return {
    id: row.id,
    topic: row.topic,
    status: row.status,
    createdAt: row.created_at,
    framework: row.framework ?? null,
    score: typeof row.score === "number" ? row.score : null,
    isApproved: typeof row.approved === "boolean" ? row.approved : null,
    cover: row.cover ?? null,
    slideCount: typeof row.last_number === "number" ? row.last_number : null,
  };
}

interface PlannerRow {
  id: string;
  post_id: string | null;
  title: string;
  format: PlannerItem["format"];
  scheduled_at: string;
  note: string;
  status: PlannerItem["status"];
  created_at: string;
  updated_at: string;
}

const PLANNER_COLUMNS = "id, post_id, title, format, scheduled_at, note, status, created_at, updated_at";

function plannerFromRow(row: PlannerRow): PlannerItem {
  return {
    id: row.id,
    postId: row.post_id,
    title: row.title,
    format: row.format,
    scheduledAt: new Date(row.scheduled_at).toISOString(),
    note: row.note,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function plannerPatchToRow(patch: PlannerItemPatch): Partial<PlannerRow> {
  const row: Partial<PlannerRow> = {};
  if (patch.postId !== undefined) row.post_id = patch.postId;
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.format !== undefined) row.format = patch.format;
  if (patch.scheduledAt !== undefined) row.scheduled_at = patch.scheduledAt;
  if (patch.note !== undefined) row.note = patch.note;
  if (patch.status !== undefined) row.status = patch.status;
  return row;
}

export function createSupabaseStore(supabase: SupabaseClient, userId: string): Store {
  return {
    mode: "supabase",
    userId,

    async getProfile() {
      const { data, error } = await supabase.from("doctor_profiles").select("*").eq("user_id", userId).maybeSingle();
      if (error) throw error;
      return data ? profileFromRow(data as ProfileRow) : null;
    },

    async saveProfile(profile) {
      const { data, error } = await supabase
        .from("doctor_profiles")
        .upsert({
          user_id: userId,
          name: profile.name,
          profession: profile.profession,
          career_stage: profile.careerStage,
          specialty: profile.specialty,
          council_id: profile.crm,
          rqe: profile.rqe,
          instagram: profile.instagram,
          tiktok: profile.tiktok,
          youtube: profile.youtube,
          booking_link: profile.bookingLink,
          interests: profile.interests,
          audience_pains: profile.audiencePains,
          tone: profile.tone,
          brand: profile.brand,
          onboarded: profile.onboarded,
        })
        .select("*")
        .single();
      if (error) throw error;
      return profileFromRow(data as ProfileRow);
    },

    async createJob(input) {
      const { data, error } = await supabase
        .from("generation_jobs")
        .insert({ user_id: userId, kind: "carousel", input })
        .select("*")
        .single();
      if (error) throw error;
      return jobFromRow(data as JobRow);
    },

    async updateJob(id, patch: JobPatch) {
      const row: Partial<JobRow> = {};
      if (patch.status !== undefined) row.status = patch.status;
      if (patch.progress !== undefined) row.progress = patch.progress;
      if (patch.step !== undefined) row.step = patch.step;
      if (patch.postId !== undefined) row.post_id = patch.postId;
      if (patch.error !== undefined) row.error = patch.error;
      const { error } = await supabase.from("generation_jobs").update(row).eq("id", id);
      if (error) throw error;
    },

    async getJob(id) {
      const { data, error } = await supabase.from("generation_jobs").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? jobFromRow(data as JobRow) : null;
    },

    async createPost(topic, draft) {
      const { data, error } = await supabase
        .from("posts")
        .insert({ user_id: userId, topic, draft, compliance: draft.audit, evidence: draft.evidence })
        .select("id, topic, status, draft, created_at")
        .single();
      if (error) throw error;
      return postFromRow(data as PostRow);
    },

    async getPost(id) {
      const { data, error } = await supabase
        .from("posts")
        .select("id, topic, status, draft, created_at")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data ? postFromRow(data as PostRow) : null;
    },

    async logUsage(event) {
      const { error } = await supabase.from("ai_usage_events").insert({
        user_id: userId,
        job_id: event.jobId,
        model: event.model,
        input_tokens: event.inputTokens,
        output_tokens: event.outputTokens,
      });
      if (error) console.warn("Falha ao registrar uso de IA:", error.message);
    },

    async listPosts(filter = {}) {
      let query = supabase
        .from("posts")
        .select(POST_SUMMARY_COLUMNS)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(filter.limit ?? 60);
      if (filter.status) query = query.eq("status", filter.status);
      const { data, error } = await query;
      if (error) throw error;
      return ((data ?? []) as unknown as PostSummaryRow[]).map(postSummaryFromRow);
    },

    async updatePostStatus(id, status) {
      const { data, error } = await supabase
        .from("posts")
        .update({ status })
        .eq("id", id)
        .eq("user_id", userId)
        .select(POST_SUMMARY_COLUMNS)
        .maybeSingle();
      if (error) throw error;
      return data ? postSummaryFromRow(data as unknown as PostSummaryRow) : null;
    },

    async listPlannerItems(from, to) {
      const { data, error } = await supabase
        .from("planner_items")
        .select(PLANNER_COLUMNS)
        .eq("user_id", userId)
        .gte("scheduled_at", from)
        .lt("scheduled_at", to)
        .order("scheduled_at", { ascending: true })
        .limit(500);
      if (error) throw error;
      return ((data ?? []) as PlannerRow[]).map(plannerFromRow);
    },

    async createPlannerItem(input) {
      const { data, error } = await supabase
        .from("planner_items")
        .insert({
          user_id: userId,
          post_id: input.postId,
          title: input.title,
          format: input.format,
          scheduled_at: input.scheduledAt,
          note: input.note,
          status: input.status,
        })
        .select(PLANNER_COLUMNS)
        .single();
      if (error) throw error;
      return plannerFromRow(data as PlannerRow);
    },

    async updatePlannerItem(id, patch) {
      const { data, error } = await supabase
        .from("planner_items")
        .update(plannerPatchToRow(patch))
        .eq("id", id)
        .eq("user_id", userId)
        .select(PLANNER_COLUMNS)
        .maybeSingle();
      if (error) throw error;
      return data ? plannerFromRow(data as PlannerRow) : null;
    },

    async deletePlannerItem(id) {
      const { data, error } = await supabase
        .from("planner_items")
        .delete()
        .eq("id", id)
        .eq("user_id", userId)
        .select(PLANNER_COLUMNS)
        .maybeSingle();
      if (error) throw error;
      return data ? plannerFromRow(data as PlannerRow) : null;
    },
  };
}
