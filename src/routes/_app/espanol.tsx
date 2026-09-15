import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { speak } from "@/lib/speech";
import { LETRAS, type Letra } from "@/data/tuti-content";
import { GameRoundFrame } from "@/components/tuti/GameRoundFrame";

export const Route = createFileRoute("/_app/espanol")({
  component: EspanolGame,
  head: () => ({ meta: [{ title: "Español · TUTI" }] }),
});

const SUBJECT_COLOR = "#F97316"; // naranja, para diferenciarlo de inglés/matemáticas

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function newRound(): Letra[] {
  return shuffle(LETRAS).slice(0, 5);
}

function optionsFor(target: Letra): Letra[] {
  const distractors = shuffle(LETRAS.filter((l) => l.id !== target.id)).slice(0, 2);
  return shuffle([target, ...distractors]);
}

function EspanolGame() {
  const [sequence, setSequence] = useState<Letra[]>(() => newRound());
  const [round, setRound] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [popId, setPopId] = useState<string | null>(null);

  const target = sequence[round];
  const options = useMemo(() => (target ? optionsFor(target) : []), [target]);

  function playPrompt() {
    if (!target) return;
    speak(`Tocá la letra ${target.audioLetra}`, { lang: "es-MX", rate: 0.9 });
  }

  useEffect(() => {
    if (target) playPrompt();
    setAttempts(0);
    setWrongId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  function choose(l: Letra) {
    if (popId) return; // ya está resolviendo esta pregunta
    if (l.id === target.id) {
      setPopId(l.id);
      speak("¡Muy bien!", { lang: "es-MX", rate: 0.95 });
      setTimeout(() => {
        setPopId(null);
        setRound((r) => r + 1);
      }, 700);
    } else {
      setWrongId(l.id);
      setAttempts((a) => a + 1);
      setTimeout(() => setWrongId(null), 450);
    }
  }

  function startNewRound() {
    setSequence(newRound());
    setRound(0);
  }

  return (
    <GameRoundFrame subjectColor={SUBJECT_COLOR} round={round} onRepeatAudio={playPrompt} onFinishRound={startNewRound}>
      <p className="mb-6 text-center font-display text-xl font-bold text-ink">¿Cuál es esta letra?</p>
      <div className="grid grid-cols-3 gap-4">
        {options.map((l) => (
          <button
            key={l.id}
            onClick={() => choose(l)}
            aria-label={`Letra ${l.letra}`}
            className={`aspect-square rounded-full border-4 bg-surface font-display text-5xl font-bold text-ink shadow-soft transition-transform active:scale-90 ${
              popId === l.id ? "scale-110 border-secondary bg-secondary/20" : wrongId === l.id ? "border-destructive" : "border-transparent"
            } ${attempts >= 2 && l.id === target?.id ? "animate-pulse ring-4 ring-secondary" : ""}`}
            style={wrongId === l.id ? { animation: "wiggle .4s" } : undefined}
          >
            {l.letra}
          </button>
        ))}
      </div>
      {attempts >= 1 && (
        <p className="mt-5 text-center text-sm font-semibold text-ink-soft">
          Pista: tocá el botón del sonido 🔊 para escucharla de nuevo.
        </p>
      )}
    </GameRoundFrame>
  );
}
