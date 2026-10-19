import type { SupabaseClient } from "@supabase/supabase-js";
import { DoctorProfileSchema, type DoctorProfile } from "@/lib/profile";
import type { PostDraft } from "@/lib/content/schema";
import type { CarouselJobInput, JobPatch, JobRecord, PostRecord, Store } from "./types";

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
  };
}
