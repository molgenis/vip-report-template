import { Component } from "solid-js";
import { toggleTheme } from "../utils/theme.ts";

// Same icons as the variant interpreter (lucide moon / sun). Both are rendered; the stylesheet shows
// the one matching html[data-theme]: the moon switches to dark, the sun back to light.
export const ThemeToggle: Component = () => {
  return (
    <a
      class="navbar-item theme-toggle"
      role="button"
      title="Toggle light/dark theme"
      aria-label="Toggle light/dark theme"
      onClick={() => toggleTheme()}
    >
      <svg
        class="theme-toggle-to-dark"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
      <svg
        class="theme-toggle-to-light"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    </a>
  );
};
