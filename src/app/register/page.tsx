"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/feedback";
import { Field, Input } from "@/components/ui/field";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok || !data?.ok) {
        setError(data?.message ?? "We could not create your account.");
        setIsSubmitting(false);
        return;
      }

      // Sign the customer in straight away.
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Account created — please sign in to continue.");
        setIsSubmitting(false);
        router.push("/login");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Network error. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container-page py-16">
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-display text-3xl font-semibold text-ink-900">Create your account</h1>
        <p className="mt-2 text-sm text-ink-600">It only takes a moment — and your cart is saved either way.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error ? <Alert tone="danger">{error}</Alert> : null}

          <Field label="Full name" htmlFor="name" required>
            <Input id="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
          </Field>

          <Field label="Email" htmlFor="email" required>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </Field>

          <Field label="Password" htmlFor="password" hint="At least 8 characters." required>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </Field>

          <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-ink-600">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-brand-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
