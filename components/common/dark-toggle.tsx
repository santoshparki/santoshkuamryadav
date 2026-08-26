"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function DarkToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;

    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  }

  return (
    <button aria-label="Toggle dark mode" onClick={toggle} className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 p-2 text-zinc-200 shadow-sm transition hover:bg-white/20">
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
