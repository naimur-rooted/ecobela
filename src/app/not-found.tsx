import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="container-page py-20">
      <EmptyState
        icon="🧭"
        title="We couldn't find that page"
        description="The link may be broken, or the product may no longer be available. Let's get you back on track."
        action={{ href: "/products", label: "Browse products" }}
      />
    </div>
  );
}
