"use client";

import { useActionState } from "react";
import { Loader2, AlertCircle, LogIn } from "lucide-react";
import { loginAction, type LoginState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="personal@aurora.com"
          autoComplete="email"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      {state.error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Ingresando…
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" /> Ingresar
          </>
        )}
      </Button>
    </form>
  );
}
