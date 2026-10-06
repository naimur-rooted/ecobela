import { UserOrder } from '@/types/user';

const ORDERS_STORAGE_KEY = 'ecobela_patron_orders';

export const sampleInitialOrders: UserOrder[] = [
  {
    id: 'ECO-ORD-982144',
    date: 'October 1, 2026',
    total: 18580,
    subtotal: 18500,
    deliveryCharge: 80,
    status: 'Delivered',
    paymentMethod: 'bKash Online',
    itemsCount: 1,
    deliveryCity: 'Dhaka',
    customerName: 'Nusrat Jahan',
    customerEmail: 'patron@ecobela.com',
    customerPhone: '+880 1711-234567',
    deliveryAddress: 'House 42, Road 11, Block D, Banani, Dhaka-1213',
    trackingNumber: 'ECO-EXP-772190',
    courier: 'Pathao Express Prime',
    estimatedDelivery: 'Delivered on Oct 3, 2026',
    items: [
      {
        id: 'prod-001',
        name: 'Dhakai Jamdani Handloom Saree — Midnight Gold',
        slug: 'dhakai-jamdani-handloom-saree-midnight-gold',
        price: 18500,
        quantity: 1,
        selectedColor: 'Midnight Gold',
        selectedSize: 'Standard 5.5m',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 'ECO-ORD-841920',
    date: 'September 15, 2026',
    total: 9800,
    subtotal: 9800,
    deliveryCharge: 0,
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    itemsCount: 1,
    deliveryCity: 'Dhaka',
    customerName: 'Nusrat Jahan',
    customerEmail: 'patron@ecobela.com',
    customerPhone: '+880 1711-234567',
    deliveryAddress: 'House 42, Road 11, Block D, Banani, Dhaka-1213',
    trackingNumber: 'ECO-EXP-551029',
    courier: 'RedX Express Logistics',
    estimatedDelivery: 'Delivered on Sep 18, 2026',
    items: [
      {
        id: 'prod-002',
        name: 'Rajshahi Mulberry Silk Panjabi — Imperial Ochre',
        slug: 'rajshahi-mulberry-silk-panjabi-imperial-ochre',
        price: 9800,
        quantity: 1,
        selectedColor: 'Imperial Ochre',
        selectedSize: '42',
        imageUrl: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 'ECO-ORD-620188',
    date: 'August 28, 2026',
    total: 12500,
    subtotal: 12500,
    deliveryCharge: 0,
    status: 'Delivered',
    paymentMethod: 'Visa / Mastercard',
    itemsCount: 2,
    deliveryCity: 'Dhaka',
    customerName: 'Nusrat Jahan',
    customerEmail: 'patron@ecobela.com',
    customerPhone: '+880 1711-234567',
    deliveryAddress: 'House 42, Road 11, Block D, Banani, Dhaka-1213',
    trackingNumber: 'ECO-EXP-319022',
    courier: 'Paperfly Doorstep',
    estimatedDelivery: 'Delivered on Aug 31, 2026',
    items: [
      {
        id: 'prod-007',
        name: 'Dhamrai Lost-Wax Brass Urli with Floral Petals',
        slug: 'dhamrai-lost-wax-brass-urli-floral-petals',
        price: 7500,
        quantity: 1,
        selectedColor: 'Antique Brass',
        selectedSize: 'Medium (12" dia)',
        imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'prod-009',
        name: 'Hand-Embroidered Nakshi Kantha Tapestry Throw',
        slug: 'hand-embroidered-nakshi-kantha-tapestry-throw',
        price: 5000,
        quantity: 1,
        selectedColor: 'Natural Indigo & Terracotta',
        selectedSize: 'Queen (90"x108")',
        imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
];

export function getStoredOrders(customerEmail?: string): UserOrder[] {
  if (typeof window === 'undefined') return [];
  const key = customerEmail ? `ecobela_orders_${customerEmail.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : 'ecobela_orders_guest';
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Orders read note:', err);
    return [];
  }
}

export function saveNewOrder(order: UserOrder, customerEmail?: string): UserOrder[] {
  if (typeof window === 'undefined') return [order];
  const email = customerEmail || order.customerEmail;
  const key = email ? `ecobela_orders_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : 'ecobela_orders_guest';
  try {
    const existing = getStoredOrders(email);
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Order save note:', err);
    return [order];
  }
}

export function createSampleAtelierOrder(customerName?: string, customerEmail?: string): UserOrder {
  const newOrder: UserOrder = {
    id: 'ECO-ORD-' + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    total: 24500,
    subtotal: 24500,
    deliveryCharge: 0,
    status: 'Processing',
    paymentMethod: 'bKash Online',
    itemsCount: 2,
    deliveryCity: 'Dhaka',
    customerName: customerName || 'Sahin Dev',
    customerEmail: customerEmail || 'sahin.dev1067@gmail.com',
    customerPhone: '+880 1711-234567',
    deliveryAddress: 'House 42, Road 11, Block D, Banani, Dhaka-1213',
    trackingNumber: 'ECO-EXP-' + Math.floor(100000 + Math.random() * 900000),
    courier: 'Pathao Express Prime',
    estimatedDelivery: 'Dispatched · Arriving in 2 Days',
    items: [
      {
        id: 'prod-001',
        name: 'Dhakai Jamdani Handloom Saree — Midnight Gold',
        slug: 'dhakai-jamdani-handloom-saree-midnight-gold',
        price: 18500,
        quantity: 1,
        selectedColor: 'Midnight Gold',
        selectedSize: 'Standard 5.5m',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'prod-009',
        name: 'Hand-Embroidered Nakshi Kantha Tapestry Throw',
        slug: 'hand-embroidered-nakshi-kantha-tapestry-throw',
        price: 6000,
        quantity: 1,
        selectedColor: 'Natural Indigo',
        selectedSize: 'Queen',
        imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
      },
    ],
  };

  saveNewOrder(newOrder);
  return newOrder;
}
