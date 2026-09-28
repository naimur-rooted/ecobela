import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Elegant empty state — the storefront is genuinely empty until the admin
 * uploads the first catalogue, so this is a first-class screen, not an error.
 */
export function EmptyState({
  icon = "🌿",
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-clay-50/60 px-6 py-16 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-card">{icon}</div>
      <h3 className="font-display text-xl font-semibold text-ink-900">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-ink-600">{description}</p> : null}
      {action ? (
        <Link
          href={action.href}
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-brand-700 px-5 text-sm font-medium text-white transition hover:bg-brand-800"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
