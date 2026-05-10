import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Store } from "lucide-react";
import { getStores } from "@/lib/deals.functions";

export const Route = createFileRoute("/stores")({
  head: () => ({
    meta: [
      { title: "Stores — SaleSpot India" },
      { name: "description", content: "Browse deals by retailer: Amazon, Flipkart, Myntra, DMart and more." },
    ],
  }),
  component: StoresPage,
});

function StoresPage() {
  const fetch = useServerFn(getStores);
  const { data, isLoading } = useQuery({ queryKey: ["stores"], queryFn: () => fetch() });
  const stores = data?.stores ?? [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold">Browse by store</h1>
      <p className="text-muted-foreground mt-1">Find offers from your favourite retailers.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />)
          : stores.map((s) => (
              <Link
                key={s.name}
                to="/deals"
                search={{ q: s.name } as never}
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition hover:border-primary hover:[box-shadow:var(--shadow-card)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Store className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.count} deal{s.count > 1 ? "s" : ""}</div>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
