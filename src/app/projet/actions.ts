"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function demarrerProjet(projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existant } = await supabase
    .from("project_progress")
    .select("status")
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .maybeSingle();

  const status = !existant || existant.status === "a_venir" ? "en_cours" : existant.status;

  await supabase
    .from("project_progress")
    .upsert(
      { user_id: user.id, project_id: projectId, status },
      { onConflict: "user_id,project_id" }
    );

  revalidatePath("/");
  revalidatePath("/parcours");
  revalidatePath(`/projet/${projectId}`);
}
