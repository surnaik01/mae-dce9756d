import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 mt-20">
      <div className="container mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <h3 className="font-bold text-base mb-2">SaleSpot India</h3>
          <p className="text-muted-foreground">
            Every sale, deal and discount across India — gathered in one place and refreshed daily.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Explore</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li><Link to="/deals" className="hover:text-primary">All deals</Link></li>
            <li><Link to="/stores" className="hover:text-primary">Stores</Link></li>
            <li><Link to="/saved" className="hover:text-primary">Saved deals</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Note</h4>
          <p className="text-muted-foreground">
            Always verify offers on the retailer's site before purchase. SaleSpot is not affiliated with the listed brands.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SaleSpot India · Made for smart shoppers
      </div>
    </footer>
  );
}
