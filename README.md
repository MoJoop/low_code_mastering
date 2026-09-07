# Low-Code Studio

Plateforme web d'apprentissage en autodidacte qui rejoue le parcours certifiant
« Développeur Low-Code » (RNCP38145, 12 projets, 402 h supervisées) sans mentor,
sans école, sans deadline imposée.

Le cahier des charges complet (stack, design system, modèle de données, périmètre
fonctionnel, critères d'acceptation) est dans [`prompt-plateforme-lowcode.md`](./prompt-plateforme-lowcode.md).

## Stack

Next.js 15 (App Router, TypeScript strict) · Tailwind CSS v4 + shadcn/ui (Radix) ·
MDX · Supabase (Postgres, Auth, Storage) · TanStack Query + zustand · Anthropic API
(mentor IA, côté serveur) · Recharts · Tiptap · Vitest + Playwright.

## Démarrer

```bash
pnpm install
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest run
pnpm build       # next build
pnpm lint        # eslint
```

## Avancement

Livraison par tranches vérifiables (voir section 8 du prompt) :

1. ✅ Squelette Next.js + tokens de design + layout + composants shadcn de base
2. ⬜ Pipeline MDX + les 12 fiches projet + `/parcours` + `/projet/[id]`
3. ⬜ Supabase (schéma, RLS, auth) + progression persistée + reprise instantanée
4. ⬜ Atelier : chrono, notes, livrables, offline
5. ⬜ Mentor IA + soutenance blanche + matrice de compétences
6. ⬜ Journal, révisions espacées, portfolio, export
