import { createFileRoute } from "@tanstack/react-router";

/**
 * Acceso / pago (Zona de Padres — nunca lo ve el niño).
 * Modelo: UN SOLO PAGO de ₡5000 por SINPE Móvil (Costa Rica).
 * No hay suscripción, ni renovaciones, ni pasarela: el pago se hace
 * persona a persona y la cuenta se activa manualmente desde /admin.
 */
const SINPE = {
  price: "₡5000",
  phone: "63336652",
  holder: "Jose Bolivar",
};

export const Route = createFileRoute("/_app/padres/planes")({
  component: PlanesPage,
  head: () => ({
    meta: [
      { title: "Acceso · Pinta y Aprende" },
      {
        name: "description",
        content: "Un solo pago de ₡5000 por SINPE Móvil. Sin mensualidades.",
      },
    ],
  }),
});

const FEATURES = [
  "Los 33 mundos completos (630+ láminas)",
  "Cada palabra con audio en inglés y español",
  "Los juegos de vocabulario",
  "Galería con todas sus obras",
  "Hasta 4 perfiles de niño",
  "Panel de progreso para papás",
];

function PlanesPage() {
  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="font-display text-3xl font-bold text-ink">Acceso</h1>
      <p className="mt-2 text-ink-soft">
        Un solo pago. Sin mensualidades ni renovaciones automáticas.
      </p>

      <div className="mt-6 rounded-3xl border-2 border-primary bg-surface p-6 shadow-soft">
        <span className="inline-block rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold text-primary-foreground">
          Pago único
        </span>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-display text-5xl font-bold text-ink">{SINPE.price}</span>
          <span className="pb-2 text-sm text-ink-soft">una sola vez</span>
        </div>

        <ul className="mt-5 space-y-1.5 text-sm text-ink">
          {FEATURES.map((f) => (
            <li key={f} className="flex gap-2">
              <span className="text-secondary">✓</span> {f}
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl bg-muted p-5">
          <div className="font-display text-lg font-bold text-ink">Cómo pagar por SINPE Móvil</div>
          <ol className="mt-3 space-y-3 text-sm text-ink">
            <li className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </span>
              <span>
                Envía <strong>{SINPE.price}</strong> por SINPE Móvil al número{" "}
                <strong className="whitespace-nowrap">{SINPE.phone}</strong> ({SINPE.holder}).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </span>
              <span>
                En el <strong>detalle</strong> de la transferencia escribe el{" "}
                <strong>nombre de tu hijo o hija</strong>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                3
              </span>
              <span>Activamos la cuenta y te avisamos.</span>
            </li>
          </ol>
        </div>

        <a
          href={`sms:${SINPE.phone}`}
          className="mt-5 block w-full rounded-2xl bg-primary py-3.5 text-center font-display font-bold text-primary-foreground shadow-crayon active:scale-95"
        >
          Pagar por SINPE al {SINPE.phone}
        </a>
      </div>
    </div>
  );
}
