export const CITIES = [
  "All India",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
] as const;

export type City = (typeof CITIES)[number];

export const CATEGORIES = [
  "Online",
  "Fashion",
  "Grocery",
  "Electronics",
  "Beauty",
  "Festival",
  "Health",
  "Sports",
  "Jewellery",
  "Kids",
] as const;

export type Category = (typeof CATEGORIES)[number];
