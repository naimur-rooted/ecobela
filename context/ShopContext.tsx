'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { CategoryInfo, NavCategory } from '@/types/category';
import { UserOrder } from '@/types/user';
import { productsData } from '@/data/products';
import { mainCategoriesData } from '@/data/categories';
import { navigationCategories } from '@/data/navigation';

interface ShopContextType {
  products: Product[];
  categories: CategoryInfo[];
  navigation: NavCategory[];
  orders: UserOrder[];
  addProduct: (productData: Omit<Product, 'id'> & { id?: string }) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (categoryData: Omit<CategoryInfo, 'id'> & { id?: string }) => void;
  updateCategory: (id: string, updates: Partial<CategoryInfo>) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (categoryId: string, subcategoryName: string) => void;
  deleteSubcategory: (categoryId: string, subcategoryName: string) => void;
  updateOrderStatus: (orderId: string, status: UserOrder['status']) => void;
  resetToDefaultData: () => void;
}

const PRODUCTS_KEY = 'ecobela_products';
const CATEGORIES_KEY = 'ecobela_categories';
const NAV_KEY = 'ecobela_navigation';
const ORDERS_KEY = 'ecobela_admin_orders';

const INITIAL_ORDERS: UserOrder[] = [
  {
    id: 'ORD-2026-9901',
    date: '2026-10-05T14:32:00.000Z',
    total: 28300,
    subtotal: 28300,
    deliveryCharge: 0,
    status: 'Processing',
    paymentMethod: 'bKash Online',
    itemsCount: 2,
    deliveryCity: 'Dhaka',
    customerName: 'Amina Rahman',
    customerEmail: 'amina.r@gmail.com',
    customerPhone: '+880 1712-345678',
    deliveryAddress: 'House 42, Road 11, Banani, Dhaka-1213',
    trackingNumber: 'EB-9901-TRK',
    courier: 'Paperfly Express',
    items: [
      {
        id: 'prod-w01',
        name: 'Dhakai Jamdani Handloom Saree — Midnight Gold',
        slug: 'dhakai-jamdani-handloom-saree-midnight-gold',
        price: 18500,
        quantity: 1,
        selectedColor: 'Midnight Navy & Gold',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'prod-m01',
        name: 'Rajshahi Mulberry Silk Panjabi — Imperial Ochre',
        slug: 'rajshahi-mulberry-silk-panjabi-imperial-ochre',
        price: 9800,
        quantity: 1,
        selectedColor: 'Imperial Ochre',
        selectedSize: '42',
        imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 'ORD-2026-9892',
    date: '2026-10-04T10:15:00.000Z',
    total: 11200,
    subtotal: 11200,
    deliveryCharge: 0,
    status: 'Shipped',
    paymentMethod: 'Credit Card',
    itemsCount: 1,
    deliveryCity: 'Chittagong',
    customerName: 'Tanvir Hossain',
    customerEmail: 'tanvir.h@yahoo.com',
    customerPhone: '+880 1819-876543',
    deliveryAddress: '78 GEC Circle, Nasirabad, Chittagong',
    trackingNumber: 'EB-9892-TRK',
    courier: 'Pathao Courier',
    items: [
      {
        id: 'prod-j01',
        name: 'Handcrafted Kundan & Pearl Heritage Choker Set',
        slug: 'handcrafted-kundan-pearl-heritage-choker-set',
        price: 11200,
        quantity: 1,
        selectedColor: 'Gold & Emerald',
        imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 'ORD-2026-9880',
    date: '2026-10-02T18:45:00.000Z',
    total: 4500,
    subtotal: 4500,
    deliveryCharge: 0,
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    itemsCount: 1,
    deliveryCity: 'Sylhet',
    customerName: 'Nusrat Jahan',
    customerEmail: 'nusrat.j@gmail.com',
    customerPhone: '+880 1711-889900',
    deliveryAddress: 'Zindabazar Point, House 14, Sylhet',
    trackingNumber: 'EB-9880-TRK',
    courier: 'Steadfast Courier',
    items: [
      {
        id: 'prod-k01',
        name: 'Kids Festive Brocade Panjabi & Pajama Set',
        slug: 'kids-festive-brocade-panjabi-pajama-set',
        price: 4500,
        quantity: 1,
        selectedColor: 'Royal Sapphire',
        selectedSize: '4-5 Yrs',
        imageUrl: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
];

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return productsData;
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : productsData;
    } catch {
      return productsData;
    }
  });

  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    if (typeof window === 'undefined') return mainCategoriesData;
    try {
      const saved = localStorage.getItem(CATEGORIES_KEY);
      return saved ? JSON.parse(saved) : mainCategoriesData;
    } catch {
      return mainCategoriesData;
    }
  });

  const [navigation, setNavigation] = useState<NavCategory[]>(() => {
    if (typeof window === 'undefined') return navigationCategories;
    try {
      const saved = localStorage.getItem(NAV_KEY);
      return saved ? JSON.parse(saved) : navigationCategories;
    } catch {
      return navigationCategories;
    }
  });

  const [orders, setOrders] = useState<UserOrder[]>(() => {
    if (typeof window === 'undefined') return INITIAL_ORDERS;
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(NAV_KEY, JSON.stringify(navigation));
    }
  }, [navigation]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  }, [orders]);

  const addProduct = (productData: Omit<Product, 'id'> & { id?: string }) => {
    const newProduct: Product = {
      ...productData,
      id: productData.id || `prod-${Date.now()}`,
      slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addCategory = (categoryData: Omit<CategoryInfo, 'id'> & { id?: string }) => {
    const newCategory: CategoryInfo = {
      ...categoryData,
      id: categoryData.id || categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<CategoryInfo>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id || c.slug === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id && c.slug !== id));
  };

  const addSubcategory = (categoryId: string, subcategoryName: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId || c.slug === categoryId) {
          if (!c.subcategories.includes(subcategoryName)) {
            return { ...c, subcategories: [...c.subcategories, subcategoryName] };
          }
        }
        return c;
      })
    );
  };

  const deleteSubcategory = (categoryId: string, subcategoryName: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId || c.slug === categoryId) {
          return {
            ...c,
            subcategories: c.subcategories.filter((s) => s !== subcategoryName),
          };
        }
        return c;
      })
    );
  };

  const updateOrderStatus = (orderId: string, status: UserOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const resetToDefaultData = () => {
    setProducts(productsData);
    setCategories(mainCategoriesData);
    setNavigation(navigationCategories);
    setOrders(INITIAL_ORDERS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PRODUCTS_KEY);
      localStorage.removeItem(CATEGORIES_KEY);
      localStorage.removeItem(NAV_KEY);
      localStorage.removeItem(ORDERS_KEY);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        navigation,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubcategory,
        deleteSubcategory,
        updateOrderStatus,
        resetToDefaultData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
