export type ProjectStatus = "a_venir" | "en_cours" | "a_valider" | "valide";

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  a_venir: "À venir",
  en_cours: "En cours",
  a_valider: "À valider",
  valide: "Validé",
};

/**
 * Pas de persistance avant la tranche 3 (Supabase) : aucun projet n'est
 * encore marqué comme terminé. Cette fonction est le seul endroit à changer
 * quand la vraie progression arrivera — le reste de l'app la consomme déjà.
 */
export function getCompletedProjectIds(): ReadonlySet<string> {
  return new Set();
}

export function getProjectStatus(projectId: string): ProjectStatus {
  return getCompletedProjectIds().has(projectId) ? "valide" : "a_venir";
}

export function getHeuresFaites(_projectId: string): number {
  return 0;
}
