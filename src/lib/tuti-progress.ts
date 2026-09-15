/**
 * Progreso y calcomanías de TUTI, guardados solo en este dispositivo
 * (localStorage). No hay cuentas ni servidor: si se borran los datos del
 * navegador, el progreso se pierde. Esto se le aclara al adulto en la Zona
 * de Padres, no al niño.
 */

const STICKERS_KEY = "tuti_stickers";

const STICKER_POOL = ["🐢", "🦜", "🦥", "🐸", "🦋", "🐒", "🦀", "🌺", "🌋", "🏄"];

export function getStickers(): string[] {
  try {
    const raw = localStorage.getItem(STICKERS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Agrega una calcomanía nueva al terminar una ronda. Nunca se quitan ni caducan. */
export function addSticker(): string {
  const pool = STICKER_POOL;
  const sticker = pool[Math.floor(Math.random() * pool.length)];
  try {
    const current = getStickers();
    localStorage.setItem(STICKERS_KEY, JSON.stringify([...current, sticker]));
  } catch {
    /* almacenamiento no disponible: seguimos sin bloquear el juego */
  }
  return sticker;
}
