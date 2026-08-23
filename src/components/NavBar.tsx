"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ExportImportBar from "./ExportImportBar";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/metas", label: "Metas" },
  { href: "/transacciones", label: "Transacciones" },
  { href: "/configuracion", label: "Configuración" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        <div className="mr-2 flex shrink-0 items-center gap-2 text-text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </span>
          <span className="hidden font-semibold sm:inline">Control de gastos</span>
        </div>
        <nav className="flex shrink-0 gap-1">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-text-secondary hover:bg-surface-card-hover hover:text-text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto shrink-0 pl-2">
          <ExportImportBar compact />
        </div>
      </div>
    </header>
  );
}
