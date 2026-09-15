import { type ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Home, Volume2 } from "lucide-react";
import { addSticker } from "@/lib/tuti-progress";

const ROUND_LENGTH = 5;

/**
 * Marco compartido por los 3 juegos de TUTI: puntitos de progreso, botón de
 * casa siempre visible, botón grande de repetir audio, y la celebración con
 * calcomanía al terminar una ronda de 5 preguntas. Cada juego solo tiene que
 * darle el contenido de la pregunta actual.
 */
export function GameRoundFrame({
  subjectColor,
  round,
  onRepeatAudio,
  onFinishRound,
  children,
}: {
  subjectColor: string;
  round: number; // 0..4, la pregunta actual dentro de la ronda
  onRepeatAudio: () => void;
  onFinishRound: () => void; // se llama cuando el padre decide seguir jugando (nueva ronda)
  children: ReactNode;
}) {
  const [celebrating, setCelebrating] = useState(false);
  const [sticker, setSticker] = useState<string | null>(null);

  // Los juegos llaman a esta función (vía onAdvance más abajo) cuando la
  // ronda de 5 preguntas termina.
  if (round >= ROUND_LENGTH && !celebrating) {
    setCelebrating(true);
    setSticker(addSticker());
  }

  if (celebrating) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <div className="text-7xl">{sticker}</div>
        <h2 className="font-display text-3xl font-bold text-ink">¡Muy bien! 🎉</h2>
        <p className="text-ink-soft">Ganaste una calcomanía nueva.</p>
        <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
          <button
            onClick={() => {
              setCelebrating(false);
              setSticker(null);
              onFinishRound();
            }}
            className="rounded-2xl py-3.5 font-display text-lg font-bold text-white shadow-crayon active:scale-95"
            style={{ background: subjectColor }}
          >
            Seguir jugando
          </button>
          <Link
            to="/hoy"
            className="rounded-2xl bg-muted py-3.5 text-center font-display text-lg font-bold text-ink active:scale-95"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-8 pt-5">
      <div className="mb-5 flex items-center justify-between">
        <Link
          to="/hoy"
          aria-label="Volver al inicio"
          className="touch-target-lg grid place-items-center rounded-full bg-muted text-ink active:scale-95"
        >
          <Home className="size-6" aria-hidden />
        </Link>

        <div className="flex gap-1.5" aria-label={`Pregunta ${Math.min(round + 1, ROUND_LENGTH)} de ${ROUND_LENGTH}`}>
          {Array.from({ length: ROUND_LENGTH }).map((_, i) => (
            <span
              key={i}
              className="h-2.5 w-6 rounded-full transition-colors"
              style={{ background: i <= round ? subjectColor : "var(--color-muted)" }}
            />
          ))}
        </div>

        <button
          onClick={onRepeatAudio}
          aria-label="Repetir audio"
          className="touch-target-lg grid place-items-center rounded-full text-white shadow-soft active:scale-95"
          style={{ background: subjectColor }}
        >
          <Volume2 className="size-6" aria-hidden />
        </button>
      </div>

      {children}
    </div>
  );
}
