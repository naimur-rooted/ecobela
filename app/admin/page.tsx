'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useShop } from '@/context/ShopContext';
import { Product } from '@/types/product';
import { CategoryInfo } from '@/types/category';
import { UserOrder } from '@/types/user';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingBag, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  LogOut, 
  Sparkles, 
  X, 
  RefreshCcw,
  Tag,
  DollarSign,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminPage() {
  const { currentUser, logout, demoLogin } = useAuth();
  const { 
    products, 
    categories, 
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
    resetToDefaultData
  } = useShop();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders'>('dashboard');
  
  // Product Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Modal States
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);

  const [newSubcategoryMap, setNewSubcategoryMap] = useState<{ [catId: string]: string }>({});

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    oldPrice: '',
    category: 'Women',
    subCategory: 'Saree',
    subSubCategory: '',
    description: '',
    shortDescription: '',
    materials: '',
    careInstructions: '',
    imageUrl1: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
    imageUrl2: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
    inStock: true,
    featured: false,
    isNew: true,
    sku: '',
  });

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    heroImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    subcategories: '',
  });

  // Access Control Guard
  const isAdmin = currentUser?.role === 'admin' || currentUser?.email === 'admin@ecobela.com' || currentUser?.isAdmin;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-neutral-800 p-8 border border-neutral-700 rounded-sm text-center shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-normal mb-2 text-white">Ecobela Admin Portal</h1>
          <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
            Restricted Access. You must be authenticated as an Administrator to view this control panel.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => {
                demoLogin({
                  name: 'Ecobela Admin',
                  email: 'admin@ecobela.com',
                  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                  phone: '+880 1700-000000',
                  role: 'admin',
                });
              }}
              className="w-full py-3 bg-[#A67C1E] hover:bg-amber-600 text-white text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Login as Demo Admin</span>
            </button>

            <Link
              href="/login"
              className="w-full py-2.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-xs uppercase tracking-widest font-medium transition-all block text-center"
            >
              Go to Login Page
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-700 text-left text-[11px] font-mono text-neutral-400">
            <div>Seed Email: <span className="text-amber-400">admin@ecobela.com</span></div>
            <div>Seed Password: <span className="text-amber-400">admin123456</span></div>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.subCategory.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === 'all' ||
      p.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Form Handlers
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    const images = [productForm.imageUrl1, productForm.imageUrl2].filter(Boolean);

    addProduct({
      name: productForm.name,
      slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      price: parseFloat(productForm.price),
      oldPrice: productForm.oldPrice ? parseFloat(productForm.oldPrice) : undefined,
      category: productForm.category,
      subCategory: productForm.subCategory,
      subSubCategory: productForm.subSubCategory || undefined,
      description: productForm.description || 'Artisanal piece crafted by Ecobela master weavers.',
      shortDescription: productForm.shortDescription || productForm.name,
      materials: productForm.materials || '100% Handloom Natural Fabric',
      careInstructions: productForm.careInstructions || 'Dry clean only',
      images,
      colors: [{ name: 'Default Heritage', hex: '#111827' }],
      sizes: ['Standard Free Size'],
      inStock: productForm.inStock,
      featured: productForm.featured,
      isNew: productForm.isNew,
      sku: productForm.sku || `SKU-${Date.now().toString().slice(-6)}`,
      rating: 5.0,
      reviewsCount: 1,
    });

    setIsAddProductOpen(false);
    resetProductForm();
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: productForm.name,
      price: parseFloat(productForm.price),
      oldPrice: productForm.oldPrice ? parseFloat(productForm.oldPrice) : undefined,
      category: productForm.category,
      subCategory: productForm.subCategory,
      subSubCategory: productForm.subSubCategory || undefined,
      description: productForm.description,
      shortDescription: productForm.shortDescription,
      inStock: productForm.inStock,
      featured: productForm.featured,
      isNew: productForm.isNew,
      images: [productForm.imageUrl1, productForm.imageUrl2].filter(Boolean),
    });

    setEditingProduct(null);
    resetProductForm();
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      price: p.price.toString(),
      oldPrice: p.oldPrice ? p.oldPrice.toString() : '',
      category: p.category,
      subCategory: p.subCategory,
      subSubCategory: p.subSubCategory || '',
      description: p.description || '',
      shortDescription: p.shortDescription || '',
      materials: p.materials || '',
      careInstructions: p.careInstructions || '',
      imageUrl1: p.images[0] || '',
      imageUrl2: p.images[1] || '',
      inStock: p.inStock,
      featured: !!p.featured,
      isNew: !!p.isNew,
      sku: p.sku || '',
    });
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      oldPrice: '',
      category: 'Women',
      subCategory: 'Saree',
      subSubCategory: '',
      description: '',
      shortDescription: '',
      materials: '',
      careInstructions: '',
      imageUrl1: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      imageUrl2: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
      inStock: true,
      featured: false,
      isNew: true,
      sku: '',
    });
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) return;

    const subs = categoryForm.subcategories
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addCategory({
      name: categoryForm.name,
      slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: categoryForm.description || 'Artisanal collection celebrating Bengal craftsmanship.',
      heroImage: categoryForm.heroImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      subcategories: subs.length > 0 ? subs : ['General'],
    });

    setIsAddCategoryOpen(false);
    setCategoryForm({ name: '', slug: '', description: '', heroImage: '', subcategories: '' });
  };

  const handleAddSubcategoryInline = (catId: string) => {
    const subName = newSubcategoryMap[catId]?.trim();
    if (subName) {
      addSubcategory(catId, subName);
      setNewSubcategoryMap((prev) => ({ ...prev, [catId]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="bg-neutral-950 border-b border-neutral-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-neutral-400 hover:text-white flex items-center gap-1 text-xs uppercase tracking-wider font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront</span>
          </Link>
          <div className="h-5 w-px bg-neutral-800" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h1 className="font-serif text-lg text-white font-medium tracking-wide">
              Ecobela Master Admin
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (confirm('Reset store data back to original defaults?')) {
                resetToDefaultData();
              }
            }}
            className="text-[11px] text-neutral-400 hover:text-amber-400 flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xs cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset Store Data</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-neutral-300">{currentUser?.email}</span>
          </div>

          <button
            onClick={() => logout()}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-3 py-1.5 bg-rose-950/40 border border-rose-900/50 rounded-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <aside className="md:col-span-3 space-y-2">
          <div className="bg-neutral-950 p-4 border border-neutral-800 space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block px-3 mb-2">
              Management Portal
            </span>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customer Orders ({orders.length})</span>
            </button>
          </div>

          <div className="bg-neutral-950 p-4 border border-neutral-800 space-y-2 text-xs text-neutral-400">
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold block">
              ✨ Admin Dynamic Features
            </span>
            <p className="text-[11px] leading-relaxed">
              Adding or removing products automatically updates the dynamic hero image algorithm across category storefront pages!
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="md:col-span-9 space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-neutral-950 p-5 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="text-xs uppercase tracking-wider">Total Products</span>
                    <Package className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-serif text-3xl font-medium text-white">{products.length}</div>
                  <span className="text-[10px] text-emerald-400">Live in Store Catalog</span>
                </div>

                <div className="bg-neutral-950 p-5 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="text-xs uppercase tracking-wider">Categories</span>
                    <FolderTree className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-serif text-3xl font-medium text-white">{categories.length}</div>
                  <span className="text-[10px] text-neutral-400">Active Mother Categories</span>
                </div>

                <div className="bg-neutral-950 p-5 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="text-xs uppercase tracking-wider">Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-serif text-3xl font-medium text-white">{orders.length}</div>
                  <span className="text-[10px] text-emerald-400">Customer Orders</span>
                </div>

                <div className="bg-neutral-950 p-5 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="text-xs uppercase tracking-wider">Revenue</span>
                    <DollarSign className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-serif text-2xl font-medium text-white">BDT {totalRevenue.toLocaleString()}</div>
                  <span className="text-[10px] text-amber-400">Order Volume</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-neutral-950 p-6 border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg text-white">Store Inventory Controls</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Manage products, subcategories, and order statuses in real-time.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      resetProductForm();
                      setIsAddProductOpen(true);
                    }}
                    className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>

                  <button
                    onClick={() => setIsAddCategoryOpen(true)}
                    className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                  </button>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-neutral-950 p-6 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg text-white">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-amber-400 hover:underline font-medium"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px]">
                        <th className="pb-3 font-semibold">Order ID</th>
                        <th className="pb-3 font-semibold">Customer</th>
                        <th className="pb-3 font-semibold">Total</th>
                        <th className="pb-3 font-semibold">Payment</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-neutral-300">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-neutral-900/50">
                          <td className="py-3 font-mono font-medium text-white">{order.id}</td>
                          <td className="py-3">
                            <div className="font-medium text-white">{order.customerName}</div>
                            <div className="text-[10px] text-neutral-400">{order.customerEmail}</div>
                          </td>
                          <td className="py-3 font-medium text-white">BDT {order.total.toLocaleString()}</td>
                          <td className="py-3 text-neutral-400">{order.paymentMethod}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              order.status === 'Delivered' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                              order.status === 'Shipped' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                              order.status === 'Processing' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                              'bg-neutral-800 text-neutral-300'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Product Header & Filters */}
              <div className="bg-neutral-950 p-5 border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-[260px]">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search products by title, SKU, or subcategory..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-900 text-xs text-white border border-neutral-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="bg-neutral-900 text-xs text-neutral-200 border border-neutral-800 py-2 px-3 focus:outline-none"
                  >
                    <option value="all">All Categories ({categories.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    resetProductForm();
                    setIsAddProductOpen(true);
                  }}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-neutral-950 border border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 bg-neutral-900/80 text-neutral-400 uppercase tracking-wider text-[10px]">
                        <th className="p-4 font-semibold">Piece</th>
                        <th className="p-4 font-semibold">Category</th>
                        <th className="p-4 font-semibold">Subcategory</th>
                        <th className="p-4 font-semibold">Price</th>
                        <th className="p-4 font-semibold">Stock</th>
                        <th className="p-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-neutral-300">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-900/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-12 bg-neutral-900 shrink-0 border border-neutral-800 overflow-hidden">
                                {p.images[0] ? (
                                  <Image
                                    src={p.images[0]}
                                    alt={p.name}
                                    fill
                                    className="object-cover"
                                    sizes="40px"
                                  />
                                ) : (
                                  <ImageIcon className="w-4 h-4 m-auto text-neutral-600" />
                                )}
                              </div>
                              <div>
                                <div className="font-serif text-sm text-white font-medium line-clamp-1">{p.name}</div>
                                <div className="text-[10px] text-neutral-500 font-mono">SKU: {p.sku || p.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-amber-300">{p.category}</td>
                          <td className="p-4 text-neutral-300">{p.subCategory}</td>
                          <td className="p-4 font-mono font-medium text-white">
                            BDT {p.price.toLocaleString()}
                            {p.oldPrice && (
                              <span className="text-[10px] text-neutral-500 line-through ml-1">
                                BDT {p.oldPrice.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                              p.inStock ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}>
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => openEditProduct(p)}
                              className="p-1.5 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded-xs transition-colors cursor-pointer"
                              title="Edit Piece"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete product "${p.name}"?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-xs transition-colors cursor-pointer"
                              title="Delete Piece"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="p-8 text-center text-xs text-neutral-500 space-y-2">
                    <p>No products found matching your search term.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES & SUBCATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-neutral-950 p-5 border border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg text-white">Mother Categories & Subcategories</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Manage category names, hero banners, and active subcategories.</p>
                </div>

                <button
                  onClick={() => setIsAddCategoryOpen(true)}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-neutral-950 border border-neutral-800 p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                          <Image src={cat.heroImage} alt={cat.name} fill className="object-cover" sizes="48px" />
                        </div>
                        <div>
                          <h4 className="font-serif text-base text-white font-medium">{cat.name}</h4>
                          <span className="text-[10px] font-mono text-amber-400">slug: /{cat.slug}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Delete category "${cat.name}" and all its subcategories?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{cat.description}</p>

                    {/* Subcategories Tags */}
                    <div className="space-y-2 pt-2 border-t border-neutral-900">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                        Subcategories ({cat.subcategories.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.subcategories.map((sub) => (
                          <span
                            key={sub}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-200"
                          >
                            <span>{sub}</span>
                            <button
                              onClick={() => deleteSubcategory(cat.id, sub)}
                              className="text-neutral-500 hover:text-rose-400 cursor-pointer"
                              title="Remove Subcategory"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add Subcategory Inline Input */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="New subcategory name..."
                          value={newSubcategoryMap[cat.id] || ''}
                          onChange={(e) =>
                            setNewSubcategoryMap((prev) => ({ ...prev, [cat.id]: e.target.value }))
                          }
                          className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                        <button
                          onClick={() => handleAddSubcategoryInline(cat.id)}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-neutral-950 p-5 border border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg text-white">Customer Orders</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Track and update order fulfillment statuses.</p>
                </div>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-neutral-950 border border-neutral-800 p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-3">
                      <div>
                        <span className="font-mono text-base font-medium text-white">{order.id}</span>
                        <div className="text-[11px] text-neutral-400">Placed on {new Date(order.date).toLocaleDateString()}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-neutral-400 font-semibold uppercase">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as UserOrder['status'])}
                          className="bg-neutral-900 border border-neutral-700 text-xs text-amber-300 px-3 py-1.5 font-semibold focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer Info & Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-300">
                      <div>
                        <span className="text-[10px] uppercase text-neutral-500 font-semibold block mb-1">Customer Details</span>
                        <div className="font-medium text-white">{order.customerName}</div>
                        <div>Email: {order.customerEmail}</div>
                        <div>Phone: {order.customerPhone}</div>
                        <div className="mt-1 text-neutral-400">Address: {order.deliveryAddress}</div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase text-neutral-500 font-semibold block mb-1">Order Summary</span>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-neutral-300">
                              <span className="line-clamp-1">{item.quantity}x {item.name}</span>
                              <span className="font-mono font-medium text-white">BDT {item.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-neutral-800 flex justify-between font-medium text-sm text-white">
                          <span>Total Amount:</span>
                          <span className="text-amber-400">BDT {order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: Add / Edit Product */}
      {(isAddProductOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-950 border border-neutral-800 max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-serif text-xl text-white font-medium">
                {editingProduct ? 'Edit Creation Piece' : 'Add New Product Creation'}
              </h3>
              <button
                onClick={() => {
                  setIsAddProductOpen(false);
                  setEditingProduct(null);
                }}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingProduct ? handleEditProductSubmit : handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Product Title</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Dhakai Jamdani Handloom Saree — Royal Crimson"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Regular Price (BDT)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="18500"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Original Price (Old BDT)</label>
                  <input
                    type="number"
                    value={productForm.oldPrice}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
                    placeholder="22000"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Mother Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Subcategory</label>
                  <input
                    type="text"
                    required
                    value={productForm.subCategory}
                    onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                    placeholder="Saree / Panjabi / Decor"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Primary Image URL</label>
                <input
                  type="url"
                  required
                  value={productForm.imageUrl1}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl1: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Secondary Image URL (Optional)</label>
                <input
                  type="url"
                  value={productForm.imageUrl2}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl2: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detailed artisanal craft description..."
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span className="text-white font-medium">In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span className="text-white font-medium">Featured on Home</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddProductOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white uppercase tracking-wider font-semibold cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Category */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-950 border border-neutral-800 max-w-lg w-full p-6 space-y-6 my-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-serif text-xl text-white font-medium">Add Mother Category</h3>
              <button onClick={() => setIsAddCategoryOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Contemporary Pret"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Slug</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="e.g. contemporary-pret"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Hero Banner Image URL</label>
                <input
                  type="url"
                  value={categoryForm.heroImage}
                  onChange={(e) => setCategoryForm({ ...categoryForm, heroImage: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Subcategories (Comma Separated)</label>
                <input
                  type="text"
                  value={categoryForm.subcategories}
                  onChange={(e) => setCategoryForm({ ...categoryForm, subcategories: e.target.value })}
                  placeholder="e.g. Tunics, Fusion Tops, Blazers"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
