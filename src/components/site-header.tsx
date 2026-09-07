import Link from "next/link";
import { seDeconnecter } from "@/app/connexion/actions";
import { createClient } from "@/lib/supabase/server";

const NAV_ITEMS = [
  { label: "Parcours", href: "/parcours" },
  { label: "Compétences", href: null },
  { label: "Journal", href: null },
  { label: "Portfolio", href: null },
];

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-heading text-lg italic text-foreground">
          Low-Code Studio
        </Link>
        <div className="flex items-center gap-6">
          <nav aria-label="Navigation principale">
            <ul className="flex items-center gap-6 text-sm">
              {NAV_ITEMS.map((item) =>
                item.href ? (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.label} className="text-muted-foreground/50">
                    {item.label}
                  </li>
                )
              )}
            </ul>
          </nav>
          {user ? (
            <form action={seDeconnecter} className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">{user.email}</span>
              <button type="submit" className="text-primary hover:underline">
                Se déconnecter
              </button>
            </form>
          ) : (
            <Link href="/connexion" className="text-sm text-primary hover:underline">
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
