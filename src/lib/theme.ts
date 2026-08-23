export type ThemePreference = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "gastos-ahorro:theme";

/**
 * Runs before hydration (see the inline script in layout.tsx) so the first
 * paint already matches the stored preference — avoids a flash of the wrong
 * theme. Keep in sync with that script if this logic changes.
 */
export function applyThemePreference(theme: ThemePreference): void {
  if (typeof document === "undefined") return;
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

export function getStoredThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

export function setStoredThemePreference(theme: ThemePreference): void {
  if (typeof window === "undefined") return;
  if (theme === "system") {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
  } else {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
  applyThemePreference(theme);
}
