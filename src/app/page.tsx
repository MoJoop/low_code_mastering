import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BLOCS,
  BLOC_LABELS,
  getAllProjects,
  getProjectById,
  getProjectsByBloc,
} from "@/lib/projects";
import {
  getDernierProjetActifId,
  getHeuresFaites,
  getProgressMap,
  getStatus,
} from "@/lib/progression";
import { createClient } from "@/lib/supabase/server";

function statusDuBloc(statuts: ReturnType<typeof getStatus>[]) {
  if (statuts.every((s) => s === "valide")) return "valide" as const;
  if (statuts.some((s) => s === "en_cours" || s === "a_valider")) return "en_cours" as const;
  return "a_venir" as const;
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const progress = await getProgressMap();
  const premierProjet = getAllProjects()[0];
  const projetActifId = getDernierProjetActifId(progress);
  const projetActif = projetActifId ? getProjectById(projetActifId) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <section className="rounded-xl border border-border bg-card p-8">
          {!user && (
            <>
              <p className="text-sm text-muted-foreground">Bienvenue</p>
              <h1 className="mt-2 font-heading text-3xl text-foreground">
                Connectez-vous pour commencer
              </h1>
              <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
                12 projets, 402 h, à votre rythme. Votre progression est
                enregistrée dès que vous êtes connecté : cet écran reprendra
                alors exactement là où vous vous êtes arrêté.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Button asChild variant="cta" size="lg">
                  <Link href="/connexion">Se connecter</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/parcours">Voir le parcours</Link>
                </Button>
              </div>
            </>
          )}

          {user && projetActif && (
            <>
              <p className="text-sm text-muted-foreground">Reprise instantanée</p>
              <h1 className="mt-2 font-heading text-3xl text-foreground">
                Continuez « {projetActif.titre} »
              </h1>
              <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
                {getHeuresFaites(progress, projetActif.id)} h faites sur{" "}
                {projetActif.heures} h prévues.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Button asChild variant="cta" size="lg">
                  <Link href={`/projet/${projetActif.id}`}>
                    Reprendre {projetActif.id.toUpperCase()}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/parcours">Voir le parcours</Link>
                </Button>
              </div>
            </>
          )}

          {user && !projetActif && (
            <>
              <p className="text-sm text-muted-foreground">Bienvenue</p>
              <h1 className="mt-2 font-heading text-3xl text-foreground">
                Commencez par « {premierProjet.titre} »
              </h1>
              <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
                12 projets, 402 h, à votre rythme. Dès que ce projet sera
                démarré, cet écran reprendra exactement là où vous vous êtes
                arrêté.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Button asChild variant="cta" size="lg">
                  <Link href={`/projet/${premierProjet.id}`}>
                    Commencer {premierProjet.id.toUpperCase()}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/parcours">Voir le parcours</Link>
                </Button>
              </div>
            </>
          )}
        </section>

        <section className="mt-16">
          <h2 className="font-heading text-xl text-foreground">
            Vue d&apos;ensemble des blocs de compétences
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {BLOCS.map((bloc) => {
              const projets = getProjectsByBloc(bloc);
              const heures = projets.reduce((sum, p) => sum + p.heures, 0);
              const statuts = projets.map((p) => getStatus(progress, p.id));

              return (
                <Card key={bloc}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{bloc}</CardTitle>
                      <StatusBadge status={statusDuBloc(statuts)} />
                    </div>
                    <CardDescription>{BLOC_LABELS[bloc]}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {heures} h · {projets.length} projets
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
