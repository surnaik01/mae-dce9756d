
CREATE TABLE public.deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  store TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'All India',
  discount_percent INTEGER,
  original_price NUMERIC,
  sale_price NUMERIC,
  image_url TEXT,
  source_url TEXT,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  is_online BOOLEAN NOT NULL DEFAULT true,
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_deals_city ON public.deals(city);
CREATE INDEX idx_deals_category ON public.deals(category);
CREATE INDEX idx_deals_valid_until ON public.deals(valid_until);
CREATE INDEX idx_deals_created_at ON public.deals(created_at DESC);

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deals are publicly viewable"
  ON public.deals FOR SELECT
  USING (true);

-- Seed data
INSERT INTO public.deals (title, description, store, category, city, discount_percent, original_price, sale_price, image_url, source_url, valid_until, is_online, source) VALUES
('Great Indian Festival - Up to 80% off Electronics', 'Massive discounts on smartphones, laptops, TVs and home appliances', 'Amazon India', 'Online', 'All India', 80, NULL, NULL, 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800', 'https://www.amazon.in/deals', now() + interval '14 days', true, 'seed'),
('Big Billion Days - Smartphones from ₹4,999', 'Top brands at lowest prices ever. Bank offers and exchange bonus available', 'Flipkart', 'Online', 'All India', 70, NULL, NULL, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', 'https://www.flipkart.com', now() + interval '10 days', true, 'seed'),
('End of Reason Sale - Flat 50-80% off Fashion', 'Brands like Levis, Puma, Nike, H&M and more', 'Myntra', 'Fashion', 'All India', 80, NULL, NULL, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', 'https://www.myntra.com', now() + interval '7 days', true, 'seed'),
('Weekly Bachat - Groceries up to 40% off', 'Atta, oil, pulses, cleaning supplies and personal care at lowest prices', 'DMart', 'Grocery', 'Mumbai', 40, NULL, NULL, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', 'https://www.dmart.in', now() + interval '5 days', false, 'seed'),
('Buy 1 Get 1 Free on Westside ethnic wear', 'Diwali special on kurtas, sarees and lehengas', 'Westside', 'Fashion', 'Delhi', 50, NULL, NULL, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', 'https://www.westside.com', now() + interval '12 days', false, 'seed'),
('Reliance Smart Bazaar - Fresh fruits at ₹49/kg', 'Daily essentials and fresh produce at unbeatable prices', 'Reliance Smart', 'Grocery', 'Bangalore', 30, NULL, NULL, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', 'https://www.relianceretail.com', now() + interval '3 days', false, 'seed'),
('Diwali Dhamaka - Up to 60% off home appliances', 'Microwaves, refrigerators, washing machines from top brands', 'Croma', 'Electronics', 'All India', 60, NULL, NULL, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', 'https://www.croma.com', now() + interval '20 days', true, 'seed'),
('Tata CLiQ Diwali Sale - Min 40% off everything', 'Fashion, electronics, home and luxury combined', 'Tata CLiQ', 'Online', 'All India', 50, NULL, NULL, 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800', 'https://www.tatacliq.com', now() + interval '15 days', true, 'seed'),
('Nykaa Pink Friday Sale - Up to 50% off beauty', 'Lipsticks, skincare, fragrances from premium brands', 'Nykaa', 'Beauty', 'All India', 50, NULL, NULL, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800', 'https://www.nykaa.com', now() + interval '6 days', true, 'seed'),
('Lifestyle Stores - End of Season clearance 70% off', 'Apparel, footwear, accessories', 'Lifestyle', 'Fashion', 'Hyderabad', 70, NULL, NULL, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', 'https://www.lifestylestores.com', now() + interval '8 days', false, 'seed'),
('Pantaloons Festive Bonanza - Buy 2 Get 2', 'Across all brands and categories', 'Pantaloons', 'Fashion', 'Pune', 50, NULL, NULL, 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800', 'https://www.pantaloons.com', now() + interval '11 days', false, 'seed'),
('Spencer''s Hyper - Daily essentials at lowest prices', 'Weekly offers on staples, personal care and household', 'Spencer''s', 'Grocery', 'Kolkata', 35, NULL, NULL, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', 'https://www.spencers.in', now() + interval '4 days', false, 'seed'),
('AJIO Big Bold Sale - Min 50% off + extra 10%', 'Brands across western, ethnic, sportswear', 'AJIO', 'Fashion', 'All India', 60, NULL, NULL, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', 'https://www.ajio.com', now() + interval '9 days', true, 'seed'),
('BigBasket Smart Basket - Combo offers up to 45% off', 'Monthly grocery essentials and fresh produce', 'BigBasket', 'Grocery', 'All India', 45, NULL, NULL, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', 'https://www.bigbasket.com', now() + interval '7 days', true, 'seed'),
('Apollo Pharmacy - Flat 25% off medicines + free delivery', 'On all prescription and OTC medicines', 'Apollo Pharmacy', 'Health', 'All India', 25, NULL, NULL, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800', 'https://www.apollopharmacy.in', now() + interval '30 days', true, 'seed'),
('Phoenix Marketcity weekend sale - up to 60% off', 'All brands at the mall - Mumbai, Bangalore, Pune', 'Phoenix Marketcity', 'Festival', 'Mumbai', 60, NULL, NULL, 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=800', 'https://www.phoenixmarketcity.com', now() + interval '2 days', false, 'seed'),
('Shoppers Stop First Citizen Sale - Extra 20% off', 'Members-only fashion and beauty discounts', 'Shoppers Stop', 'Fashion', 'Chennai', 40, NULL, NULL, 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800', 'https://www.shoppersstop.com', now() + interval '6 days', false, 'seed'),
('Decathlon Sports Sale - Flat 30% off select gear', 'Cricket, football, fitness and outdoor gear', 'Decathlon', 'Sports', 'All India', 30, NULL, NULL, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800', 'https://www.decathlon.in', now() + interval '15 days', true, 'seed'),
('Tanishq Diwali Collection - 25% off making charges', 'Gold and diamond jewellery festive collection', 'Tanishq', 'Jewellery', 'All India', 25, NULL, NULL, 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800', 'https://www.tanishq.co.in', now() + interval '20 days', false, 'seed'),
('FirstCry Mega Sale - Up to 70% off baby & kids', 'Clothing, toys, baby essentials', 'FirstCry', 'Kids', 'All India', 70, NULL, NULL, 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800', 'https://www.firstcry.com', now() + interval '10 days', true, 'seed');
