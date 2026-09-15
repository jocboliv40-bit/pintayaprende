import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchMyRole, isAdminRole } from "@/lib/admin";
import { useTheme, type Theme } from "@/lib/theme-provider";
import { MathGate } from "@/components/MathGate";

export const Route = createFileRoute("/_app/padres/")({
  component: PadresPage,
  head: () => ({
    meta: [
      { title: "Zona de Padres · Pinta y Aprende" },
      { name: "description", content: "Ajustes de la app." },
    ],
  }),
});

function PadresPage() {
  const [unlocked, setUnlocked] = useState(false);
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-8 pt-5">
      {unlocked ? (
        <ParentPanel />
      ) : (
        <MathGate title="Zona de Padres" onPass={() => setUnlocked(true)} />
      )}
    </div>
  );
}

function ParentPanel() {
  const { theme, setTheme } = useTheme();
  const roleQ = useQuery({ queryKey: ["my-role"], queryFn: fetchMyRole, staleTime: 5 * 60 * 1000 });

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-ink">Zona de Padres</h1>
      <p className="mb-6 text-sm text-ink-soft">Aquí puedes ver el estado de tu acceso y cambiar los ajustes.</p>

      {/* Acceso al panel de administración (solo owner/admin) */}
      {isAdminRole(roleQ.data ?? null) && (
        <Link
          to="/admin"
          className="mb-6 flex items-center justify-between rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3"
        >
          <span className="font-display font-bold text-primary">🛡️ Panel de administración</span>
          <span className="text-primary">›</span>
        </Link>
      )}

      {/* Acceso: ya no hay planes ni cuentas, el pago es único y por WhatsApp */}
      <section className="mb-8 rounded-3xl border-2 border-secondary bg-surface p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary/20 text-xl text-secondary">✓</span>
          <div>
            <div className="font-display text-lg font-bold text-ink">Acceso completo desbloqueado</div>
            <p className="text-sm text-ink-soft">Pago único, sin mensualidades. Los 33 mundos están disponibles en este celular.</p>
          </div>
        </div>
      </section>

      {/* Ajustes */}
      <section>
        <h2 className="mb-3 font-display text-xl font-bold text-ink">Ajustes</h2>

        <div className="rounded-3xl border border-border bg-surface p-4 shadow-soft">
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-ink">Tema</p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "light", label: "Claro" },
                  { id: "dark", label: "Oscuro" },
                  { id: "system", label: "Sistema" },
                ] as { id: Theme; label: string }[]
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  aria-pressed={theme === t.id}
                  className={`rounded-2xl py-2.5 font-display text-sm font-bold transition-colors ${
                    theme === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-ink-soft"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
