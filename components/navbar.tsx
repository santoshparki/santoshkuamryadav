"use client";
import Link from "next/link";
import DarkToggle from "./common/dark-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const links = [
  ["Home", "#"],
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Experience", "#experience"],
  ["Education", "#education"],
  ["Certificates", "#certificates"],
  ["Services", "#services"],
  ["Contact", "#contact"],
] as const;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("#");
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const prevActiveEl = useRef<HTMLElement | null>(null);

  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });

  // scroll shadow/background
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // body scroll lock
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mobileOpen) {
      prevActiveEl.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      if (prevActiveEl.current) prevActiveEl.current.focus();
    }
  }, [mobileOpen]);

  // Keep the active link aligned to the section currently below the fixed header.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ids = links.map((l) => (l[1] as string).replace(/^#/, "")).filter(Boolean);
    function updateActiveSection() {
      const headerOffset = 120;
      const currentId = ids.reduce<string | null>((active, id) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= headerOffset) return id;
        return active;
      }, null);
      const nextActiveId = currentId ? `#${currentId}` : "#";
      setActiveId(nextActiveId);
      if (currentId && window.location.hash !== nextActiveId) {
        window.history.replaceState(null, "", nextActiveId);
      }
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  // keyboard: Escape closes mobile
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // indicator position update
  useEffect(() => {
    function update() {
      const el = linkRefs.current[activeId];
      const nav = navRef.current;
      if (!el || !nav) {
        setIndicator({ left: 0, width: 0, visible: false });
        return;
      }
      const navRect = nav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setIndicator({ left: elRect.left - navRect.left, width: elRect.width, visible: true });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeId]);

  function handleNavClick(href: string) {
    setMobileOpen(false);
    if (typeof window === "undefined") return;
    if (href === "#" || href === "") {
      setActiveId("#");
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }
    const id = href.replace(/^#/, "");
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 120;
      const targetTop = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      setActiveId(href);
      window.history.replaceState(null, "", href);
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    }
  }

  // focus trap inside mobile menu
  useEffect(() => {
    if (!mobileOpen) return;
    const root = menuRef.current;
    if (!root) return;
    const focusable = Array.from(root.querySelectorAll<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])")).filter((el) => !el.hasAttribute('disabled'));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className={`fixed top-4 left-1/2 z-[1000] w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2 rounded-2xl px-4 py-3 backdrop-blur-2xl transition-shadow ${scrolled ? 'shadow-[0_20px_70px_rgba(0,0,0,.36)] bg-[#07111f]/82 border border-cyan-100/15' : 'bg-[#07111f]/55 border border-white/10'}`}
        style={{ willChange: 'transform, opacity' }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#0D2133] p-2 shadow-[0_12px_40px_rgba(3,22,48,0.4)] ring-1 ring-[#18E3E3]/15">
                <span className="font-bold text-sm text-[#18E3E3]">SY</span>
              </div>
              <div className="hidden flex-col leading-none sm:flex">
                <span className="text-sm font-semibold text-[#F8FAFC]">Santosh Kumar Yadav</span>
                <span className="mt-1 h-px w-12 bg-gradient-to-r from-cyan-300 to-transparent" />
              </div>
            </Link>
          </div>

          <div ref={navRef} className="relative hidden items-center gap-6 sm:flex">
            <nav className="flex items-center gap-6" aria-label="Primary">
              {links.map(([label, href]) => (
                <button
                  key={label}
                  ref={(el) => { linkRefs.current[href] = el; }}
                  onClick={() => handleNavClick(href)}
                  className={`relative text-sm px-1 py-1 transition-colors duration-200 ${activeId === href ? 'text-[#F8FAFC] font-semibold' : 'text-[#94A3B8] hover:text-[#E0F7F7]'}`}
                  aria-current={activeId === href ? 'page' : undefined}
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* animated underline */}
            <div className="absolute left-0 right-0 bottom-0 h-0 pointer-events-none">
              <AnimatePresence>
                {indicator.visible && (
                  <motion.span
                    key={indicator.left}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transform: `translateX(${indicator.left}px)` }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{
                      width: `${indicator.width}px`,
                      transform: `translateX(${indicator.left}px)`,
                    }}
                    className="absolute bottom-0 h-0.5 rounded-full bg-emerald-400"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a href="/resume.pdf" target="_blank" rel="noreferrer" className="hidden rounded-full bg-gradient-to-r from-[#18E3E3] to-[#3B82F6] px-4 py-2 text-sm font-semibold text-[#07111F] shadow-md shadow-[#18E3E3]/20 sm:inline-block">Resume</a>
            <DarkToggle />

            {/* Mobile hamburger */}
            <button
              id="nav-toggle"
              className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/6 p-2 text-zinc-200 sm:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((s) => !s)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            id="mobile-menu"
            ref={menuRef}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[999] sm:hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nav-toggle"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-zinc-900/95 p-6">
              <div className="flex h-full flex-col">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-gradient-to-br from-emerald-400 to-sky-500 p-2 shadow-md">
                      <span className="font-bold text-sm text-zinc-900">SY</span>
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-sm font-semibold">Santosh Kumar Yadav</span>
                      <span className="text-xs text-zinc-400">Developer</span>
                    </div>
                  </div>
                  <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="p-2 text-zinc-200">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <nav className="mb-auto flex flex-col gap-4" aria-label="Mobile primary">
                  {links.map(([label, href]) => (
                    <button
                      key={label}
                      onClick={() => handleNavClick(href)}
                      className={`flex items-center justify-between border-b border-white/10 py-3 text-left text-lg transition-colors ${activeId === href ? "font-semibold text-cyan-200" : "text-white hover:text-cyan-100"}`}
                      aria-label={`Go to ${label}`}
                      aria-current={activeId === href ? "page" : undefined}
                    >
                      {label}
                      {activeId === href ? <span className="h-1.5 w-10 rounded-full bg-emerald-400" aria-hidden="true" /> : null}
                    </button>
                  ))}
                </nav>

                <div className="mt-6 flex flex-col gap-3">
                  <a href="/resume.pdf" target="_blank" rel="noreferrer" className="rounded-full bg-gradient-to-r from-emerald-400 to-sky-500 px-6 py-3 text-sm font-semibold text-zinc-900 shadow-md">Resume</a>
                  <div>
                    <DarkToggle />
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
