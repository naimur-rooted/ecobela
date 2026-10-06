import { Product } from './product';

export interface CartItem {
  id: string; // composite key: `${product.id}-${selectedColor}-${selectedSize}`
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}
