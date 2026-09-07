import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type ProjectStatus = Database["public"]["Enums"]["project_status"];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  a_venir: "À venir",
  en_cours: "En cours",
  a_valider: "À valider",
  valide: "Validé",
};

export type ProgressEntry = {
  status: ProjectStatus;
  heuresFaites: number;
  updatedAt: string;
};

export type ProgressMap = ReadonlyMap<string, ProgressEntry>;

/**
 * Une seule lecture par page : les Server Components appellent ceci une fois
 * puis consultent la map en mémoire au lieu de refaire une requête par projet.
 */
export async function getProgressMap(): Promise<ProgressMap> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Map();

  const { data, error } = await supabase
    .from("project_progress")
    .select("project_id, status, heures_faites, updated_at")
    .eq("user_id", user.id);

  if (error || !data) return new Map();

  return new Map(
    data.map((row) => [
      row.project_id,
      {
        status: row.status,
        heuresFaites: Number(row.heures_faites),
        updatedAt: row.updated_at,
      },
    ])
  );
}

export function getStatus(map: ProgressMap, projectId: string): ProjectStatus {
  return map.get(projectId)?.status ?? "a_venir";
}

export function getHeuresFaites(map: ProgressMap, projectId: string): number {
  return map.get(projectId)?.heuresFaites ?? 0;
}

export function getCompletedProjectIds(map: ProgressMap): ReadonlySet<string> {
  return new Set(
    [...map.entries()]
      .filter(([, entry]) => entry.status === "valide")
      .map(([id]) => id)
  );
}

/**
 * Le projet à proposer en reprise instantanée sur l'accueil : le plus
 * récemment touché parmi ceux "en cours" ou "à valider".
 */
export function getDernierProjetActifId(map: ProgressMap): string | undefined {
  let plusRecent: { id: string; updatedAt: string } | undefined;

  for (const [id, entry] of map) {
    if (entry.status !== "en_cours" && entry.status !== "a_valider") continue;
    if (!plusRecent || entry.updatedAt > plusRecent.updatedAt) {
      plusRecent = { id, updatedAt: entry.updatedAt };
    }
  }

  return plusRecent?.id;
}
