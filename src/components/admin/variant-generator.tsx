"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";

import { TagInput } from "@/components/admin/tag-input";

/**
 * Variant Generator
 * -----------------
 * The admin types sizes (S, M, L) and colours (Red, Blue). Every combination is
 * expanded automatically into its own row with an editable SKU and stock
 * quantity — which is exactly what gets written to `ProductVariant`.
 */

export type VariantRow = {
  key: string;
  id?: string;
  size: string | null;
  color: string | null;
  sku: string;
  stockQuantity: number;
};

type Props = {
  variants: VariantRow[];
  onChange: (variants: VariantRow[]) => void;
  skuPrefix: string;
  errors?: Record<string, string[]>;
  disabled?: boolean;
};

export function comboKey(size: string | null, color: string | null) {
  return `${size ?? ""}|${color ?? ""}`;
}

export function buildSku(prefix: string, size: string | null, color: string | null) {
  const parts = [prefix, size, color].filter((part): part is string => Boolean(part && part.trim()));
  const sku = parts.join("-").toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return sku || "SKU";
}

function combinations(sizes: string[], colors: string[]): Array<{ size: string | null; color: string | null }> {
  if (!sizes.length && !colors.length) return [];
  if (sizes.length && colors.length) {
    return sizes.flatMap((size) => colors.map((color) => ({ size, color })));
  }
  return sizes.length ? sizes.map((size) => ({ size, color: null })) : colors.map((color) => ({ size: null, color }));
}

function addTag(list: string[], raw: string) {
  const value = raw.trim();
  if (!value || value.length > 40) return list;
  if (list.some((entry) => entry.toLowerCase() === value.toLowerCase())) return list;
  if (list.length >= 20) return list;
  return [...list, value];
}

