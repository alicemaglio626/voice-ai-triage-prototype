"use client";

import { usePathname } from "next/navigation";
import { EnvProvider } from "@/lib/env-context";
import { Sidebar } from "./sidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <EnvProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 py-5">{children}</main>
      </div>
    </EnvProvider>
  );
}
