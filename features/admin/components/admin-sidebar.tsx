"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, UserRound, Briefcase, GraduationCap, FileText, ImageIcon, Mail, Link2, Settings, ShieldCheck, PanelsTopLeft, Menu, X } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/about", label: "About Me", icon: UserRound },
  { href: "/admin/hero", label: "Hero", icon: ShieldCheck },
  { href: "/admin/homepage", label: "Homepage Sections", icon: PanelsTopLeft },
  { href: "/admin/skills", label: "Skills", icon: Briefcase },
  { href: "/admin/projects", label: "Projects", icon: ImageIcon },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certificates", label: "Certificates", icon: FileText },
  { href: "/admin/services", label: "Services", icon: ShieldCheck },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/social-links", label: "Social Links", icon: Link2 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminNavItems({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-2" aria-label="Admin navigation">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-cyan-400/15 text-white shadow-sm ring-1 ring-inset ring-cyan-300/25"
                : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-cyan-300" : ""}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminMobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Portfolio Admin</p>
          <p className="mt-1 text-base font-semibold text-zinc-950">CMS Dashboard</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open admin navigation"
          aria-expanded={isOpen}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 text-zinc-700 transition hover:bg-zinc-100"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Admin navigation">
          <button type="button" aria-label="Close admin navigation" onClick={() => setIsOpen(false)} className="absolute inset-0 bg-zinc-950/50" />
          <aside className="relative flex h-full w-80 max-w-[85vw] flex-col bg-zinc-950 p-5 text-zinc-100 shadow-2xl">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">Portfolio Admin</p>
                <h2 className="mt-2 text-xl font-semibold">CMS Dashboard</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close admin navigation"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <AdminNavItems onNavigate={() => setIsOpen(false)} />
          </aside>
        </div>
      ) : null}
    </div>
  );
}

export function AdminSidebar() {

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-zinc-200 bg-zinc-950 p-6 text-zinc-100 lg:flex">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400">Portfolio Admin</p>
        <h2 className="mt-2 text-2xl font-semibold">CMS Dashboard</h2>
      </div>

      <AdminNavItems />
    </aside>
  );
}
