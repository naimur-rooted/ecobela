"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ImageUploader, type ImageItem } from "@/components/admin/image-uploader";
import { VariantGenerator, type VariantRow } from "@/components/admin/variant-generator";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/feedback";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import type { CategoryDTO, ProductDetailDTO } from "@/lib/serializers";
import { formatPrice, slugify } from "@/lib/utils";

type Props = {
  categories: CategoryDTO[];
  product?: ProductDetailDTO;
};

export function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(product?.description ?? "");
  const [basePrice, setBasePrice] = useState(product ? String(product.basePrice) : "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  const [images, setImages] = useState<ImageItem[]>(
    product?.images.map((image, index) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      publicId: image.publicId,
      isMain: image.isMain,
      position: index,
    })) ?? [],
  );

  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants.map((variant) => ({
      key: `${variant.size ?? ""}|${variant.color ?? ""}`,
      id: variant.id,
      size: variant.size,
      color: variant.color,
      sku: variant.sku,
      stockQuantity: variant.stockQuantity,
    })) ?? [],
  );

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate the URL slug from the title until the admin edits it manually.
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const skuPrefix = useMemo(() => slug || slugify(title) || "ECO", [slug, title]);
  const totalStock = variants.reduce((sum, variant) => sum + (variant.stockQuantity || 0), 0);
  const priceNumber = Number(basePrice);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setSubmitError(null);
    setSuccessMessage(null);

    // Cheap client-side guard so the admin gets instant feedback.
    if (!priceNumber || priceNumber <= 0) {
      setErrors({ basePrice: ["Price must be greater than 0"] });
      return;
    }
    if (!variants.length) {
      setErrors({ variants: ["Add at least one size or colour so stock can be tracked"] });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title,
      slug,
      description: description.trim() ? description : null,
      basePrice: priceNumber,
      categoryId: categoryId || null,
      isActive,
      variants: variants.map((variant) => ({
        ...(variant.id ? { id: variant.id } : {}),
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        stockQuantity: variant.stockQuantity,
      })),
      images: images.map((image, index) => ({
        ...(image.id ? { id: image.id } : {}),
        imageUrl: image.imageUrl,
        publicId: image.publicId,
        isMain: image.isMain,
        position: index,
      })),
    };

    try {
      const response = await fetch(isEdit ? `/api/admin/products/${product?.id}` : "/api/admin/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        setErrors(data?.fieldErrors ?? {});
        setSubmitError(data?.message ?? "Something went wrong while saving the product.");
        setIsSubmitting(false);
        return;
      }

      if (isEdit) {
        setSuccessMessage("Product updated successfully.");
        setIsSubmitting(false);
        router.refresh();
      } else {
        router.push(`/admin/products?created=${encodeURIComponent(title)}`);
        router.refresh();
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Network error. Please try again.");
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!window.confirm(`Delete "${product.title}"? Its variants and images are removed as well.`)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        setSubmitError(data?.message ?? "Could not delete this product.");
        setIsSubmitting(false);
        return;
      }
      router.push("/admin/products?deleted=1");
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Network error while deleting.");
      setIsSubmitting(false);
    }
  }

  const options = categoryOptions(categories);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError ? (
        <Alert tone="danger" title="Could not save">
          {submitError}
        </Alert>
      ) : null}
      {successMessage ? <Alert tone="success">{successMessage}</Alert> : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="font-display text-lg font-semibold text-ink-900">Product details</h2>
            <p className="mt-1 text-sm text-ink-500">Everything a customer sees on the product page.</p>

            <div className="mt-5 grid gap-4">
              <Field label="Title" htmlFor="title" required error={errors.title}>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Handwoven Jamdani Saree"
                  maxLength={160}
                  required
                />
              </Field>

              <Field
                label="URL slug"
                htmlFor="slug"
                required
                error={errors.slug}
                hint={`Storefront link: /products/${slug || "your-product"}`}
              >
                <Input
                  id="slug"
                  value={slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    setSlug(slugify(event.target.value));
                  }}
                  placeholder="handwoven-jamdani-saree"
                  required
                />
              </Field>

              <Field label="Description" htmlFor="description" error={errors.description}>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Fabric, craft technique, fit and care instructions…"
                />
              </Field>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="font-display text-lg font-semibold text-ink-900">Product images</h2>
            <p className="mt-1 text-sm text-ink-500">
              Files upload directly to your storage provider. The starred image is used in listings.
            </p>
            <div className="mt-5">
              <ImageUploader images={images} onChange={setImages} errors={errors} disabled={isSubmitting} />
            </div>
          </section>

          <section className="card p-5">
            <h2 className="font-display text-lg font-semibold text-ink-900">Variants &amp; inventory</h2>
            <p className="mt-1 text-sm text-ink-500">
              Add sizes and colours — every combination gets its own SKU and stock quantity.
            </p>
            <div className="mt-5">
              <VariantGenerator
                variants={variants}
                onChange={setVariants}
                skuPrefix={skuPrefix}
                errors={errors}
                disabled={isSubmitting}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="card p-5">
            <h2 className="font-display text-base font-semibold text-ink-900">Pricing &amp; category</h2>

            <div className="mt-4 grid gap-4">
              <Field label="Base price (BDT)" htmlFor="basePrice" required error={errors.basePrice}>
                <Input
                  id="basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={basePrice}
                  onChange={(event) => setBasePrice(event.target.value)}
                  placeholder="1200"
                  required
                />
              </Field>
              <p className="-mt-2 text-xs text-ink-500">
                Customers see: <span className="font-medium text-ink-800">{formatPrice(priceNumber || 0)}</span>
              </p>

              <Field label="Category" htmlFor="categoryId" error={errors.categoryId}>
                <Select id="categoryId" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                  <option value="">Uncategorised</option>
                  {options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              {categories.length === 0 ? (
                <p className="hint">
                  No categories yet — create one under <span className="font-medium">Categories</span> to group products.
                </p>
              ) : null}
            </div>
          </section>

          <section className="card p-5">
            <h2 className="font-display text-base font-semibold text-ink-900">Visibility</h2>
            <label className="mt-4 flex items-start gap-3 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-700"
              />
              <span>
                <span className="font-medium text-ink-900">Publish to storefront</span>
                <span className="block text-xs text-ink-500">Uncheck to keep it hidden as a draft.</span>
              </span>
            </label>

            <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-ink-100 pt-4 text-center">
              <div>
                <dt className="text-xs text-ink-500">Variants</dt>
                <dd className="text-lg font-semibold text-ink-900">{variants.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">In stock</dt>
                <dd className="text-lg font-semibold text-ink-900">{totalStock}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Images</dt>
                <dd className="text-lg font-semibold text-ink-900">{images.length}</dd>
              </div>
            </dl>
          </section>

          <section className="card space-y-3 p-5">
            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => router.push("/admin/products")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            {isEdit ? (
              <Button type="button" variant="danger" fullWidth onClick={handleDelete} disabled={isSubmitting}>
                Delete product
              </Button>
            ) : null}
          </section>
        </aside>
      </div>
    </form>
  );
}

/** Flattens the category tree into indented <option> labels, ordered by path. */
function categoryOptions(categories: CategoryDTO[]) {
  const byId = new Map(categories.map((category) => [category.id, category]));

  function ancestorsOf(category: CategoryDTO) {
    const chain: CategoryDTO[] = [];
    let current = category;
    let guard = 0;
    while (current.parentId && byId.has(current.parentId) && guard < 20) {
      const parent = byId.get(current.parentId) as CategoryDTO;
      chain.unshift(parent);
      current = parent;
      guard += 1;
    }
    return chain;
  }

  return categories
    .map((category) => {
      const ancestors = ancestorsOf(category);
      return {
        id: category.id,
        label: `${"— ".repeat(ancestors.length)}${category.name}`,
        path: [...ancestors.map((entry) => entry.name), category.name].join(" › ").toLowerCase(),
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}
