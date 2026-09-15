import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { hasLocalAccess, tryUnlockWithCode } from "@/lib/simple-access";

/**
 * Layout de las pantallas principales de TUTI (Inicio, Inglés, Matemáticas,
 * Español, Padres). Una sola guarda: código de acceso guardado en el
 * dispositivo -> si no hay, pantalla de bloqueo.
 *
 * Sin cuentas, sin contraseñas y SIN perfil de niño obligatorio: el niño
 * debe poder tocar y jugar de inmediato. Cada dispositivo usa una sesión
 * anónima de Supabase solo por si en el futuro se guarda progreso en la
 * nube; hoy el progreso (calcomanías) vive en localStorage.
 */
export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const [sessionReady, setSessionReady] = useState(false);
  const [unlocked, setUnlocked] = useState(hasLocalAccess());

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      if (!data.session) {
        await supabase.auth.signInAnonymously();
      }
      if (active) setSessionReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!unlocked) {
    return <NeedsCode onUnlock={() => setUnlocked(true)} />;
  }

  if (!sessionReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="flex flex-col items-center gap-3 text-ink-soft">
          <span className="text-3xl">🐢</span>
          <span className="animate-pulse text-sm">Un momento…</span>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

/**
 * Pantalla que ve cualquiera que abra la app sin haber pagado (o sin el
 * código todavía). Deja escribir el código a mano, por si el link no lo
 * trajo incluido. Este texto es solo para el adulto: el niño nunca debería
 * ver esta pantalla si el papá ya abrió la app con el link correcto.
 */
function NeedsCode({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (tryUnlockWithCode(code)) {
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 safe-top safe-bottom">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-crayon">
        <img
          src="/icon-tuti-512.png"
          alt="Tuti"
          className="mx-auto mb-4 size-20 rounded-full border-4 border-secondary object-cover shadow-soft"
        />
        <h1 className="font-display text-2xl font-bold text-ink">Todavía no tienes acceso a TUTI</h1>
        <p className="mt-2 text-ink-soft">
          Compra por SINPE y te mandamos por WhatsApp un código para desbloquear la app en este
          celular.
        </p>

        <a
          href="/#planes"
          className="mt-6 block w-full rounded-2xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-crayon transition active:scale-[.99]"
        >
          Ver cómo comprar
        </a>

        <form onSubmit={handleSubmit} className="mt-5 text-left">
          <label className="mb-1.5 block text-sm font-semibold text-ink-soft">
            ¿Ya tienes un código? Escríbelo aquí
          </label>
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            placeholder="Código"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-center font-display text-lg tracking-widest text-ink"
          />
          {error && <p className="mt-2 text-sm font-semibold text-destructive">Ese código no es válido.</p>}
          <button
            type="submit"
            className="mt-3 w-full rounded-2xl bg-muted py-3 text-sm font-semibold text-ink transition active:scale-[.99]"
          >
            Desbloquear
          </button>
        </form>
      </div>
    </div>
  );
}
