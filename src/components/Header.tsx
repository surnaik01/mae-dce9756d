import { Link } from "@tanstack/react-router";
import { Tag, MapPin } from "lucide-react";
import { CITIES } from "@/lib/cities";
import { useCity } from "@/hooks/use-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Header() {
  const { city, setCity } = useCity();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
            <Tag className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">SaleSpot</span>
          <span className="text-xs font-medium text-muted-foreground hidden sm:inline">India</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }} className="text-foreground/80 hover:text-primary transition">
            Home
          </Link>
          <Link to="/deals" activeProps={{ className: "text-primary" }} className="text-foreground/80 hover:text-primary transition">
            All Deals
          </Link>
          <Link to="/stores" activeProps={{ className: "text-primary" }} className="text-foreground/80 hover:text-primary transition">
            Stores
          </Link>
          <Link to="/saved" activeProps={{ className: "text-primary" }} className="text-foreground/80 hover:text-primary transition">
            Saved
          </Link>
          <Link to="/about" activeProps={{ className: "text-primary" }} className="text-foreground/80 hover:text-primary transition">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary hidden sm:block" />
          <Select value={city} onValueChange={(v) => setCity(v as (typeof CITIES)[number])}>
            <SelectTrigger className="w-[140px] h-9 border-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
