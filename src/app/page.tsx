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
import { BLOCS, BLOC_LABELS, getAllProjects, getProjectsByBloc } from "@/lib/projects";
import { getProjectStatus } from "@/lib/progression";

export default function Home() {
  const premierProjet = getAllProjects()[0];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <section className="rounded-xl border border-border bg-card p-8">
          <p className="text-sm text-muted-foreground">Bienvenue</p>
          <h1 className="mt-2 font-heading text-3xl text-foreground">
            Commencez par « {premierProjet.titre} »
          </h1>
          <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            12 projets, 402 h, à votre rythme. Dès qu’une session est
            enregistrée, cet écran reprendra exactement là où vous vous êtes
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
        </section>

        <section className="mt-16">
          <h2 className="font-heading text-xl text-foreground">
            Vue d&apos;ensemble des blocs de compétences
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {BLOCS.map((bloc) => {
              const projets = getProjectsByBloc(bloc);
              const heures = projets.reduce((sum, p) => sum + p.heures, 0);

              return (
                <Card key={bloc}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{bloc}</CardTitle>
                      <StatusBadge status={getProjectStatus(projets[0].id)} />
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
