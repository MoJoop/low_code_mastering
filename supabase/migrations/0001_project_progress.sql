-- Progression par projet et par utilisateur.
-- Les projets eux-mêmes (p1..p12) vivent dans le contenu Git (content/projets/*.mdx),
-- pas en base : project_id est un simple texte, jamais une clé étrangère.
create type public.project_status as enum ('a_venir', 'en_cours', 'a_valider', 'valide');

create table public.project_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id text not null,
  status public.project_status not null default 'a_venir',
  heures_faites numeric(6, 2) not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, project_id)
);

alter table public.project_progress enable row level security;

create policy "Un utilisateur lit sa propre progression"
  on public.project_progress for select
  using (auth.uid () = user_id);

create policy "Un utilisateur crée sa propre progression"
  on public.project_progress for insert
  with check (auth.uid () = user_id);

create policy "Un utilisateur met à jour sa propre progression"
  on public.project_progress for update
  using (auth.uid () = user_id)
  with check (auth.uid () = user_id);

create function public.set_updated_at () returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger project_progress_set_updated_at
  before update on public.project_progress
  for each row
  execute function public.set_updated_at ();
