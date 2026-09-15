import { Link } from "@tanstack/react-router";
import { Home, Lock } from "lucide-react";

const tabs = [
  { to: "/hoy", label: "Inicio", icon: Home },
  { to: "/padres", label: "Para papás", icon: Lock },
] as const;

/** Tab bar inferior mobile-first. Se oculta en desktop (>=md). */
export function BottomTabs() {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-2">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex touch-target-lg flex-col items-center justify-center gap-1 py-2 text-xs font-medium text-ink-soft"
              activeProps={{ className: "text-primary" }}
            >
              <Icon className="size-6" aria-hidden />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
