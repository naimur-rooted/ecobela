export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  category: string; // e.g. "Women", "Men", "Kids", "Home Décor", "Jewellery"
  subCategory: string; // e.g. "Saree", "Panjabi", "Living"
  subSubCategory?: string; // e.g. "Jamdani", "Silk"
  description: string;
  shortDescription?: string;
  details?: string[];
  materials?: string;
  careInstructions?: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  inStock: boolean;
  featured?: boolean;
  isNew?: boolean;
  trending?: boolean;
  rating?: number;
  reviewsCount?: number;
  sku?: string;
  fabricOrigin?: string;
}

export type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high' | 'popular' | 'rating';

export interface FilterState {
  subCategory: string[];
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  inStockOnly: boolean;
}
