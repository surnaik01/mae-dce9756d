import { useEffect, useState } from "react";
import { CITIES, type City } from "@/lib/cities";

const KEY = "salespot.city";

export function useCity() {
  const [city, setCityState] = useState<City>("All India");

  useEffect(() => {
    const saved = localStorage.getItem(KEY) as City | null;
    if (saved && (CITIES as readonly string[]).includes(saved)) {
      setCityState(saved);
    }
  }, []);

  const setCity = (c: City) => {
    setCityState(c);
    localStorage.setItem(KEY, c);
  };

  return { city, setCity };
}

const SAVED_KEY = "salespot.saved";

export function useSavedDeals() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(SAVED_KEY);
    if (raw) {
      try {
        setSaved(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
  }, []);

  const toggle = (id: string) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isSaved = (id: string) => saved.includes(id);

  return { saved, toggle, isSaved };
}
