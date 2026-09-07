import Link from "next/link";

const NAV_ITEMS = [
  { label: "Parcours", href: "/parcours" },
  { label: "Compétences", href: null },
  { label: "Journal", href: null },
  { label: "Portfolio", href: null },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-heading text-lg italic text-foreground">
          Low-Code Studio
        </Link>
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
      </div>
    </header>
  );
}
