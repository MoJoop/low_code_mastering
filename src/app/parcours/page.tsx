import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
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
  getPrerequisStatus,
  getProjectsByBloc,
} from "@/lib/projects";
import { getCompletedProjectIds, getHeuresFaites, getProjectStatus } from "@/lib/progression";

export const metadata = {
  title: "Parcours — Low-Code Studio",
};

export default function ParcoursPage() {
  const completedIds = getCompletedProjectIds();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="font-heading text-3xl text-foreground">Parcours</h1>
        <p className="mt-2 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
          12 projets, 402 h, répartis sur 3 blocs de compétences. Un projet
          reste toujours accessible, même si ses prérequis ne sont pas
          terminés.
        </p>

        <div className="mt-12 flex flex-col gap-16">
          {BLOCS.map((bloc) => {
            const projets = getProjectsByBloc(bloc);
            const heuresPrevues = projets.reduce((sum, p) => sum + p.heures, 0);

            return (
              <section key={bloc}>
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-heading text-xl text-foreground">
                    {bloc} — {BLOC_LABELS[bloc]}
                  </h2>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {heuresPrevues} h prévues
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {projets.map((projet) => {
                    const { disponible, manquants } = getPrerequisStatus(
                      projet,
                      completedIds
                    );
                    const heuresFaites = getHeuresFaites(projet.id);

                    return (
                      <Link
                        key={projet.id}
                        href={`/projet/${projet.id}`}
                        className="rounded-xl transition-shadow hover:shadow-sm"
                      >
                        <Card className="h-full">
                          <CardHeader>
                            <div className="flex items-center justify-between gap-2">
                              <CardTitle>
                                {projet.id.toUpperCase()} · {projet.heures} h
                              </CardTitle>
                              <StatusBadge status={getProjectStatus(projet.id)} />
                            </div>
                            <CardDescription>{projet.titre}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex flex-col gap-2">
                            <p className="text-sm text-muted-foreground">
                              {heuresFaites} h faites / {projet.heures} h
                            </p>
                            {!disponible && (
                              <p className="rounded-md bg-warning/10 px-2 py-1 text-xs text-warning">
                                Conseillé après{" "}
                                {manquants
                                  .map((m) => m.id.toUpperCase())
                                  .join(", ")}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
