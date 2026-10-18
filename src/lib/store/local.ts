import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DoctorProfileSchema, type DoctorProfile } from "@/lib/profile";
import type { PostDraft } from "@/lib/content/schema";
import type { CarouselJobInput, JobPatch, JobRecord, PostRecord, Store, UsageEvent } from "./types";

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
  };
}
