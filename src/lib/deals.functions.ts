import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const filtersSchema = z.object({
  city: z.string().optional(),
  category: z.string().optional(),
  store: z.string().optional(),
  search: z.string().optional(),
  isOnline: z.boolean().optional(),
  sort: z.enum(["newest", "ending", "discount"]).optional(),
  limit: z.number().min(1).max(100).optional(),
}).optional();

export const getDeals = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => filtersSchema.parse(d))
  .handler(async ({ data }) => {
    const f = data ?? {};
    let q = supabaseAdmin.from("deals").select("*");

    if (f.city && f.city !== "All India") {
      q = q.or(`city.eq.${f.city},city.eq.All India`);
    }
    if (f.category) q = q.eq("category", f.category);
    if (f.store) q = q.eq("store", f.store);
    if (typeof f.isOnline === "boolean") q = q.eq("is_online", f.isOnline);
    if (f.search) q = q.or(`title.ilike.%${f.search}%,description.ilike.%${f.search}%,store.ilike.%${f.search}%`);

    const sort = f.sort ?? "newest";
    if (sort === "newest") q = q.order("created_at", { ascending: false });
    if (sort === "ending") q = q.order("valid_until", { ascending: true, nullsFirst: false });
    if (sort === "discount") q = q.order("discount_percent", { ascending: false, nullsFirst: false });

    q = q.limit(f.limit ?? 60);
    const { data: deals, error } = await q;
    if (error) {
      console.error("getDeals error", error);
      return { deals: [], error: error.message };
    }
    return { deals: deals ?? [], error: null };
  });

export const getDealById = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { data: deal, error } = await supabaseAdmin
      .from("deals")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) {
      console.error("getDealById error", error);
      return { deal: null, error: error.message };
    }
    return { deal, error: null };
  });

export const getStores = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("deals")
      .select("store")
      .limit(1000);
    if (error || !data) return { stores: [] as { name: string; count: number }[] };
    const counts = new Map<string, number>();
    for (const r of data) counts.set(r.store, (counts.get(r.store) ?? 0) + 1);
    return {
      stores: Array.from(counts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    };
  });

export const getDealsByIds = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ ids: z.array(z.string().uuid()).max(200) }).parse(d))
  .handler(async ({ data }) => {
    if (data.ids.length === 0) return { deals: [] };
    const { data: deals, error } = await supabaseAdmin
      .from("deals")
      .select("*")
      .in("id", data.ids);
    if (error) {
      console.error(error);
      return { deals: [] };
    }
    return { deals: deals ?? [] };
  });
