import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { speak } from "@/lib/speech";
import { getStickers } from "@/lib/tuti-progress";

export const Route = createFileRoute("/_app/hoy")({
  component: TutiHome,
  head: () => ({
    meta: [
      { title: "TUTI · ¡Aprendé jugando!" },
      { name: "description", content: "TUTI: inglés, matemáticas y español jugando." },
    ],
  }),
});

const MATERIAS = [
  {
    to: "/ingles" as const,
    label: "Inglés",
    emoji: "🦜",
    color: "#2563EB",
    audio: "English! Let's play!",
    lang: "en-US",
  },
  {
    to: "/matematicas" as const,
    label: "Matemáticas",
    emoji: "🐢",
    color: "#059669",
    audio: "¡Matemáticas! Vamos a contar",
    lang: "es-MX",
  },
  {
    to: "/espanol" as const,
    label: "Español",
    emoji: "🦋",
    color: "#F97316",
    audio: "¡Español! Vamos a jugar",
    lang: "es-MX",
  },
];

function TutiHome() {
  const [stickerCount, setStickerCount] = useState(0);

  useEffect(() => {
    setStickerCount(getStickers().length);
  }, []);

  return (
    <div className="mx-auto flex min-h-[85vh] w-full max-w-lg flex-col items-center justify-center px-4 py-8 text-center">
      <div className="mb-2 text-7xl">🐢</div>
      <h1 className="font-display text-4xl font-bold text-primary">TUTI</h1>
      <p className="mb-8 font-display text-lg text-ink-soft">¡Aprendé jugando!</p>

      <div className="grid w-full gap-5">
        {MATERIAS.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            onClick={() => speak(m.audio, { lang: m.lang, rate: 0.9 })}
            className="flex items-center gap-4 rounded-3xl border-4 border-transparent p-5 text-left shadow-crayon transition-transform active:scale-95"
            style={{ background: m.color }}
          >
            <span className="text-5xl">{m.emoji}</span>
            <span className="font-display text-2xl font-bold text-white">{m.label}</span>
          </Link>
        ))}
      </div>

      {stickerCount > 0 && (
        <p className="mt-8 text-sm font-semibold text-ink-soft">
          Calcomanías ganadas: <span className="text-lg">{stickerCount} 🌟</span>
        </p>
      )}
    </div>
  );
}
