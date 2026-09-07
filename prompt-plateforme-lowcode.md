# Prompt — Plateforme d'apprentissage autodidacte « Low-Code Studio »

> À coller dans Claude Code (ou tout agent de build). Le bloc est autoportant :
> stack, design system, modèle de données, périmètre fonctionnel et critères d'acceptation.

---

## 0. Rôle

Tu es ingénieur produit full-stack senior. Tu construis **Low-Code Studio**, une plateforme
web d'apprentissage en autodidacte qui rejoue le parcours certifiant « Développeur Low-Code »
(RNCP38145, 12 projets, 402 h supervisées) **sans mentor, sans école, sans deadline imposée**.

La plateforme n'est pas un lecteur de cours. C'est un **atelier de progression** : elle
séquence les projets, garde la trace du travail réel, fait passer les preuves de compétence,
et remplace le mentor hebdomadaire par un mentor IA + des rituels d'auto-évaluation.

Livre par tranches vérifiables. Après chaque tranche, montre l'écran obtenu et attends validation
avant de continuer.

---

## 1. Utilisateur cible (unique, assumé)

- Un apprenant adulte, déjà professionnel de la donnée (statistiques, SQL, Python/R),
  qui veut acquérir la compétence produit : concevoir, construire et livrer une web app.
- Travaille **le soir et le week-end**, par sessions de 45 à 120 min, très irrégulières.
- Connexion internet parfois instable (Dakar) → l'app doit rester utilisable en mode dégradé.
- Interface **100 % française**. Contenus techniques en anglais tolérés et signalés.

Conséquences de design non négociables :
1. Toute session doit pouvoir démarrer en **moins de 10 secondes** : un écran « Reprendre » qui
   pointe exactement là où il s'est arrêté.
2. Aucune notion de retard, de streak cassé, de badge perdu. La pression vient des livrables,
   pas de la gamification.
3. Rien ne se perd si l'onglet se ferme : sauvegarde optimiste locale + synchro.

---

## 2. Stack imposée

| Couche | Choix | Raison |
|---|---|---|
| Framework | **Next.js 15** (App Router, Server Components, TypeScript strict) | rendu rapide, routing par fichiers, déploiement trivial |
| UI | **Tailwind CSS v4** + **shadcn/ui** (Radix) | composants accessibles, style pilotable par tokens |
| Contenu | **MDX** versionné dans `/content` + `contentlayer`-like (ou `next-mdx-remote`) | le programme est du contenu, pas de la donnée : il vit dans Git |
| Données | **Supabase** (Postgres + Auth email/OTP + Storage) | progression, notes, livrables, fichiers |
| État client | **TanStack Query** + `zustand` pour l'état d'atelier | cache offline-first |
| Mentor IA | **Anthropic API** via route handler serveur (jamais de clé côté client) | revue de livrables, quiz, soutenance blanche |
| Graphiques | **Recharts** | courbes d'heures et de compétences |
| Éditeur | **Tiptap** (journal, cahier de recette, user stories) | markdown WYSIWYG léger |
| Tests | **Vitest** + **Playwright** (3 parcours critiques) | non négociable sur la progression |
| Déploiement | **Vercel**, CI GitHub Actions (lint + typecheck + tests) | |

Interdits : aucune dépendance UI lourde (MUI, Chakra, Ant), aucun state manager global
supplémentaire, aucun appel LLM depuis le navigateur, aucune image > 200 Ko.

---

## 3. Design system — « Atelier chaleureux »

Inspiration : **Anthropic Academy** (claude.ai/learning) — fond ivoire, typographie éditoriale,
respiration généreuse, zéro bruit visuel, cartes discrètes qui ne crient pas.
Dosage : on garde la chaleur et le calme d'Anthropic, on remplace l'accent corail par un
**vert-canard technique** (héritage de la charte du parcours) et on garde l'argile en accent
secondaire pour la progression et les CTA. Résultat : chaleureux mais crédible pour un outil de dev.

### Tokens

