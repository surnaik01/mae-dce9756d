import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { getDealsByIds } from "@/lib/deals.functions";
import { DealCard } from "@/components/DealCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved deals — SaleSpot India" }] }),
  component: SavedPage,
});

function SavedPage() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem("salespot.saved");
    if (raw) {
      try { setIds(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const fetch = useServerFn(getDealsByIds);
  const { data, isLoading } = useQuery({
    queryKey: ["saved", ids],
    queryFn: () => fetch({ data: { ids } }),
    enabled: ids.length > 0,
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
        <Bookmark className="h-7 w-7 text-primary" /> Saved deals
      </h1>
      <p className="text-muted-foreground mt-1">Your bookmarked offers, stored on this device.</p>

      <div className="mt-8">
        {ids.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center">
            <p className="font-medium">Nothing saved yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Tap the bookmark icon on any deal to save it for later.</p>
            <Button asChild className="mt-6"><Link to="/deals">Browse deals</Link></Button>
          </div>
        ) : isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-[16/12] rounded-2xl bg-muted animate-pulse" />)}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(data?.deals ?? []).map((d) => <DealCard key={d.id} deal={d} />)}
          </div>
        )}
      </div>
    </div>
  );
}
