import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Sparkles, Tag, Globe, ShoppingBasket, PartyPopper, ArrowRight } from "lucide-react";
import { getDeals } from "@/lib/deals.functions";
import { useCity } from "@/hooks/use-city";
import { DealCard } from "@/components/DealCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SaleSpot India — Find every sale near you" },
      { name: "description", content: "All the best sales, online deals, festival offers and grocery discounts across India in one place. Refreshed daily." },
      { property: "og:title", content: "SaleSpot India — Find every sale near you" },
      { property: "og:description", content: "All the best sales, online deals, festival offers and grocery discounts across India in one place." },
    ],
  }),
  component: HomePage,
});

const CATEGORY_TILES = [
  { label: "Online deals", filter: "Online", icon: Globe, color: "from-blue-500/20 to-blue-600/10" },
  { label: "Local stores", filter: "local", icon: Tag, color: "from-primary/20 to-primary/5" },
  { label: "Festival offers", filter: "Festival", icon: PartyPopper, color: "from-purple-500/20 to-pink-500/10" },
  { label: "Grocery", filter: "Grocery", icon: ShoppingBasket, color: "from-green-500/20 to-emerald-500/10" },
];

function HomePage() {
  const { city } = useCity();
  const [q, setQ] = useState("");
  const fetchDeals = useServerFn(getDeals);

  const trending = useQuery({
    queryKey: ["deals", "trending", city],
    queryFn: () => fetchDeals({ data: { city, sort: "discount", limit: 6 } }),
  });
  const ending = useQuery({
    queryKey: ["deals", "ending", city],
    queryFn: () => fetchDeals({ data: { city, sort: "ending", limit: 6 } }),
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 [background:var(--gradient-hero)] opacity-95" />
        <div className="relative container mx-auto max-w-6xl px-4 py-16 md:py-24 text-primary-foreground">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur mb-5">
            <Sparkles className="h-3 w-3" /> Updated daily · {city}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] max-w-3xl">
            Every sale across India,<br />in one place.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
            Stop scrolling 10 apps. Find the best online deals, local store offers, festival sales and grocery discounts — curated for you.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="mt-8 flex w-full max-w-2xl gap-2 rounded-2xl bg-background/95 p-2 backdrop-blur shadow-2xl"
          >
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search Amazon, Myntra, DMart, electronics, sarees…"
                className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 shadow-none"
              />
            </div>
            <Button asChild size="lg">
              <Link to="/deals" search={{ q } as never}>
                Search
              </Link>
            </Button>
          </form>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
            {CATEGORY_TILES.map((t) => (
              <Link
                key={t.label}
                to="/deals"
                search={{ category: t.filter === "local" ? undefined : t.filter, online: t.filter === "local" ? "false" : undefined } as never}
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${t.color} bg-background/95 p-4 text-left transition hover:scale-[1.03]`}
              >
                <t.icon className="h-6 w-6 text-primary mb-2" />
                <div className="font-semibold text-foreground">{t.label}</div>
                <ArrowRight className="absolute right-3 bottom-3 h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="container mx-auto max-w-6xl px-4 py-14">
        <SectionHeader
          title="Trending now"
          subtitle="Biggest discounts running this week"
          link={{ to: "/deals", label: "See all" }}
        />
        <DealGrid query={trending} />
      </section>

      {/* Ending soon */}
      <section className="container mx-auto max-w-6xl px-4 pb-16">
        <SectionHeader
          title="Ending soon"
          subtitle="Don't miss these — grab them before they expire"
          link={{ to: "/deals", label: "See all" }}
        />
        <DealGrid query={ending} />
      </section>
    </div>
  );
}

function SectionHeader({ title, subtitle, link }: { title: string; subtitle: string; link: { to: string; label: string } }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <Link to={link.to} className="text-sm font-medium text-primary hover:underline whitespace-nowrap">
        {link.label} →
      </Link>
    </div>
  );
}

function DealGrid({ query }: { query: ReturnType<typeof useQuery<{ deals: import("@/components/DealCard").Deal[]; error: string | null }>> }) {
  if (query.isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[16/12] rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }
  const deals = query.data?.deals ?? [];
  if (deals.length === 0) {
    return <p className="text-sm text-muted-foreground">No deals here yet — check back soon.</p>;
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {deals.map((d) => <DealCard key={d.id} deal={d} />)}
    </div>
  );
}
