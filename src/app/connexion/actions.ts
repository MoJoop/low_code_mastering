"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EnvoyerCodeState = {
  error?: string;
  email?: string;
  envoye?: boolean;
};

export async function envoyerCode(
  _prevState: EnvoyerCodeState,
  formData: FormData
): Promise<EnvoyerCodeState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { error: "Adresse e-mail requise." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    return { error: error.message, email };
  }
  return { envoye: true, email };
}

export type VerifierCodeState = {
  error?: string;
};

export async function verifierCode(
  _prevState: VerifierCodeState,
  formData: FormData
): Promise<VerifierCodeState> {
  const email = String(formData.get("email") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  if (!email || !code) {
    return { error: "E-mail et code requis." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "email",
  });

  if (error) {
    return { error: "Code invalide ou expiré." };
  }

  redirect("/");
}

export async function seDeconnecter() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
