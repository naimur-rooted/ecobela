import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { authOptions } from "@/lib/auth";

/**
 * Server-side guard for the whole /admin area.
 * (`middleware.ts` already blocks the routes; this is defence in depth and it
 * gives the layout the session it needs for the sidebar.)
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/?error=admin-only");

  return (
    <div className="bg-ink-50/50">
      {/*
        Admin is intentionally FULL-BLEED: the storefront uses `container-page`
        (mx-auto + max-w-7xl), but the dashboard should use the whole screen.
        Fluid padding keeps content off the very edges of the monitor.
      */}
      <div className="grid w-full gap-6 px-4 py-6 md:px-8 lg:grid-cols-[240px_1fr] lg:gap-8">
        <AdminSidebar adminName={session.user.name ?? "Administrator"} adminEmail={session.user.email ?? ""} />
        <div className="min-w-0 w-full">{children}</div>
      </div>
    </div>
  );
}
