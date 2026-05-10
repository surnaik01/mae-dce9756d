import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Bookmark, MapPin, Clock, Tag, Globe } from "lucide-react";
import { getDealById } from "@/lib/deals.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSavedDeals } from "@/hooks/use-city";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/deals/$dealId")({
  component: DealDetailPage,
});

function DealDetailPage() {
  const { dealId } = Route.useParams();
  const fetch = useServerFn(getDealById);
  const { data, isLoading } = useQuery({
    queryKey: ["deal", dealId],
    queryFn: () => fetch({ data: { id: dealId } }),
  });
  const { isSaved, toggle } = useSavedDeals();

  if (isLoading) {
    return <div className="container mx-auto max-w-4xl px-4 py-16"><div className="h-96 rounded-2xl bg-muted animate-pulse" /></div>;
  }
  const deal = data?.deal;
  if (!deal) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Deal not found</h1>
        <p className="text-muted-foreground mt-2">It may have ended.</p>
        <Button asChild className="mt-6"><Link to="/deals">Browse all deals</Link></Button>
      </div>
    );
  }

  const saved = isSaved(deal.id);
  const days = deal.valid_until
    ? Math.max(0, Math.ceil((new Date(deal.valid_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Link to="/deals" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to deals
      </Link>

      <article className="overflow-hidden rounded-2xl bg-card border border-border [box-shadow:var(--shadow-card)]">
        <div className="relative aspect-[16/9] bg-muted">
          {deal.image_url && <img src={deal.image_url} alt={deal.title} className="h-full w-full object-cover" />}
          {deal.discount_percent && (
            <div className="absolute left-4 top-4 rounded-full bg-primary px-4 py-2 text-lg font-bold text-primary-foreground shadow-lg">
              {deal.discount_percent}% OFF
            </div>
          )}
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
            <Tag className="h-4 w-4" />
            <span className="font-medium text-foreground">{deal.store}</span>
            <span>·</span>
            <Badge variant="secondary">{deal.category}</Badge>
            {deal.is_online ? (
              <span className="flex items-center gap-1"><Globe className="h-3 w-3" />Online</span>
            ) : (
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{deal.city}</span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold leading-tight">{deal.title}</h1>

          {deal.description && (
            <p className="mt-4 text-muted-foreground leading-relaxed">{deal.description}</p>
          )}

          {days !== null && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              {days === 0 ? "Ends today" : `${days} day${days > 1 ? "s" : ""} left`}
              {deal.valid_until && (
                <span className="text-muted-foreground">· Until {new Date(deal.valid_until).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {deal.source_url && (
              <Button asChild size="lg">
                <a href={deal.source_url} target="_blank" rel="noopener noreferrer">
                  Go to {deal.store} <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            <Button
              size="lg"
              variant={saved ? "default" : "outline"}
              onClick={() => toggle(deal.id)}
              className={cn(saved && "bg-accent hover:bg-accent/90")}
            >
              <Bookmark className={cn("mr-2 h-4 w-4", saved && "fill-current")} />
              {saved ? "Saved" : "Save deal"}
            </Button>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            Always verify the offer on {deal.store}'s site before purchase. SaleSpot is not affiliated with the brand.
          </p>
        </div>
      </article>
    </div>
  );
}
