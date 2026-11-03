export type Theme = "light" | "dark";

const STORAGE_KEY = "vip-report-theme";

function storedTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getTheme(): Theme {
  return (document.documentElement.dataset["theme"] as Theme | undefined) ?? storedTheme() ?? systemTheme();
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset["theme"] = theme;
}

/** Apply the stored or system theme and follow system changes until the user picks one. */
export function initTheme() {
  applyTheme(storedTheme() ?? systemTheme());
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    if (storedTheme() === null) applyTheme(event.matches ? "dark" : "light");
  });
}

export function toggleTheme() {
  const next: Theme = getTheme() === "dark" ? "light" : "dark";
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // storage can be unavailable for reports opened from disk; the toggle still works for this page
  }
  applyTheme(next);
}
