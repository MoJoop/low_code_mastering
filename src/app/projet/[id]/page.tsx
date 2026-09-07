import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  getPrerequisStatus,
  getProjectById,
  getProjectIds,
  BLOC_LABELS,
} from "@/lib/projects";
import { getCompletedProjectIds, getHeuresFaites, getProjectStatus } from "@/lib/progression";

export function generateStaticParams() {
  return getProjectIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projet = getProjectById(id);
  return { title: projet ? `${projet.titre} — Low-Code Studio` : "Projet introuvable" };
}

export default async function ProjetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projet = getProjectById(id);
  if (!projet) notFound();

  const completedIds = getCompletedProjectIds();
  const { disponible, manquants } = getPrerequisStatus(projet, completedIds);
  const heuresFaites = getHeuresFaites(projet.id);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/parcours" className="text-sm text-primary hover:underline">
          ← Parcours
        </Link>

        {!disponible && (
          <div className="mt-6 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
            Ce projet est conseillé après{" "}
            {manquants.map((m) => m.id.toUpperCase()).join(", ")}, mais reste
            accessible dès maintenant si vous préférez avancer autrement.
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {projet.bloc} — {BLOC_LABELS[projet.bloc]}
          </p>
          <StatusBadge status={getProjectStatus(projet.id)} />
        </div>

        <h1 className="mt-2 font-heading text-3xl text-foreground">
          {projet.titre}
        </h1>
        <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
          {projet.resume}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {heuresFaites} h faites / {projet.heures} h prévues
          </span>
          <Badge variant="outline">
            {projet.outils.length > 0 ? projet.outils.join(" · ") : "Aucun outil imposé"}
          </Badge>
        </div>

        <section className="mt-12">
          <h2 className="font-heading text-xl text-foreground">Brief</h2>
          <div className="prose prose-neutral mt-4 max-w-none text-foreground prose-headings:font-heading prose-headings:font-medium prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
            <MDXRemote source={projet.content} />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-heading text-xl text-foreground">
            Compétences ciblées
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {projet.competences.map((competence) => (
              <Badge key={competence} variant="outline">
                {competence}
              </Badge>
            ))}
          </div>
        </section>

        {projet.cours.length > 0 && (
          <section className="mt-12">
            <h2 className="font-heading text-xl text-foreground">
              Cours associés
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {projet.cours.map((cours) => (
                <li
                  key={cours.titre}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm"
                >
                  <span>{cours.titre}</span>
                  <span className="text-muted-foreground">
                    {cours.duree} h · {cours.niveau}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12">
          <h2 className="font-heading text-xl text-foreground">Livrables</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {projet.livrables.map((livrable) => (
              <li
                key={livrable.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm"
              >
                <span>{livrable.titre}</span>
                <span className="text-muted-foreground">
                  {livrable.type === "url"
                    ? "Lien"
                    : livrable.format?.join(", ").toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 mb-16 rounded-xl border border-border bg-bg-sunken p-6">
          <h2 className="font-heading text-xl text-foreground">
            Soutenance blanche
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {projet.soutenance.duree} min · attendus :
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
            {projet.soutenance.attendus.map((attendu) => (
              <li key={attendu}>{attendu}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
