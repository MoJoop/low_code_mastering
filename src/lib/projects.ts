import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content", "projets");

export const BLOCS = ["BC01", "BC02", "BC03"] as const;
export type Bloc = (typeof BLOCS)[number];

export const BLOC_LABELS: Record<Bloc, string> = {
  BC01: "Participer à la mise en œuvre d'un projet",
  BC02: "Développer Front-End et Back-End",
  BC03: "Tester et publier",
};

const coursSchema = z.object({
  titre: z.string(),
  duree: z.number().positive(),
  niveau: z.enum(["facile", "moyenne", "difficile"]),
});

const livrableSchema = z.object({
  id: z.string(),
  type: z.enum(["fichier", "url"]),
  titre: z.string(),
  format: z.array(z.string()).optional(),
});

const soutenanceSchema = z.object({
  duree: z.number().positive(),
  attendus: z.array(z.string()).min(1),
});

const frontmatterSchema = z.object({
  id: z.string().regex(/^p([1-9]|1[0-2])$/, "id doit être p1 à p12"),
  ordre: z.number().int().positive(),
  titre: z.string(),
  bloc: z.enum(BLOCS),
  heures: z.number().positive(),
  resume: z.string(),
  competences: z.array(z.string()).min(1),
  prerequis: z.array(z.string()),
  outils: z.array(z.string()),
  cours: z.array(coursSchema),
  livrables: z.array(livrableSchema).min(1),
  soutenance: soutenanceSchema,
});

export type ProjectFrontmatter = z.infer<typeof frontmatterSchema>;

export type Project = ProjectFrontmatter & {
  content: string;
};

let cache: Project[] | null = null;

export function getAllProjects(): Project[] {
  if (cache) return cache;

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"));

  const projects = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const result = frontmatterSchema.safeParse(data);
    if (!result.success) {
      throw new Error(
        `Frontmatter invalide dans content/projets/${file} :\n${result.error.message}`
      );
    }
    return { ...result.data, content };
  });

  const ids = new Set(projects.map((p) => p.id));
  for (const project of projects) {
    for (const prereq of project.prerequis) {
      if (!ids.has(prereq)) {
        throw new Error(
          `Le projet ${project.id} référence un prérequis inconnu : ${prereq}`
        );
      }
    }
  }

  cache = projects.sort((a, b) => a.ordre - b.ordre);
  return cache;
}

export function getProjectIds(): string[] {
  return getAllProjects().map((p) => p.id);
}

export function getProjectById(id: string): Project | undefined {
  return getAllProjects().find((p) => p.id === id);
}

export function getProjectsByBloc(bloc: Bloc): Project[] {
  return getAllProjects().filter((p) => p.bloc === bloc);
}

/**
 * Un projet reste toujours accessible : `manquants` sert à afficher un bandeau
 * d'avertissement, jamais à bloquer la navigation (spec section 4).
 */
export function getPrerequisStatus(
  project: Project,
  completedIds: ReadonlySet<string>
) {
  const manquants = project.prerequis
    .filter((id) => !completedIds.has(id))
    .map((id) => getProjectById(id))
    .filter((p): p is Project => Boolean(p));

  return { disponible: manquants.length === 0, manquants };
}
