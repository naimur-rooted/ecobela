import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/feedback";
import { authOptions } from "@/lib/auth";

export const metadata = { title: "My account" };

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/account");

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-semibold text-ink-900">My account</h1>

        <section className="card mt-8 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-400">Signed in as</p>
              <p className="mt-1 font-medium text-ink-900">{session.user.name ?? "Eco Bela customer"}</p>
              <p className="text-sm text-ink-600">{session.user.email}</p>
            </div>
            <Badge tone={isAdmin ? "brand" : "neutral"}>{session.user.role}</Badge>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-ink-100 pt-6">
            <ButtonLink href="/products" size="sm">
              Continue shopping
            </ButtonLink>
            <ButtonLink href="/cart" variant="outline" size="sm">
              View cart
            </ButtonLink>
            {isAdmin ? (
              <ButtonLink href="/admin" variant="secondary" size="sm">
                Open admin panel
              </ButtonLink>
            ) : null}
            <SignOutButton />
          </div>
        </section>

        <section className="card mt-6 p-6">
          <h2 className="font-display text-lg font-semibold text-ink-900">Orders</h2>
          <p className="mt-2 text-sm text-ink-600">
            Order history, invoices and delivery tracking arrive with the checkout module. In the meantime, your cart is
            kept safely in this browser and support is a message away at{" "}
            <a href="mailto:support@ecobela.com" className="text-brand-700 hover:underline">
              support@ecobela.com
            </a>
            .
          </p>
          <p className="mt-4 text-sm text-ink-500">
            Looking for something else?{" "}
            <Link href="/" className="link-muted">
              Back to the storefront
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