export function VariantGenerator({ variants, onChange, skuPrefix, errors, disabled }: Props) {
  const [sizes, setSizes] = useState<string[]>(() => uniqueValues(variants.map((variant) => variant.size)));
  const [colors, setColors] = useState<string[]>(() => uniqueValues(variants.map((variant) => variant.color)));
  const [autoSku, setAutoSku] = useState(true);
  const [sizeDraft, setSizeDraft] = useState("");
  const [colorDraft, setColorDraft] = useState("");
  const [bulkStock, setBulkStock] = useState("10");

  const lastPrefix = useRef(skuPrefix);

  // Refresh auto-generated SKUs whenever the product title/slug changes.
  useEffect(() => {
    if (lastPrefix.current === skuPrefix) return;
    lastPrefix.current = skuPrefix;
    if (!autoSku) return;
    onChange(variants.map((variant) => ({ ...variant, sku: buildSku(skuPrefix, variant.size, variant.color) })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skuPrefix, autoSku]);

  function syncRows(nextSizes: string[], nextColors: string[]) {
    const combos = combinations(nextSizes, nextColors);
    const previous = new Map(variants.map((variant) => [variant.key, variant]));

    onChange(
      combos.map((combo) => {
        const key = comboKey(combo.size, combo.color);
        const existing = previous.get(key);
        if (existing) return existing;
        return {
          key,
          size: combo.size,
          color: combo.color,
          sku: buildSku(skuPrefix, combo.size, combo.color),
          stockQuantity: 0,
        };
      }),
    );
  }

  function handleAdd(kind: "size" | "color", raw: string) {
    const value = raw.trim();
    if (!value) return;
    if (kind === "size") {
      const next = addTag(sizes, value);
      setSizes(next);
      setSizeDraft("");
      syncRows(next, colors);
    } else {
      const next = addTag(colors, value);
      setColors(next);
      setColorDraft("");
      syncRows(sizes, next);
    }
  }

  function handleRemove(kind: "size" | "color", value: string) {
    if (kind === "size") {
      const next = sizes.filter((entry) => entry !== value);
      setSizes(next);
      syncRows(next, colors);
    } else {
      const next = colors.filter((entry) => entry !== value);
      setColors(next);
      syncRows(sizes, next);
    }
  }

  function updateRow(key: string, patch: Partial<VariantRow>) {
    onChange(variants.map((variant) => (variant.key === key ? { ...variant, ...patch } : variant)));
  }

  function regenerateSkus() {
    onChange(variants.map((variant) => ({ ...variant, sku: buildSku(skuPrefix, variant.size, variant.color) })));
    setAutoSku(true);
  }

  function applyBulkStock() {
    const value = Math.max(0, Math.trunc(Number(bulkStock) || 0));
    onChange(variants.map((variant) => ({ ...variant, stockQuantity: value })));
  }

  const totalStock = variants.reduce((sum, variant) => sum + (Number.isFinite(variant.stockQuantity) ? variant.stockQuantity : 0), 0);
  const outOfStock = variants.filter((variant) => variant.stockQuantity <= 0).length;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TagInput
          label="Sizes"
          placeholder="e.g. S, M, L, XL"
          tags={sizes}
          draft={sizeDraft}
          onDraftChange={setSizeDraft}
          onAdd={(value) => handleAdd("size", value)}
          onRemove={(value) => handleRemove("size", value)}
          disabled={disabled}
        />
        <TagInput
          label="Colors"
          placeholder="e.g. Indigo, Off-white"
          tags={colors}
          draft={colorDraft}
          onDraftChange={setColorDraft}
          onAdd={(value) => handleAdd("color", value)}
          onRemove={(value) => handleRemove("color", value)}
          disabled={disabled}
        />
      </div>
      <FieldError messages={errors?.variants} />

      <div className="rounded-xl border border-ink-100 bg-ink-50/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-600">
            <span className="font-semibold text-ink-900">{variants.length}</span> variant
            {variants.length === 1 ? "" : "s"} generated ·{" "}
            <span className="font-semibold text-ink-900">{totalStock}</span> units in stock
            {outOfStock > 0 ? <span className="text-amber-700"> · {outOfStock} out of stock</span> : null}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              min={0}
              value={bulkStock}
              onChange={(event) => setBulkStock(event.target.value)}
              aria-label="Bulk stock quantity"
              className="field h-9 w-20 py-0"
            />
            <Button type="button" variant="outline" size="sm" onClick={applyBulkStock} disabled={disabled || !variants.length}>
              Set stock for all
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={regenerateSkus} disabled={disabled || !variants.length}>
              Regenerate SKUs
            </Button>
          </div>
        </div>
      </div>

      {variants.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-200 px-4 py-6 text-center text-sm text-ink-500">
          Add at least one size or colour above — every combination appears here with its own SKU and stock.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-100">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Size</th>
                <th className="px-4 py-3 font-semibold">Color</th>
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 bg-white">
              {variants.map((variant, index) => (
                <tr key={variant.key}>
                  <td className="px-4 py-3 text-ink-800">{variant.size ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-800">{variant.color ?? "—"}</td>
                  <td className="px-4 py-3">
                    <input
                      value={variant.sku}
                      disabled={disabled}
                      onChange={(event) => updateRow(variant.key, { sku: event.target.value })}
                      aria-label={`SKU for row ${index + 1}`}
                      className="field h-9 py-0 font-mono text-xs"
                    />
                    <FieldError messages={errors?.[`variants.${index}.sku`]} />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={variant.stockQuantity}
                      disabled={disabled}
                      onChange={(event) =>
                        updateRow(variant.key, {
                          stockQuantity: Math.max(0, Math.trunc(Number(event.target.value) || 0)),
                        })
                      }
                      aria-label={`Stock for row ${index + 1}`}
                      className="field h-9 w-24 py-0"
                    />
                    <FieldError messages={errors?.[`variants.${index}.stockQuantity`]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function uniqueValues(values: Array<string | null>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}
