import { Component } from "solid-js";
import { toggleTheme } from "../utils/theme.ts";

// Both icons are rendered; the stylesheet shows the one matching html[data-theme].
export const ThemeToggle: Component = () => {
  return (
    <a
      class="navbar-item theme-toggle"
      role="button"
      title="Toggle light/dark theme"
      aria-label="Toggle light/dark theme"
      onClick={() => toggleTheme()}
    >
      <span class="icon theme-toggle-to-dark">
        <i class="fas fa-moon" />
      </span>
      <span class="icon theme-toggle-to-light">
        <i class="fas fa-sun" />
      </span>
    </a>
  );
};
