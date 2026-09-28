"use client";

import type { KeyboardEvent } from "react";

import { Badge } from "@/components/ui/feedback";

/** Chip-style input used for the Sizes / Colors lists in the Variant Generator. */
export function TagInput({
  label,
  placeholder,
  tags,
  draft,
  onDraftChange,
  onAdd,
  onRemove,
  disabled,
}: {
  label: string;
  placeholder: string;
  tags: string[];
  draft: string;
  onDraftChange: (value: string) => void;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  disabled?: boolean;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      onAdd(draft);
    }
    if (event.key === "Backspace" && !draft && tags.length) {
      onRemove(tags[tags.length - 1]);
    }
  }

  return (
    <div>
      <label className="label" htmlFor={`tag-${label.toLowerCase()}`}>
        {label}
      </label>
      <div className="rounded-lg border border-ink-200 bg-white p-2 shadow-sm focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
        {tags.length ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onRemove(tag)}
                  disabled={disabled}
                  aria-label={`Remove ${tag}`}
                  className="text-brand-700 transition hover:text-red-600 disabled:opacity-50"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : null}
        <input
          id={`tag-${label.toLowerCase()}`}
          value={draft}
          disabled={disabled}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => draft.trim() && onAdd(draft)}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-ink-400"
        />
      </div>
      <p className="hint">
        {tags.length ? (
          <>
            <Badge tone="neutral">{tags.length} added</Badge> Press Enter after each value
          </>
        ) : (
          "Press Enter after each value"
        )}
      </p>
    </div>
  );
}
