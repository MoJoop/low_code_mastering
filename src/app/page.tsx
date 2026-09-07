import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BLOCS = [
  {
    id: "BC01",
    titre: "Participer à la mise en œuvre d'un projet",
    heures: "97 h · 4 projets",
    statut: "En cours" as const,
  },
  {
    id: "BC02",
    titre: "Développer Front-End et Back-End",
    heures: "240 h · 6 projets",
    statut: "À venir" as const,
  },
  {
    id: "BC03",
    titre: "Tester et publier",
    heures: "65 h · 2 projets",
    statut: "À venir" as const,
  },
];

const STATUT_VARIANT: Record<string, "default" | "secondary"> = {
  "En cours": "default",
  "À venir": "secondary",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <section className="rounded-xl border border-border bg-card p-8">
          <p className="text-sm text-muted-foreground">Reprise instantanée</p>
          <h1 className="mt-2 font-heading text-3xl text-foreground">
            Continuez « Modélisez vos bases de données »
          </h1>
          <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            Dernière session il y a 2 jours, 45 min. Projet P3, bloc BC02 —
            il reste 3 livrables à déposer avant la soutenance blanche.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Button variant="cta" size="lg">
              Reprendre l&apos;atelier
            </Button>
            <Button variant="outline" size="lg">
              Voir le parcours
            </Button>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-heading text-xl text-foreground">
            Vue d&apos;ensemble des blocs de compétences
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {BLOCS.map((bloc) => (
              <Card key={bloc.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{bloc.id}</CardTitle>
                    <Badge variant={STATUT_VARIANT[bloc.statut]}>
                      {bloc.statut}
                    </Badge>
                  </div>
                  <CardDescription>{bloc.titre}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {bloc.heures}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
