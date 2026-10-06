export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  area: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  imageUrl: string;
}

export interface UserOrder {
  id: string;
  date: string;
  total: number;
  subtotal: number;
  deliveryCharge: number;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  itemsCount: number;
  deliveryCity: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery?: string;
  items: OrderItem[];
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phone?: string | null;
  preferredCity?: string;
  addresses?: UserAddress[];
  orders?: UserOrder[];
  createdAt?: string;
  role?: 'admin' | 'customer';
  isAdmin?: boolean;
}
