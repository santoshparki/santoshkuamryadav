"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "@/components/navbar";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const usesStandaloneLayout = pathname.startsWith("/admin") || ["/login", "/forgot-password", "/reset-password"].includes(pathname);

  return (
    <>
      {!usesStandaloneLayout ? <Navbar /> : null}
      <main className={`flex-1 ${usesStandaloneLayout ? "" : "pt-24"}`}>{children}</main>
    </>
  );
}
