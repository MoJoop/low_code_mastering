import { SiteHeader } from "@/components/site-header";
import { ConnexionForm } from "@/components/connexion-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConnexionPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-md px-6 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <ConnexionForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
