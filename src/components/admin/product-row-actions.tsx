"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Publish toggle + delete for a single product row. */
export function ProductRowActions({
  productId,
  title,
  isActive,
}: {
  productId: string;
  title: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<"toggle" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleActive() {
    setPending("toggle");
    setError(null);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) throw new Error(data?.message ?? "Could not update visibility.");
      router.refresh();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Update failed.");
    } finally {
      setPending(null);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete "${title}"? This also removes its variants and images.`)) return;
    setPending("delete");
    setError(null);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data?.ok) throw new Error(data?.message ?? "Could not delete the product.");
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1.5">
        <Button type="button" variant="ghost" size="sm" onClick={toggleActive} disabled={pending !== null}>
          {pending === "toggle" ? "…" : isActive ? "Unpublish" : "Publish"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={remove}
          disabled={pending !== null}
          className={cn("text-red-600 hover:bg-red-50")}
        >
          {pending === "delete" ? "…" : "Delete"}
        </Button>
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
