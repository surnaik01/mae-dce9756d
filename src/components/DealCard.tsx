import { Link } from "@tanstack/react-router";
import { Bookmark, Clock, MapPin, Globe, Store as StoreIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSavedDeals } from "@/hooks/use-city";
import { cn } from "@/lib/utils";

export type Deal = {
  id: string;
  title: string;
  description: string | null;
  store: string;
  category: string;
  city: string;
  discount_percent: number | null;
  image_url: string | null;
  source_url: string | null;
  valid_until: string | null;
  is_online: boolean;
};

function daysLeft(until: string | null) {
  if (!until) return null;
  const ms = new Date(until).getTime() - Date.now();
  const d = Math.ceil(ms / (1000 * 60 * 60 * 24));
  if (d <= 0) return "Ended";
  if (d === 1) return "Ends today";
  return `${d}d left`;
}

export function DealCard({ deal }: { deal: Deal }) {
  const { isSaved, toggle } = useSavedDeals();
  const saved = isSaved(deal.id);
  const days = daysLeft(deal.valid_until);

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-card border border-border [box-shadow:var(--shadow-card)] transition hover:-translate-y-1 hover:[box-shadow:var(--shadow-glow)]">
      <Link to="/deals/$dealId" params={{ dealId: deal.id }} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {deal.image_url ? (
            <img
              src={deal.image_url}
              alt={deal.title}
              loading="lazy"
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20" />
          )}
          {deal.discount_percent ? (
            <div className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground shadow-lg">
              {deal.discount_percent}% OFF
            </div>
          ) : null}
          {days && (
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
              <Clock className="h-3 w-3" />
              {days}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <StoreIcon className="h-3 w-3" />
            <span className="font-medium text-foreground">{deal.store}</span>
            <span>·</span>
            {deal.is_online ? (
              <span className="flex items-center gap-1"><Globe className="h-3 w-3" />Online</span>
            ) : (
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{deal.city}</span>
            )}
          </div>
          <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition">
            {deal.title}
          </h3>
          <div className="mt-3">
            <Badge variant="secondary" className="text-xs">{deal.category}</Badge>
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggle(deal.id);
        }}
        aria-label={saved ? "Remove from saved" : "Save deal"}
        className={cn(
          "absolute bottom-3 right-3 rounded-full p-2 transition",
          saved ? "bg-primary text-primary-foreground" : "bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground"
        )}
      >
        <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
      </button>
    </article>
  );
}
