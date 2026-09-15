import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { speak } from "@/lib/speech";
import { ANIMALES_INGLES, type AnimalIngles } from "@/data/tuti-content";
import { GameRoundFrame } from "@/components/tuti/GameRoundFrame";

export const Route = createFileRoute("/_app/ingles")({
  component: InglesGame,
  head: () => ({ meta: [{ title: "Inglés · TUTI" }] }),
});

const SUBJECT_COLOR = "#2563EB"; // azul

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function newRound(): AnimalIngles[] {
  return shuffle(ANIMALES_INGLES).slice(0, 5);
}

function optionsFor(target: AnimalIngles): AnimalIngles[] {
  const distractors = shuffle(ANIMALES_INGLES.filter((a) => a.id !== target.id)).slice(0, 2);
  return shuffle([target, ...distractors]);
}

function InglesGame() {
  const [sequence, setSequence] = useState<AnimalIngles[]>(() => newRound());
  const [round, setRound] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [popId, setPopId] = useState<string | null>(null);

  const target = sequence[round];
  const options = useMemo(() => (target ? optionsFor(target) : []), [target]);

  function playPrompt() {
    if (!target) return;
    speak(target.en, { lang: "en-US", rate: 0.85 });
  }

  useEffect(() => {
    if (target) playPrompt();
    setAttempts(0);
    setWrongId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  function choose(a: AnimalIngles) {
    if (popId) return;
    if (a.id === target.id) {
      setPopId(a.id);
      speak("Very good!", { lang: "en-US", rate: 0.9 });
      setTimeout(() => {
        setPopId(null);
        setRound((r) => r + 1);
      }, 700);
    } else {
      setWrongId(a.id);
      setAttempts((n) => n + 1);
      setTimeout(() => setWrongId(null), 450);
    }
  }

  function startNewRound() {
    setSequence(newRound());
    setRound(0);
  }

  return (
    <GameRoundFrame subjectColor={SUBJECT_COLOR} round={round} onRepeatAudio={playPrompt} onFinishRound={startNewRound}>
      <p className="mb-6 text-center font-display text-xl font-bold text-ink">Escuchá y tocá el animal</p>
      <div className="grid grid-cols-3 gap-4">
        {options.map((a) => (
          <button
            key={a.id}
            onClick={() => choose(a)}
            aria-label={a.es}
            className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-3xl border-4 bg-surface shadow-soft transition-transform active:scale-90 ${
              popId === a.id ? "scale-110 border-secondary bg-secondary/20" : wrongId === a.id ? "border-destructive" : "border-transparent"
            } ${attempts >= 2 && a.id === target?.id ? "animate-pulse ring-4 ring-secondary" : ""}`}
            style={wrongId === a.id ? { animation: "wiggle .4s" } : undefined}
          >
            <span className="text-5xl">{a.emoji}</span>
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
