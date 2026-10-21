import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DoctorProfileSchema, type DoctorProfile } from "@/lib/profile";
import type { PostDraft } from "@/lib/content/schema";
import type { CarouselJobInput, JobPatch, JobRecord, PlannerItem, PostRecord, PostSummary, Store, UsageEvent } from "./types";

function toPostSummary(post: PostRecord): PostSummary {
  return {
    id: post.id,
    topic: post.topic,
    status: post.status,
    createdAt: post.createdAt,
    framework: post.draft?.framework ?? null,
    score: post.draft?.audit?.score ?? null,
    isApproved: post.draft?.audit?.isApproved ?? null,
    cover: post.draft?.slides?.[0] ?? null,
    slideCount: post.draft?.slides?.length ?? null,
  };
}

/**
 * Armazenamento em arquivo para desenvolvimento sem Supabase (um único usuário local).
 * Fica em `.data/` (ignorado pelo git). Não usar em produção.
 */
const LOCAL_USER_ID = "local-dev-user";
const DATA_FILE = path.join(process.cwd(), ".data", "local-store.json");

interface LocalData {
  profile: DoctorProfile | null;
  jobs: Record<string, JobRecord>;
  posts: Record<string, PostRecord>;
  usage: (UsageEvent & { createdAt: string })[];
  /** Opcional: arquivos antigos não têm a chave (ver `data.plannerItems ??= {}`). */
  plannerItems?: Record<string, PlannerItem>;
}

const EMPTY: LocalData = { profile: null, jobs: {}, posts: {}, usage: [] };

// Serializa leituras/escritas no processo para não perder atualizações concorrentes do job.
let queue: Promise<unknown> = Promise.resolve();
function serialized<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function read(): Promise<LocalData> {
  try {
    return { ...EMPTY, ...JSON.parse(await fs.readFile(DATA_FILE, "utf-8")) };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return structuredClone(EMPTY);
    throw err;
  }
}

async function write(data: LocalData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 1), "utf-8");
  await fs.rename(tmp, DATA_FILE);
}

function mutate<T>(fn: (data: LocalData) => T): Promise<T> {
  return serialized(async () => {
    const data = await read();
    const result = fn(data);
    await write(data);
    return result;
  });
}

export function createLocalStore(): Store {
  return {
    mode: "local",
    userId: LOCAL_USER_ID,

    async getProfile() {
      const data = await serialized(read);
      return data.profile ? DoctorProfileSchema.parse(data.profile) : null;
    },

    saveProfile(profile) {
      return mutate((data) => {
        data.profile = profile;
        return profile;
      });
    },

    createJob(input: CarouselJobInput) {
      const now = new Date().toISOString();
      const job: JobRecord = {
        id: randomUUID(),
        kind: "carousel",
        status: "queued",
        progress: 0,
        step: "Na fila",
        input,
        postId: null,
        error: null,
        createdAt: now,
        updatedAt: now,
      };
      return mutate((data) => {
        data.jobs[job.id] = job;
        return job;
      });
    },

    async updateJob(id: string, patch: JobPatch) {
      await mutate((data) => {
        const job = data.jobs[id];
        if (job) data.jobs[id] = { ...job, ...patch, updatedAt: new Date().toISOString() };
      });
    },

    async getJob(id) {
      const data = await serialized(read);
      return data.jobs[id] ?? null;
    },

    createPost(topic: string, draft: PostDraft) {
      const post: PostRecord = { id: randomUUID(), topic, status: "draft", draft, createdAt: new Date().toISOString() };
      return mutate((data) => {
        data.posts[post.id] = post;
        return post;
      });
    },

    async getPost(id) {
      const data = await serialized(read);
      return data.posts[id] ?? null;
    },

    async logUsage(event) {
      await mutate((data) => {
        data.usage.push({ ...event, createdAt: new Date().toISOString() });
      });
    },

    async listPosts(filter = {}) {
      const data = await serialized(read);
      return Object.values(data.posts)
        .filter((p) => !filter.status || p.status === filter.status)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, filter.limit ?? 60)
        .map(toPostSummary);
    },

    updatePostStatus(id, status) {
      return mutate((data) => {
        const post = data.posts[id];
        if (!post) return null;
        post.status = status;
        return toPostSummary(post);
      });
    },

    async listPlannerItems(from, to) {
      const data = await serialized(read);
      const start = Date.parse(from);
      const end = Date.parse(to);
      return Object.values(data.plannerItems ?? {})
        .filter((i) => {
          const t = Date.parse(i.scheduledAt);
          return t >= start && t < end;
        })
        .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
    },

    createPlannerItem(input) {
      const now = new Date().toISOString();
      const item: PlannerItem = { id: randomUUID(), ...input, scheduledAt: new Date(input.scheduledAt).toISOString(), createdAt: now, updatedAt: now };
      return mutate((data) => {
        if (item.postId && !data.posts[item.postId]) throw new Error("Post não encontrado.");
        (data.plannerItems ??= {})[item.id] = item;
        return item;
      });
    },

    updatePlannerItem(id, patch) {
      return mutate((data) => {
        const items = (data.plannerItems ??= {});
        const item = items[id];
        if (!item) return null;
        if (patch.postId && !data.posts[patch.postId]) throw new Error("Post não encontrado.");
        const scheduledAt = patch.scheduledAt ? new Date(patch.scheduledAt).toISOString() : item.scheduledAt;
        items[id] = { ...item, ...patch, scheduledAt, updatedAt: new Date().toISOString() };
        return items[id];
      });
    },

    deletePlannerItem(id) {
      return mutate((data) => {
        const items = (data.plannerItems ??= {});
        const item = items[id] ?? null;
        delete items[id];
        return item;
      });
    },
  };
}
