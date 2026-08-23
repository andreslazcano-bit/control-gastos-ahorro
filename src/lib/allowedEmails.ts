/**
 * Only these Google accounts may sign in to this app.
 *
 * To add or remove someone: edit this list, then also update the matching
 * list in `firestore.rules` (Firestore doesn't read this file — the rules
 * are the real enforcement boundary, this is just the client-side gate) and
 * paste the updated rules into Firebase Console → Firestore Database →
 * Reglas → Publicar. Then commit + push so the code change deploys too.
 */
export const ALLOWED_EMAILS = ["alazcano94@gmail.com"];

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase();
  return ALLOWED_EMAILS.some((allowed) => allowed.toLowerCase() === normalized);
}
