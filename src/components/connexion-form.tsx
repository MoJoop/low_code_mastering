"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { envoyerCode, verifierCode } from "@/app/connexion/actions";

export function ConnexionForm() {
  const [envoyeState, envoyeAction, envoyePending] = useActionState(envoyerCode, {});
  const [verifState, verifAction, verifPending] = useActionState(verifierCode, {});
  const [email, setEmail] = useState("");

  const etapeCode = envoyeState.envoye === true;

  if (etapeCode) {
    return (
      <form action={verifAction} className="flex flex-col gap-3">
        <input type="hidden" name="email" value={envoyeState.email ?? email} />
        <p className="text-sm text-muted-foreground">
          Un code a été envoyé à {envoyeState.email ?? email}.
        </p>
        <label className="text-sm text-muted-foreground" htmlFor="code">
          Code reçu par e-mail
        </label>
        <input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          autoFocus
          required
          className="h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder="123456"
        />
        {verifState.error && <p className="text-sm text-danger">{verifState.error}</p>}
        <Button type="submit" variant="cta" disabled={verifPending}>
          {verifPending ? "Vérification…" : "Valider"}
        </Button>
      </form>
    );
  }

  return (
    <form action={envoyeAction} className="flex flex-col gap-3">
      <label className="text-sm text-muted-foreground" htmlFor="email">
        Adresse e-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        placeholder="vous@exemple.com"
      />
      {envoyeState.error && <p className="text-sm text-danger">{envoyeState.error}</p>}
      <Button type="submit" variant="cta" disabled={envoyePending}>
        {envoyePending ? "Envoi…" : "Recevoir un code"}
      </Button>
    </form>
  );
}
