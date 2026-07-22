"use client";

// Standalone (static-export) copy of the dashboard sidebar. Same look as prod,
// but the backend couplings are stubbed: badge counts are static mock numbers
// and logout is a no-op (no server actions / stats polling in a static build).

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEnv } from "@/lib/env-context";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Building2,
  FileText,
  FlaskConical,
  Layers,
  Phone,
  Play,
  LogOut,
  Eye,
  Users,
  ShieldAlert,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  BarChart3,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

// GitHub Pages serves this under /<repo>/, so public assets need the prefix in
// production (next/image doesn't apply basePath to a plain string src). Local
// dev serves at the root.
const BASE =
  process.env.NODE_ENV === "production" ? "/voice-ai-triage-prototype" : "";

// Static stand-in counts so the queue badges look real in the prototype.
const MOCK_BADGES: Record<string, number> = {
  "/ops-review-prototype": 12,
  "/triage-prototype": 47,
};

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: "Calls",
    items: [
      { href: "/calls/explorer", label: "Call explorer", icon: Search },
      { href: "/ops-review-prototype", label: "Ops Review", icon: Eye },
      { href: "/batches", label: "Batches", icon: Play },
      { href: "/test-call", label: "Test calls", icon: Phone },
    ],
  },
  {
    label: "Configuration",
    items: [
      { href: "/use-cases", label: "Use cases", icon: FileText },
      {
        href: "/platform-implementations",
        label: "Implementations",
        icon: Layers,
      },
      {
        href: "/classification-playground",
        label: "Classification",
        icon: FlaskConical,
      },
    ],
  },
  {
    label: "R&D",
    items: [
      { href: "/rnd/analysis", label: "Analysis", icon: BarChart3 },
      { href: "/triage-prototype", label: "Triage", icon: AlertTriangle },
      { href: "/rnd/work-items", label: "Work items", icon: ClipboardList },
    ],
  },
  {
    label: "Admin",
    items: [
      {
        href: "/phone-management",
        label: "Phone management",
        icon: ShieldAlert,
      },
      { href: "/users", label: "Users", icon: Users },
    ],
  },
];

function isHrefMatch(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const { env, setEnv, isTest } = useEnv();

  // Pick the single most-specific (longest) matching href so that sibling
  // routes sharing a prefix don't both highlight as active.
  const activeHref = navSections
    .flatMap((section) => section.items)
    .filter((item) => isHrefMatch(pathname, item.href))
    .reduce<string | null>(
      (longest, item) =>
        longest === null || item.href.length > longest.length
          ? item.href
          : longest,
      null,
    );

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  });

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-screen flex-col border-r bg-card transition-[width] duration-200",
          collapsed ? "w-14" : "w-60",
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center px-3">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2",
              collapsed && "justify-center w-full",
            )}
          >
            {collapsed ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${BASE}/datavant-mark-black.svg`}
                  alt="Datavant"
                  width={24}
                  height={24}
                  className="block dark:hidden"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${BASE}/datavant-mark-white.svg`}
                  alt="Datavant"
                  width={24}
                  height={24}
                  className="hidden dark:block"
                />
              </>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${BASE}/datavant-logo-black.svg`}
                  alt="Datavant"
                  width={120}
                  height={26}
                  className="block dark:hidden"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${BASE}/datavant-logo-white.svg`}
                  alt="Datavant"
                  width={120}
                  height={26}
                  className="hidden dark:block"
                />
              </>
            )}
          </Link>
        </div>

        {/* Env toggle */}
        {!collapsed ? (
          <div className="mx-3 mt-2 mb-1">
            <div className="flex items-center gap-1 rounded-lg bg-muted/60 p-1">
              <button
                onClick={() => setEnv("prod")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium transition-colors",
                  env === "prod"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Building2 className="h-3 w-3" />
                Prod
              </button>
              <button
                onClick={() => setEnv("test")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium transition-colors",
                  env === "test"
                    ? "bg-orange-100 text-orange-700 shadow-sm dark:bg-orange-900/30 dark:text-orange-400"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <FlaskConical className="h-3 w-3" />
                Test
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-1.5 mt-2 mb-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setEnv(isTest ? "prod" : "test")}
                  className={cn(
                    "flex w-full items-center justify-center rounded-md p-1.5 text-[10px] font-bold transition-colors",
                    isTest
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : "bg-muted/60 text-muted-foreground",
                  )}
                >
                  {isTest ? "T" : "P"}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {isTest ? "Switch to Prod" : "Switch to Test"}
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-1.5 py-2">
          {navSections.map((section) => (
            <div key={section.label} className="mb-4">
              {!collapsed && (
                <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {section.label}
                </p>
              )}
              {collapsed && (
                <div className="mb-1 border-b border-border/40 mx-2" />
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = item.href === activeHref;
                  const badgeCount = MOCK_BADGES[item.href] ?? null;
                  const showBadge = badgeCount !== null && badgeCount > 0;

                  const linkContent = (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center text-[13px] font-medium transition-colors",
                        collapsed
                          ? "justify-center rounded-lg px-0 py-1.5"
                          : "gap-2.5 rounded-r-lg py-1.5",
                        isActive
                          ? collapsed
                            ? "bg-datavant-teal/10 text-foreground"
                            : "border-l-2 border-datavant-teal bg-datavant-teal/5 pl-[10px] pr-3 text-foreground"
                          : collapsed
                            ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                            : "border-l-2 border-transparent pl-[10px] pr-3 text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <div className="relative shrink-0">
                        <item.icon
                          className={cn(
                            "h-4 w-4",
                            isActive ? "text-datavant-teal" : "",
                          )}
                        />
                        {collapsed && showBadge && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-destructive px-0.5 text-[8px] font-bold text-destructive-foreground">
                            {badgeCount}
                          </span>
                        )}
                      </div>
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {showBadge && (
                            <Badge
                              variant="destructive"
                              className="ml-auto h-5 min-w-5 justify-center px-1.5 text-[10px] font-semibold"
                            >
                              {badgeCount}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                        <TooltipContent side="right">
                          {item.label}
                          {showBadge && ` (${badgeCount})`}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return linkContent;
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t px-1.5 py-3 space-y-1">
          {/* Collapse toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleCollapsed}
                className={cn(
                  "flex w-full items-center rounded-lg text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  collapsed
                    ? "justify-center px-0 py-1.5"
                    : "gap-2.5 px-3 py-1.5",
                )}
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <>
                    <PanelLeftClose className="h-4 w-4" />
                    <span>Collapse</span>
                  </>
                )}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            )}
          </Tooltip>

          {/* Theme toggle */}
          <ThemeToggle collapsed={collapsed} />

          {/* Logout (no-op in the static prototype) */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-lg py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          ) : (
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
