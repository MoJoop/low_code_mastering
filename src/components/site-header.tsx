const NAV_ITEMS = ["Parcours", "Compétences", "Journal", "Portfolio"];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <span className="font-heading text-lg italic text-foreground">
          Low-Code Studio
        </span>
        <nav aria-label="Navigation principale">
          <ul className="flex items-center gap-6 text-sm text-muted-foreground">
            {NAV_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
