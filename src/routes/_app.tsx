import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useChild } from "@/lib/child-context";
import { hasLocalAccess, tryUnlockWithCode } from "@/lib/simple-access";

/**
 * Layout de las pantallas principales (Hoy, Mundos, Juegos, Galería, Padres).
 * Dos guardas, en este orden:
 *   1. Código de acceso guardado en el dispositivo -> si no hay, pantalla de bloqueo
 *   2. Perfil: sin ningún niño -> /onboarding
 * No hay cuentas ni contraseñas: cada dispositivo entra con una sesión
 * anónima de Supabase (solo para guardar perfiles y progreso), y el acceso
 * a la app se controla con un código simple guardado en este mismo celular.
 */
export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const [sessionReady, setSessionReady] = useState(false);
  const [unlocked, setUnlocked] = useState(hasLocalAccess());
  const { children: kids, isLoading: kidsLoading, isFetching: kidsFetching } = useChild();
  const kidsReady = !kidsLoading && !kidsFetching;

  // Sesión anónima automática: solo sirve para guardar perfiles de niños y
  // progreso en la nube, no controla el acceso (eso lo hace el código).
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

  useEffect(() => {
    if (unlocked && sessionReady && kidsReady && kids.length === 0) {
      navigate({ to: "/onboarding" });
    }
  }, [unlocked, sessionReady, kidsReady, kids.length, navigate]);

  if (!unlocked) {
    return <NeedsCode onUnlock={() => setUnlocked(true)} />;
  }

  if (!sessionReady || !kidsReady || kids.length === 0) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="flex flex-col items-center gap-3 text-ink-soft">
          <span className="text-3xl">🎨</span>
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
 * trajo incluido.
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
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-muted text-3xl">🔒</div>
        <h1 className="font-display text-2xl font-bold text-ink">Todavía no tienes acceso</h1>
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
