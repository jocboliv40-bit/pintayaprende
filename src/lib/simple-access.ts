/**
 * Acceso simple por código de regalo, guardado en el dispositivo.
 *
 * Reemplaza la dependencia de una cuenta + suscripción en la base de datos:
 * el dueño del negocio le manda al cliente, por WhatsApp, un link con
 * `?codigo=XXXX` (o el cliente lo escribe a mano). Si coincide con el código
 * vigente, el acceso queda guardado en este mismo celular/navegador para
 * siempre (hasta que borre los datos del sitio).
 *
 * Para cambiar el código (por ejemplo si se filtra), edita ACCESS_CODE aquí
 * y vuelve a publicar.
 */

const STORAGE_KEY = "pya_access_granted";
export const ACCESS_CODE = "SOL2026";

export function hasLocalAccess(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "granted";
  } catch {
    return false;
  }
}

function grantLocalAccess(): void {
  try {
    localStorage.setItem(STORAGE_KEY, "granted");
  } catch {
    /* almacenamiento no disponible (modo privado, etc.): seguimos sin bloquear */
  }
}

/** Revisa si el código en la URL (?codigo=...) es válido y, si sí, desbloquea. */
export function tryUnlockFromUrl(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const codigo = params.get("codigo");
    if (codigo && codigo.trim().toUpperCase() === ACCESS_CODE) {
      grantLocalAccess();
    }
  } catch {
    /* noop */
  }
}

/** Usado por el campo manual "Tengo un código" dentro de la app. */
export function tryUnlockWithCode(input: string): boolean {
  if (input.trim().toUpperCase() === ACCESS_CODE) {
    grantLocalAccess();
    return true;
  }
  return false;
}
