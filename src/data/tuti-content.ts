/**
 * Contenido educativo de TUTI, separado de los componentes de juego para
 * poder agregar más preguntas, letras, animales o frutas sin tocar la
 * lógica de las pantallas.
 *
 * NOTA: las imágenes son emojis como reemplazo funcional mientras se
 * encargan las ilustraciones reales de Tuti (la tortuguita) y sus amigos
 * en estilo 3D. Cuando existan los archivos definitivos, solo hay que
 * cambiar el campo `emoji` por la ruta del PNG/SVG.
 */

export type Letra = { id: string; letra: string; audioLetra: string };

/** Español · "Burbujas de letras": vocales primero, luego consonantes simples. */
export const LETRAS: Letra[] = [
  { id: "a", letra: "A", audioLetra: "a" },
  { id: "e", letra: "E", audioLetra: "e" },
  { id: "i", letra: "I", audioLetra: "i" },
  { id: "o", letra: "O", audioLetra: "o" },
  { id: "u", letra: "U", audioLetra: "u" },
  { id: "m", letra: "M", audioLetra: "eme" },
  { id: "s", letra: "S", audioLetra: "ese" },
  { id: "p", letra: "P", audioLetra: "pe" },
  { id: "l", letra: "L", audioLetra: "ele" },
  { id: "t", letra: "T", audioLetra: "te" },
];

export type AnimalIngles = { id: string; en: string; es: string; emoji: string };

/** Inglés · "La selva que habla": fauna de Costa Rica. */
export const ANIMALES_INGLES: AnimalIngles[] = [
  { id: "turtle", en: "turtle", es: "tortuga", emoji: "🐢" },
  { id: "toucan", en: "toucan", es: "tucán", emoji: "🦜" },
  { id: "sloth", en: "sloth", es: "perezoso", emoji: "🦥" },
  { id: "frog", en: "frog", es: "ranita", emoji: "🐸" },
  { id: "butterfly", en: "butterfly", es: "mariposa", emoji: "🦋" },
  { id: "monkey", en: "monkey", es: "mono", emoji: "🐒" },
  { id: "macaw", en: "macaw", es: "lapa", emoji: "🦜" },
  { id: "crab", en: "crab", es: "cangrejo", emoji: "🦀" },
];

/** Matemáticas · "Tortuguitas al mar": cuántas tortugas hay en cada ronda. */
export const CANTIDADES_TORTUGAS: number[] = [2, 3, 4, 3, 5, 2, 4, 6, 3, 5];

/** Para que la voz diga "uno, dos, tres…" al contar cada tortuga. */
export const NUMERO_EN_PALABRAS: Record<number, string> = {
  1: "uno",
  2: "dos",
  3: "tres",
  4: "cuatro",
  5: "cinco",
  6: "seis",
  7: "siete",
};
