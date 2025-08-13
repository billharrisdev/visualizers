"use client";

import { useTheme } from "./theme-provider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary border rounded-md px-3 py-1.5"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
