import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { z } from "zod";
import { Search, SlidersHorizontal } from "lucide-react";
import { getDeals } from "@/lib/deals.functions";
import { CATEGORIES } from "@/lib/cities";
import { useCity } from "@/hooks/use-city";
import { DealCard } from "@/components/DealCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  online: z.string().optional(),
  sort: z.enum(["newest", "ending", "discount"]).optional(),
});

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "All Deals — SaleSpot India" },
      { name: "description", content: "Browse all live sales and deals: filter by city, category, store and discount." },
      { property: "og:title", content: "All Deals — SaleSpot India" },
    ],
  }),
  validateSearch: (s) => searchSchema.parse(s),
  component: DealsPage,
});

function DealsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { city } = useCity();
  const [q, setQ] = useState(search.q ?? "");

  const fetchDeals = useServerFn(getDeals);
  const filters = useMemo(() => ({
    city,
    category: search.category,
    isOnline: search.online === "true" ? true : search.online === "false" ? false : undefined,
    sort: search.sort ?? "newest",
    search: search.q,
  }), [city, search]);

  const { data, isLoading } = useQuery({
    queryKey: ["deals", "all", filters],
    queryFn: () => fetchDeals({ data: filters }),
  });

  const deals = data?.deals ?? [];

  const update = (patch: Partial<z.infer<typeof searchSchema>>) => {
    navigate({ search: (s: z.infer<typeof searchSchema>) => ({ ...s, ...patch }) as never });
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">All deals</h1>
        <p className="text-muted-foreground mt-1">Showing offers in <span className="text-primary font-medium">{city}</span></p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); update({ q: q || undefined }); }}
        className="mb-4 flex gap-2"
      >
        <div className="flex-1 flex items-center gap-2 rounded-lg border border-input bg-background px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search store, brand or category"
            className="border-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <Select value={search.category ?? "all"} onValueChange={(v) => update({ category: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={search.online ?? "any"} onValueChange={(v) => update({ online: v === "any" ? undefined : v })}>
          <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Online + Local</SelectItem>
            <SelectItem value="true">Online only</SelectItem>
            <SelectItem value="false">Local only</SelectItem>
          </SelectContent>
        </Select>

        <Select value={search.sort ?? "newest"} onValueChange={(v) => update({ sort: v as "newest" | "ending" | "discount" })}>
          <SelectTrigger className="w-[160px] h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="ending">Ending soon</SelectItem>
            <SelectItem value="discount">Biggest discount</SelectItem>
          </SelectContent>
        </Select>

        {(search.category || search.online || search.q) && (
          <Button variant="ghost" size="sm" onClick={() => navigate({ search: {} })}>
            Clear filters
          </Button>
        )}

        <div className="ml-auto"><Badge variant="secondary">{deals.length} results</Badge></div>
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-[16/12] rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : deals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-medium">No deals match your filters.</p>
          <p className="text-sm text-muted-foreground mt-1">Try clearing filters or switching city.</p>
          <Link to="/deals" className="mt-4 inline-block text-primary hover:underline">Reset</Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((d) => <DealCard key={d.id} deal={d} />)}
        </div>
      )}
    </div>
  );
}
