import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, RefreshCw, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SaleSpot India" },
      { name: "description", content: "Why we built SaleSpot — and what's coming next." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold">About SaleSpot</h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        SaleSpot was born from a simple frustration: there are amazing sales happening every day across India — at the mall down the street, on Amazon, on Myntra, at DMart — but you find out about them by accident, or after they've ended.
      </p>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        We're gathering them all in one place. One website. One search. One shopping list.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Feature icon={Sparkles} title="Curated daily" body="Online deals, festival offers, weekly grocery discounts — kept current." />
        <Feature icon={MapPin} title="Local + online" body="Pick your city to see what's on sale near you, plus all-India online offers." />
        <Feature icon={RefreshCw} title="Auto-refreshed" body="We pull updates from across the web so you don't have to check every retailer." />
        <Feature icon={Heart} title="Made for shoppers" body="No ads, no tracking, no spam — just the deals worth your time." />
      </div>

      <div className="mt-12 rounded-2xl bg-secondary/50 p-6">
        <h2 className="font-semibold text-lg">Coming soon</h2>
        <p className="text-muted-foreground mt-2">
          A dedicated section for <strong className="text-foreground">government schemes for women</strong> — central and state benefits, eligibility, and how to apply, all in one searchable directory.
        </p>
      </div>

      <div className="mt-10">
        <Button asChild size="lg"><Link to="/deals">Start browsing deals</Link></Button>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, body }: { icon: typeof Sparkles; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <Icon className="h-6 w-6 text-primary mb-2" />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{body}</p>
    </div>
  );
}
