import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { speak } from "@/lib/speech";
import { CANTIDADES_TORTUGAS, NUMERO_EN_PALABRAS } from "@/data/tuti-content";
import { GameRoundFrame } from "@/components/tuti/GameRoundFrame";

export const Route = createFileRoute("/_app/matematicas")({
  component: MatematicasGame,
  head: () => ({ meta: [{ title: "Matemáticas · TUTI" }] }),
});

const SUBJECT_COLOR = "#059669"; // verde, como el mar/bosque

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function newRound(): number[] {
  return shuffle(CANTIDADES_TORTUGAS).slice(0, 5);
}

function numberOptions(total: number): number[] {
  const candidates = new Set<number>([total]);
  if (total > 1) candidates.add(total - 1);
  candidates.add(total + 1);
  while (candidates.size < 3) candidates.add(total + candidates.size + 1);
  return shuffle(Array.from(candidates));
}

function MatematicasGame() {
  const [sequence, setSequence] = useState<number[]>(() => newRound());
  const [round, setRound] = useState(0);
  const total = sequence[round];

  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const [wrongNum, setWrongNum] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);

  const options = useMemo(() => (total ? numberOptions(total) : []), [total]);
  const allTapped = total ? tapped.size >= total : false;

  function playPrompt() {
    speak("Tocá cada tortuguita para contarla", { lang: "es-MX", rate: 0.9 });
  }

  useEffect(() => {
    setTapped(new Set());
    setAttempts(0);
    setSolved(false);
    if (total) playPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  function tapTurtle(i: number) {
    if (tapped.has(i) || solved) return;
    const next = new Set(tapped);
    next.add(i);
    setTapped(next);
    speak(NUMERO_EN_PALABRAS[next.size] ?? String(next.size), { lang: "es-MX", rate: 1 });
  }

  function chooseNumber(n: number) {
    if (solved) return;
    if (n === total) {
      setSolved(true);
      speak("¡Muy bien! Las tortuguitas llegaron al mar", { lang: "es-MX", rate: 0.95 });
      setTimeout(() => setRound((r) => r + 1), 1100);
    } else {
      setWrongNum(n);
      setAttempts((a) => a + 1);
      setTimeout(() => setWrongNum(null), 450);
    }
  }

  function startNewRound() {
    setSequence(newRound());
    setRound(0);
  }

  return (
    <GameRoundFrame subjectColor={SUBJECT_COLOR} round={round} onRepeatAudio={playPrompt} onFinishRound={startNewRound}>
      <p className="mb-4 text-center font-display text-xl font-bold text-ink">
        {allTapped ? "¿Cuántas tortuguitas contaste?" : "Tocá cada tortuguita"}
      </p>

      <div className="mb-6 flex flex-wrap items-end justify-center gap-3 rounded-3xl bg-surface p-5 shadow-soft">
        {Array.from({ length: total ?? 0 }).map((_, i) => (
          <button
            key={i}
            onClick={() => tapTurtle(i)}
            aria-label={`Tortuga ${i + 1}`}
            className={`grid size-14 place-items-center rounded-full text-4xl transition-all duration-500 active:scale-90 ${
              tapped.has(i) ? "translate-y-2 opacity-40" : ""
            }`}
          >
            🐢
          </button>
        ))}
      </div>

      {allTapped && (
        <div className="grid grid-cols-3 gap-4">
          {options.map((n) => (
            <button
              key={n}
              onClick={() => chooseNumber(n)}
              className={`aspect-square rounded-full border-4 bg-surface font-display text-4xl font-bold text-ink shadow-soft transition-transform active:scale-90 ${
                solved && n === total ? "scale-110 border-secondary bg-secondary/20" : wrongNum === n ? "border-destructive" : "border-transparent"
              }`}
              style={wrongNum === n ? { animation: "wiggle .4s" } : undefined}
            >
              {n}
            </button>
          ))}
        </div>
      )}
      {attempts >= 1 && (
        <p className="mt-5 text-center text-sm font-semibold text-ink-soft">
          Pista: tocá el botón del sonido 🔊 y volvé a contar las tortuguitas.
        </p>
      )}
    </GameRoundFrame>
  );
}
