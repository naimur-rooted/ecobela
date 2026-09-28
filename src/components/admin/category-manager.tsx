"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/feedback";
import { Input, Select } from "@/components/ui/field";
import type { CategoryDTO } from "@/lib/serializers";
import { slugify } from "@/lib/utils";

type CategoryRow = CategoryDTO & { productCount?: number; childCount?: number };

export function CategoryManager({ initialCategories }: { initialCategories: CategoryRow[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const options = buildOptions(initialCategories);

  async function createCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug: slugify(name), parentId: parentId || null }),
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) throw new Error(data?.message ?? "Could not create the category.");

      setMessage(`“${name}” was created.`);
      setName("");
      setParentId("");
      router.refresh();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Create failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeCategory(category: CategoryRow) {
    if (!window.confirm(`Delete the category “${category.name}”?`)) return;
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data?.ok) throw new Error(data?.message ?? "Could not delete the category.");
      setMessage(`“${category.name}” was deleted.`);
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <h2 className="font-display text-lg font-semibold text-ink-900">New category</h2>
        <p className="mt-1 text-sm text-ink-500">
          Categories can be nested to any depth — pick a parent to create a sub-category.
        </p>

        <form onSubmit={createCategory} className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <label className="label" htmlFor="category-name">
              Name
            </label>
            <Input
              id="category-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Saree"
              required
              minLength={2}
            />
          </div>
          <div>
            <label className="label" htmlFor="category-parent">
              Parent category
            </label>
            <Select id="category-parent" value={parentId} onChange={(event) => setParentId(event.target.value)}>
              <option value="">None (top level)</option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" disabled={isSaving || name.trim().length < 2}>
            {isSaving ? "Saving…" : "Add category"}
          </Button>
        </form>

        {error ? (
          <Alert tone="danger" className="mt-4">
            {error}
          </Alert>
        ) : null}
        {message ? (
          <Alert tone="success" className="mt-4">
            {message}
          </Alert>
        ) : null}
      </section>

      <section className="card p-5">
        <h2 className="font-display text-lg font-semibold text-ink-900">Category tree</h2>
        {initialCategories.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-ink-200 px-4 py-8 text-center text-sm text-ink-500">
            No categories yet. Create your first one above to start organising the catalogue.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-ink-100">
            {buildTree(initialCategories).map((node) => (
              <CategoryNode key={node.id} node={node} onDelete={removeCategory} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

type TreeNode = CategoryRow & { children: TreeNode[] };

function buildTree(categories: CategoryRow[]): TreeNode[] {
  const nodes = new Map<string, TreeNode>();
  categories.forEach((category) => nodes.set(category.id, { ...category, children: [] }));

  const roots: TreeNode[] = [];
  nodes.forEach((node) => {
    if (node.parentId && nodes.has(node.parentId)) nodes.get(node.parentId)!.children.push(node);
    else roots.push(node);
  });
  return roots;
}

function CategoryNode({ node, onDelete }: { node: TreeNode; onDelete: (category: CategoryRow) => void }) {
  return (
    <li className="py-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-ink-900">{node.name}</span>
          <span className="font-mono text-xs text-ink-400">/{node.slug}</span>
          {node.productCount ? (
            <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-600">
              {node.productCount} product{node.productCount === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-red-600 hover:bg-red-50"
          onClick={() => onDelete(node)}
        >
          Delete
        </Button>
      </div>

      {node.children.length ? (
        <ul className="ml-4 mt-1 border-l border-ink-100 pl-4">
          {node.children.map((child) => (
            <CategoryNode key={child.id} node={child} onDelete={onDelete} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function buildOptions(categories: CategoryRow[]) {
  const byId = new Map(categories.map((category) => [category.id, category]));

  function depthOf(category: CategoryRow) {
    let depth = 0;
    let current = category;
    let guard = 0;
    while (current.parentId && byId.has(current.parentId) && guard < 20) {
      current = byId.get(current.parentId) as CategoryRow;
      depth += 1;
      guard += 1;
    }
    return depth;
  }

  return categories
    .map((category) => ({ id: category.id, label: `${"— ".repeat(depthOf(category))}${category.name}` }))
    .sort((a, b) => a.label.localeCompare(b.label));
}