"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const CredentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

function readCredentials(formData: FormData) {
  return CredentialsSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
}

export async function login(formData: FormData) {
  const parsed = readCredentials(formData);
  if (!parsed.success) redirect("/login?erro=dados");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) redirect("/login?erro=credenciais");

  revalidatePath("/", "layout");
  redirect("/app");
}

export async function signup(formData: FormData) {
  const parsed = readCredentials(formData);
  if (!parsed.success) redirect("/login?erro=dados");

  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "";
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    ...parsed.data,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });
  if (error) redirect("/login?erro=cadastro");

  redirect("/login?aviso=confirme-email");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
