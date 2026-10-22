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

const EmailSchema = z.object({ email: z.string().trim().email() });

/** Envia o link de redefinição. A resposta é a mesma exista ou não a conta, para não revelar quem está cadastrado. */
export async function requestPasswordReset(formData: FormData) {
  const parsed = EmailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) redirect("/esqueci-senha?erro=dados");

  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "";
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: `${origin}/auth/confirm?next=/redefinir-senha` });
  redirect("/esqueci-senha?aviso=enviado");
}

const NewPasswordSchema = z.object({ password: z.string().min(8), confirm: z.string() }).refine((v) => v.password === v.confirm);

/** Define a nova senha de quem chegou pelo link do e-mail (a sessão de recuperação já está aberta). */
export async function updatePassword(formData: FormData) {
  const parsed = NewPasswordSchema.safeParse({ password: formData.get("password"), confirm: formData.get("confirm") });
  if (!parsed.success) redirect("/redefinir-senha?erro=dados");

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) redirect("/redefinir-senha?erro=falha");

  revalidatePath("/", "layout");
  redirect("/app");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