```css
/* Fond & texte */
--bg:            #FAF9F5;  /* ivoire, fond global */
--bg-raised:     #FFFFFF;  /* cartes */
--bg-sunken:     #F0EEE6;  /* zones d'atelier, code, encarts */
--ink:           #1F1E1D;  /* texte principal */
--ink-muted:     #6B6862;  /* secondaire */
--line:          #E4E1D8;  /* filets, 1px, jamais d'ombre portée marquée */

/* Accents */
--primary:       #0E6E68;  /* vert-canard : navigation active, liens, focus */
--primary-soft:  #DCEAE7;  /* fonds d'état, badges */
--accent:        #D97757;  /* argile : CTA principal, barres de progression */
--accent-soft:   #F6E5DD;

/* Sémantique */
--success:       #4A7C59;
--warning:       #B4762A;
--danger:        #A5453B;
```

Mode sombre : inversion sur `#1A1917` / `#262421`, accents inchangés, contraste AA minimum.

### Typographie

- Titres : **Fraunces** ou **Instrument Serif** (display, `font-optical-sizing: auto`), poids 400–500.
  Jamais de serif sous 20 px.
- Corps & UI : **Inter** ou **Geist Sans**, 16 px de base, interlignage 1.65, largeur de lecture
  **68 caractères max**.
- Code : **JetBrains Mono**, 14 px, fond `--bg-sunken`, pas de bordure.
- Échelle : 48 / 32 / 24 / 20 / 16 / 14 / 12.

### Règles visuelles

- Rayon : 12 px cartes, 8 px champs, 999 px pills. Bordure 1 px `--line`, **jamais** d'ombre
  au repos ; une ombre très douce uniquement au survol des cartes cliquables.
- Espacement sur grille de 4 ; respiration verticale de 96 px entre sections de page.
- Une seule couleur d'accent visible par écran. Si la barre de progression est argile,
  le CTA de la même vue est neutre.
- Illustrations : aucune. Des **diagrammes SVG** monochromes `--ink` sur `--bg-sunken`.
- Mouvement : 150–200 ms, `ease-out`, uniquement opacité et translation de 4 px.
  Respect de `prefers-reduced-motion`.
- Accessibilité : focus ring visible `--primary` à 2 px, navigation clavier complète,
  contrastes AA, aucune information portée par la seule couleur.

---

## 4. Modèle du programme (à ingérer tel quel)

3 blocs de compétences, 12 projets, 402 h.

**BC01 — Participer à la mise en œuvre d'un projet** : P1 (12 h), P7 (20 h), P11 (40 h), P12 (25 h)
**BC02 — Développer Front-End et Back-End** : P2 (40 h), P3 (45 h), P5 (30 h), P6 (25 h), P8 (40 h), P10 (60 h)
**BC03 — Tester et publier** : P4 (25 h), P9 (40 h)

Chaque projet MDX porte le frontmatter suivant :

```yaml
id: p3
ordre: 3
titre: "Mettez en place les bases du Back-End et développez le Front-End dynamique"
bloc: BC02
heures: 45
resume: "…"
competences:
  - "Concevoir un modèle de données"
  - "Développer des interactions à l'aide d'outils low-code"
prerequis: [p2]
outils: [xano, weweb]
cours: [{ titre: "Modélisez vos bases de données", duree: 8, niveau: "moyenne" }]
livrables:
  - { id: mcd, type: fichier, titre: "Modèle conceptuel de données", format: [png, pdf] }
  - { id: demo, type: url, titre: "Lien de l'app déployée" }
soutenance:
  duree: 30
  attendus: ["Justifier les cardinalités", "Expliquer un appel API de bout en bout"]
```

Le parcours est **séquencé mais non verrouillé** : un projet non débloqué est accessible avec
un bandeau d'avertissement, jamais une porte fermée.

---

## 5. Architecture des routes

```
/                        Accueil — reprendre + vue d'ensemble des 3 blocs
/parcours                Carte du parcours : 12 projets, état, heures, dépendances
/projet/[id]             Page projet : brief, compétences, ressources, checklist
/projet/[id]/atelier     Espace de travail : notes, livrables, chrono, mentor IA
/projet/[id]/soutenance  Soutenance blanche évaluée par l'IA + grille RNCP
/competences             Matrice compétences × preuves (le vrai tableau de bord)
/journal                 Journal d'apprentissage, filtrable, exportable
/revisions               Rappel espacé sur les notions passées
/portfolio               Assemblage public des livrables validés (P12)
/parametres              Objectif hebdo, thème, export/import des données
```

---

## 6. Périmètre fonctionnel

### P0 — sans ça, la plateforme n'existe pas

1. **Carte du parcours** : 12 projets, état (à venir / en cours / à valider / validé),
   heures faites vs prévues, groupés par bloc.
2. **Page projet** : brief, compétences cibles, cours associés, checklist de livrables.
3. **Atelier** : chronomètre de session rattaché au projet, éditeur de notes Tiptap
   (autosave 2 s, local d'abord), dépôt de livrables (fichier Supabase Storage ou URL).
4. **Reprise instantanée** : l'accueil ouvre sur la dernière session, un seul bouton.
5. **Persistance offline** : IndexedDB, file de synchro, indicateur d'état discret.

### P1 — ce qui remplace le mentor

6. **Mentor IA contextuel** (Anthropic API, route serveur) : reçoit le brief du projet,
   les livrables et les notes ; renvoie une **revue critique structurée** —
   ce qui est acquis / ce qui manque / la prochaine action concrète.
   Ton exigeant et bienveillant, jamais complaisant. Il ne fait pas le travail à la place.
7. **Soutenance blanche** : 5–8 questions générées depuis `soutenance.attendus`,
   réponse écrite ou dictée, notation sur la grille du bloc, verdict + axes de reprise.
   Un projet passe « validé » uniquement après soutenance réussie.
8. **Matrice de compétences** : chaque compétence du RNCP reliée aux preuves déposées.
   C'est l'écran qui répond à « suis-je employable ? », pas la barre d'avancement.
9. **Rappel espacé** : les notions clés issues des notes reviennent à J+1, J+7, J+30
   sous forme de cartes questions/réponses.

### P2 — confort

10. **Journal** horodaté, tags par projet, export Markdown.
11. **Rythme** : objectif d'heures hebdomadaire choisi par l'utilisateur, courbe Recharts
    réel vs objectif, projection de date de fin. Aucune alerte culpabilisante.
12. **Portfolio public** généré depuis les livrables validés, page statique partageable.
13. **Export / import** complet des données en JSON (souveraineté des données).

---

## 7. Contraintes techniques

- **Budget performance** : LCP < 2,5 s en 3G simulée, JS initial < 150 Ko gzip.
  Server Components par défaut, `"use client"` uniquement sur atelier, éditeur, chrono.
- **Offline-first** : lecture des projets et écriture des notes fonctionnelles hors ligne.
- **Sécurité** : RLS Supabase sur toutes les tables, clé Anthropic uniquement en variable
  d'environnement serveur, rate limiting sur les routes IA.
- **Contenu = Git** : ajouter un projet ne doit demander qu'un fichier MDX, aucun code.
- **i18n** : tous les libellés dans `messages/fr.json`, aucune chaîne codée en dur.

---

## 8. Ordre de livraison

1. Squelette Next.js + tokens de design + layout + 3 composants shadcn stylés.
2. Pipeline MDX + les 12 fiches projet + `/parcours` + `/projet/[id]`.
3. Supabase (schéma, RLS, auth) + progression persistée + `/` avec reprise.
4. Atelier : chrono, notes, livrables, offline.
5. Mentor IA + soutenance + matrice de compétences.
6. Journal, révisions, portfolio, export.

À chaque étape : `pnpm typecheck && pnpm test && pnpm build` doit passer.

---

## 9. Critères d'acceptation

- Depuis l'accueil, reprendre un projet en cours prend **un clic**.
- Écrire 500 caractères de notes hors connexion, fermer l'onglet, revenir : rien n'est perdu.
- Un projet ne peut pas passer « validé » sans livrable déposé **et** soutenance réussie.
- La matrice de compétences affiche, pour chaque compétence RNCP, au moins un lien vers une preuve.
- Aucune page ne dépasse une couleur d'accent visible.
- Lighthouse mobile ≥ 90 en performance et 100 en accessibilité sur `/` et `/parcours`.

---

## 10. À ne pas faire

- Pas de points, badges, classements, streaks, confettis.
- Pas de notifications ni d'e-mails de relance.
- Pas de chatbot flottant : le mentor IA vit dans l'atelier, à sa place.
- Pas de vidéo hébergée : uniquement des liens vers les ressources d'origine.
- Pas de « dashboard » saturé de KPI. Deux chiffres suffisent : heures faites, compétences prouvées.
