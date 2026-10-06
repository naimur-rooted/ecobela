'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { formatBDT } from '@/lib/utils';
import { getStoredOrders, createSampleAtelierOrder } from '@/lib/orders';
import { productsData } from '@/data/products';
import { UserOrder } from '@/types/user';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  LogOut, 
  ShoppingBag, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Truck,
  Printer,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Edit3,
  Camera,
  Check,
  Plus,
  X,
  Copy,
  Clock
} from 'lucide-react';

const AVATAR_PRESETS = [
  { label: 'Artisan Patron (Portrait 1)', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' },
  { label: 'Bengal Couture (Portrait 2)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { label: 'Heritage Weave (Portrait 3)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  { label: 'Atelier Collector (Portrait 4)', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
];

export default function AccountPage() {
  const router = useRouter();
  const { currentUser, loading, logout, updateUserProfile } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart, openCartDrawer } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'wishlist' | 'addresses'>('orders');
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [orderFilter, setOrderFilter] = useState<'all' | 'processing' | 'delivered'>('all');

  useEffect(() => {
    if (currentUser?.email) {
      setOrders(getStoredOrders(currentUser.email));
    } else {
      setOrders([]);
    }
  }, [currentUser?.email]);
  
  // Profile edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(() => currentUser?.displayName || '');
  const [editPhone, setEditPhone] = useState(() => currentUser?.phone || '+880 1711-234567');
  const [editPhotoUrl, setEditPhotoUrl] = useState(() => currentUser?.photoURL || '');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Modal states for Tracking and Invoice
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<UserOrder | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<UserOrder | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Authentication protection: redirect if unauthenticated after loading finishes
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login?redirect=/account');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-500 uppercase tracking-widest font-sans">
            Loading Patron Atelier Profile...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect via useEffect
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      displayName: editName,
      phone: editPhone,
      photoURL: editPhotoUrl,
    });
    setIsEditingProfile(false);
    setShowAvatarPicker(false);
    setProfileSuccessMsg('Profile information updated successfully!');
    setTimeout(() => setProfileSuccessMsg(null), 3500);
  };

  const handleSelectPresetAvatar = async (url: string) => {
    setEditPhotoUrl(url);
    await updateUserProfile({ photoURL: url });
    setShowAvatarPicker(false);
    setProfileSuccessMsg('Profile picture updated successfully!');
    setTimeout(() => setProfileSuccessMsg(null), 3500);
  };

  const handleAddSampleOrder = () => {
    const created = createSampleAtelierOrder(currentUser.displayName || 'Patron', currentUser.email || 'patron@ecobela.com');
    setOrders((prev) => [created, ...prev.filter((o) => o.id !== created.id)]);
    setActiveTab('orders');
    setProfileSuccessMsg('New sample artisan order placed and added to your archives!');
    setTimeout(() => setProfileSuccessMsg(null), 3500);
  };

  const handleReorder = (order: UserOrder) => {
    order.items.forEach((item) => {
      // Find corresponding product in productsData or fallback
      const foundProduct = productsData.find((p) => p.id === item.id || p.slug === item.slug) || {
        id: item.id,
        name: item.name,
        slug: item.slug,
        category: 'Women',
        subCategory: 'Heritage Handloom',
        price: item.price,
        images: [item.imageUrl],
        colors: [{ name: item.selectedColor || 'Standard', hex: '#1A1A1A' }],
        sizes: [item.selectedSize || 'Standard'],
        description: 'Authentic handcrafted Bangladeshi artisanal piece.',
        inStock: true,
        isNew: false,
        featured: true,
        trending: false,
      };

      addToCart(foundProduct, item.quantity, item.selectedColor, item.selectedSize);
    });

    openCartDrawer();
  };

  const handleCopyOrderId = (id: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(id);
      setCopiedOrderId(id);
      setTimeout(() => setCopiedOrderId(null), 2000);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (orderFilter === 'processing') return ord.status === 'Processing' || ord.status === 'Pending' || ord.status === 'Confirmed' || ord.status === 'Shipped';
    if (orderFilter === 'delivered') return ord.status === 'Delivered';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'Patron Account' }]} />

        {/* Success Alert */}
        {profileSuccessMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{profileSuccessMsg}</span>
            </div>
            <button type="button" onClick={() => setProfileSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-950">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Account Header Hero: User Photo, Name, Email, Tier */}
        <div className="bg-white border border-neutral-200 p-6 sm:p-8 mt-3 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* User Profile Picture with quick edit hover */}
            <div className="relative group shrink-0">
              <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden bg-neutral-100 border-2 border-[#A67C1E]/50 shadow-xs">
                {currentUser.photoURL ? (
                  <Image
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Patron'}
                    fill
                    className="object-cover"
                    sizes="88px"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-[#D4AF37] font-serif text-3xl font-light">
                    {currentUser.displayName?.charAt(0) || 'P'}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute bottom-0 right-0 p-1.5 bg-neutral-900 hover:bg-[#A67C1E] text-white rounded-full shadow-md transition-colors"
                title="Change Profile Photo"
                aria-label="Change Profile Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#A67C1E] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#A67C1E]" />
                  Verified Atelier Patron
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-neutral-900 font-normal mt-0.5 tracking-tight">
                {currentUser.displayName || 'Esteemed Patron'}
              </h1>
              
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-neutral-600 font-sans mt-1">
                <span className="flex items-center gap-1.5 font-medium text-neutral-800">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  {currentUser.email}
                </span>
                <span className="text-neutral-300 hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5 text-neutral-500">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  {currentUser.phone || '+880 1711-234567'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
            <button
              type="button"
              onClick={() => {
                setActiveTab('profile');
                setIsEditingProfile(true);
              }}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:border-neutral-900 hover:text-neutral-950 text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Avatar Preset Modal Drawer (toggleable) */}
        {showAvatarPicker && (
          <div className="bg-white border border-neutral-200 p-5 mt-3 shadow-md animate-in fade-in">
            <div className="flex items-center justify-between mb-3 border-b border-neutral-100 pb-2">
              <div>
                <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                  Choose Patron Profile Avatar
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Select an authentic high-resolution Bengali couture portrait or enter an image link below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(false)}
                className="text-neutral-400 hover:text-neutral-800 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPresetAvatar(preset.url)}
                  className={`p-2 border text-left flex items-center gap-3 transition-all ${
                    currentUser.photoURL === preset.url
                      ? 'border-[#A67C1E] bg-[#FAF8F5] ring-1 ring-[#A67C1E]'
                      : 'border-neutral-200 hover:border-neutral-900 bg-white'
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-neutral-200">
                    <Image
                      src={preset.url}
                      alt={preset.label}
                      fill
                      className="object-cover"
                      sizes="48px"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-[11px] leading-tight">
                    <span className="font-semibold text-neutral-900 block">{preset.label.split('(')[0]}</span>
                    <span className="text-[10px] text-neutral-500">Click to apply</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-col sm:flex-row items-center gap-2">
              <input
                type="url"
                value={editPhotoUrl}
                onChange={(e) => setEditPhotoUrl(e.target.value)}
                placeholder="Or paste any custom image URL (https://...)"
                className="w-full sm:flex-1 px-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900"
              />
              <button
                type="button"
                onClick={() => handleSelectPresetAvatar(editPhotoUrl)}
                disabled={!editPhotoUrl}
                className="w-full sm:w-auto px-4 py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider font-medium disabled:opacity-50 hover:bg-neutral-800"
              >
                Save Custom URL
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-1">
            <div className="bg-white border border-neutral-200 p-2 divide-y divide-neutral-100 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>Order Archives ({orders.length})</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>Patron Profile</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('wishlist')}
                className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'wishlist'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4" />
                  <span>Saved Wishlist ({wishlistItems.length})</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'addresses'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  <span>Delivery Addresses</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>

            {/* Concierge Assistance Card */}
            <div className="bg-[#FAF8F5] border border-neutral-200 p-4 mt-4 text-xs text-neutral-600 space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-900 block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A67C1E]" />
                Atelier Concierge Hotline
              </span>
              <p className="text-[11px] leading-relaxed">
                Need bespoke tailoring, bridal measurements, or order status assistance? Connect directly with our Dhaka master drape specialists.
              </p>
              <div className="text-xs font-semibold text-amber-900 pt-1 font-mono">
                +880 9612-445566 (10 AM — 9 PM)
              </div>
            </div>
          </div>

          {/* Active Tab Panel Content */}
          <div className="lg:col-span-9 bg-white border border-neutral-200 p-6 sm:p-8 shadow-xs">
            {/* TAB 1: ORDERS (ki ki order korse, details, reorder, tracking, invoice) */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl text-neutral-900 font-normal">
                      Order Archives & Acquisitions
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Review all items ordered, shipment status, delivery timelines, and official invoices.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddSampleOrder}
                      className="px-3.5 py-1.5 bg-[#FAF8F5] border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-[11px] uppercase tracking-wider font-medium flex items-center gap-1 transition-colors"
                      title="Place another sample order to test"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#A67C1E]" />
                      <span>Add Test Order</span>
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 border-b border-neutral-100 pb-2">
                  <button
                    type="button"
                    onClick={() => setOrderFilter('all')}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                      orderFilter === 'all'
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    All Orders ({orders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderFilter('processing')}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                      orderFilter === 'processing'
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    Processing / Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderFilter('delivered')}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                      orderFilter === 'delivered'
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    Delivered
                  </button>
                </div>

                {/* Empty State */}
                {filteredOrders.length === 0 ? (
                  <div className="py-16 text-center text-xs text-neutral-500 border border-dashed border-neutral-200 space-y-3">
                    <Package className="w-10 h-10 text-neutral-300 mx-auto" />
                    <div>
                      <p className="font-medium text-neutral-800 text-sm">No orders found in this archive filter</p>
                      <p className="text-neutral-500 mt-0.5">Explore our Jamdani sarees, royal panjabis, and home heirlooms.</p>
                    </div>
                    <div className="pt-2 flex justify-center gap-3">
                      <Link
                        href="/women"
                        className="px-5 py-2.5 bg-neutral-900 text-white uppercase tracking-wider text-[11px] font-medium"
                      >
                        Explore Ateliers
                      </Link>
                      <button
                        type="button"
                        onClick={handleAddSampleOrder}
                        className="px-5 py-2.5 border border-neutral-300 text-neutral-800 uppercase tracking-wider text-[11px] font-medium hover:border-neutral-900"
                      >
                        Create Test Order
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="border border-neutral-200 bg-white shadow-2xs divide-y divide-neutral-100"
                      >
                        {/* Order Header */}
                        <div className="p-4 sm:p-5 bg-[#FAF8F5] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-neutral-900 text-sm">
                                #{ord.id}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyOrderId(ord.id)}
                                className="text-neutral-400 hover:text-neutral-800 p-0.5"
                                title="Copy Order ID"
                              >
                                {copiedOrderId === ord.id ? (
                                  <span className="text-[10px] text-emerald-700 font-medium">Copied!</span>
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <span
                                className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                  ord.status === 'Delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : ord.status === 'Processing'
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-blue-100 text-blue-900'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-neutral-500 text-[11px]">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-neutral-400" />
                                Placed on {ord.date}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Truck className="w-3 h-3 text-neutral-400" />
                                {ord.courier || 'Pathao Express Prime'}
                              </span>
                              <span>•</span>
                              <span className="font-medium text-neutral-700">
                                {ord.paymentMethod}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center md:items-end justify-between md:justify-end gap-4">
                            <div className="text-right">
                              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                                Grand Total Paid
                              </span>
                              <span className="font-mono text-base font-bold text-neutral-950">
                                {formatBDT(ord.total)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Order Timeline Visual Stepper */}
                        <div className="px-4 py-3 bg-neutral-50/70 border-b border-neutral-100">
                          <div className="flex items-center justify-between max-w-xl mx-auto text-[10px] text-neutral-600">
                            <div className="flex flex-col items-center gap-1 text-emerald-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span className="font-semibold">Confirmed</span>
                            </div>
                            <div className="flex-1 h-[2px] bg-emerald-500 mx-2" />
                            <div className="flex flex-col items-center gap-1 text-emerald-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span className="font-semibold">Atelier Picked</span>
                            </div>
                            <div className={`flex-1 h-[2px] mx-2 ${ord.status === 'Delivered' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                            <div className={`flex flex-col items-center gap-1 ${ord.status === 'Delivered' ? 'text-emerald-700' : 'text-amber-800'}`}>
                              <Truck className="w-4 h-4" />
                              <span className="font-semibold">In Transit</span>
                            </div>
                            <div className={`flex-1 h-[2px] mx-2 ${ord.status === 'Delivered' ? 'bg-emerald-500' : 'bg-neutral-200'}`} />
                            <div className={`flex flex-col items-center gap-1 ${ord.status === 'Delivered' ? 'text-emerald-700 font-semibold' : 'text-neutral-400'}`}>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Delivered</span>
                            </div>
                          </div>
                        </div>

                        {/* Ordered Items List ("ki ki order korse") */}
                        <div className="p-4 sm:p-5 space-y-4">
                          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 block">
                            Acquisition Items Breakdown ({ord.items.length} {ord.items.length === 1 ? 'Piece' : 'Pieces'})
                          </span>

                          <div className="divide-y divide-neutral-100">
                            {ord.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  <div className="relative w-14 h-18 sm:w-16 sm:h-20 bg-neutral-100 border border-neutral-200 shrink-0 overflow-hidden">
                                    <Image
                                      src={item.imageUrl}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                      sizes="64px"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    <Link
                                      href={`/product/${item.slug}`}
                                      className="font-serif text-sm sm:text-base text-neutral-900 font-medium hover:text-amber-900 transition-colors line-clamp-1 flex items-center gap-1"
                                    >
                                      <span>{item.name}</span>
                                      <ExternalLink className="w-3 h-3 text-neutral-400 shrink-0" />
                                    </Link>

                                    <div className="flex flex-wrap items-center gap-x-3 text-xs text-neutral-500 mt-1">
                                      {item.selectedColor && (
                                        <span>Color: <strong className="text-neutral-800 font-medium">{item.selectedColor}</strong></span>
                                      )}
                                      {item.selectedSize && (
                                        <span>Size: <strong className="text-neutral-800 font-medium">{item.selectedSize}</strong></span>
                                      )}
                                      <span>Qty: <strong className="text-neutral-800 font-medium">{item.quantity}</strong></span>
                                    </div>

                                    <div className="font-mono text-xs text-neutral-800 font-medium mt-1">
                                      {formatBDT(item.price)} each
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="font-mono font-bold text-neutral-950 text-sm">
                                    {formatBDT(item.price * item.quantity)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Footer Actions & Shipping Destination */}
                        <div className="p-4 sm:p-5 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-neutral-100">
                          <div className="text-[11px] text-neutral-600 space-y-0.5">
                            <span className="text-neutral-400 uppercase tracking-wider block text-[10px]">
                              Delivery Destination
                            </span>
                            <p className="font-medium text-neutral-900">
                              {ord.deliveryAddress || 'House 42, Road 11, Banani, Dhaka'}
                            </p>
                            <p className="text-neutral-500">
                              Recipient: {ord.customerName || currentUser.displayName} ({ord.customerPhone || currentUser.phone || '+880 1711-234567'})
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                            <button
                              type="button"
                              onClick={() => setSelectedOrderForTracking(ord)}
                              className="px-3 py-2 bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-[11px] uppercase tracking-wider font-medium transition-colors flex items-center gap-1.5"
                            >
                              <Truck className="w-3.5 h-3.5 text-neutral-600" />
                              <span>Track Courier</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedOrderForInvoice(ord)}
                              className="px-3 py-2 bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-[11px] uppercase tracking-wider font-medium transition-colors flex items-center gap-1.5"
                            >
                              <Printer className="w-3.5 h-3.5 text-neutral-600" />
                              <span>View Invoice</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReorder(ord)}
                              className="px-3.5 py-2 bg-neutral-900 hover:bg-[#A67C1E] text-white text-[11px] uppercase tracking-wider font-medium transition-colors flex items-center gap-1.5"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Buy Again</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PROFILE DETAILS */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl text-neutral-900 font-normal">
                      Patron Profile Credentials
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Personal identification, email credentials, and concierge tier status.
                    </p>
                  </div>

                  {!isEditingProfile && (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="px-3.5 py-1.5 bg-neutral-900 text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold block mb-1">
                          Full Patron Name
                        </label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="e.g. Sahin Dev"
                          className="w-full px-3 py-2.5 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-neutral-50 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold block mb-1">
                          Registered Phone
                        </label>
                        <input
                          type="text"
                          required
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="+880 1711-234567"
                          className="w-full px-3 py-2.5 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-neutral-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold block">
                          Profile Avatar Photo URL
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowAvatarPicker(true)}
                          className="text-[11px] text-[#A67C1E] font-medium hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Choose from Curated Bengali Avatars</span>
                        </button>
                      </div>
                      <input
                        type="url"
                        value={editPhotoUrl}
                        onChange={(e) => setEditPhotoUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2.5 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-neutral-50 focus:bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors"
                      >
                        Save Profile Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-5 py-2.5 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider font-medium hover:border-neutral-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                    <div className="p-4 bg-neutral-50 border border-neutral-200">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                        Full Name
                      </span>
                      <span className="text-sm font-medium text-neutral-900 mt-1 block">
                        {currentUser.displayName || 'Not Provided'}
                      </span>
                    </div>

                    <div className="p-4 bg-neutral-50 border border-neutral-200">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold flex items-center justify-between">
                        <span>Email Address</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 uppercase font-medium">Verified</span>
                      </span>
                      <span className="text-sm font-medium text-neutral-900 mt-1 block">
                        {currentUser.email}
                      </span>
                    </div>

                    <div className="p-4 bg-neutral-50 border border-neutral-200">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                        Registered Phone
                      </span>
                      <span className="text-sm font-medium text-neutral-900 mt-1 block">
                        {currentUser.phone || '+880 1711-234567'}
                      </span>
                    </div>

                    <div className="p-4 bg-neutral-50 border border-neutral-200">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                        Patron Tier
                      </span>
                      <span className="text-sm font-medium text-[#A67C1E] mt-1 block flex items-center gap-1 font-serif">
                        <Sparkles className="w-3.5 h-3.5 text-[#A67C1E]" />
                        Privileged Heritage Circle
                      </span>
                    </div>
                  </div>
                )}

                {/* Account Security & Synchronisation */}
                <div className="p-4 border border-amber-900/20 bg-[#FAF8F5] text-xs text-neutral-700 flex items-start gap-3 mt-6">
                  <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-neutral-900">Verified Patron Authentication</h4>
                    <p className="mt-1 text-[11px] leading-relaxed text-neutral-600">
                      Your identity credentials, saved wishlist pieces, and delivery addresses are encrypted and bound to your verified Ecobela profile ({currentUser.email}).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-serif text-2xl text-neutral-900 font-normal">
                    Saved Heirlooms ({wishlistItems.length})
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Artisanal creations curated for upcoming festivities and bridal ceremonies.
                  </p>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="py-14 text-center text-xs text-neutral-500 border border-dashed border-neutral-200 space-y-3">
                    <Heart className="w-8 h-8 text-neutral-300 mx-auto" />
                    <p>No pieces currently saved in your wishlist.</p>
                    <Link
                      href="/women"
                      className="inline-block px-5 py-2.5 bg-neutral-900 text-white uppercase tracking-wider text-[11px] font-medium"
                    >
                      Explore Jamdani & Silk Collections
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {wishlistItems.map((prod) => (
                      <div key={prod.id} className="border border-neutral-200 p-3 space-y-2.5 bg-white shadow-2xs">
                        <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden">
                          <Image
                            src={prod.images[0]}
                            alt={prod.name}
                            fill
                            className="object-cover"
                            sizes="200px"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <h4 className="font-serif text-xs text-neutral-900 truncate font-medium">
                          {prod.name}
                        </h4>
                        <div className="font-mono text-xs font-semibold text-neutral-900">
                          {formatBDT(prod.price)}
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => addToCart(prod, 1, prod.colors[0]?.name, prod.sizes[0])}
                            className="flex-1 py-2 bg-neutral-900 text-white text-[10px] uppercase tracking-wider font-semibold hover:bg-neutral-800"
                          >
                            Add to Bag
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(prod.id)}
                            className="px-3 py-2 border border-neutral-300 text-neutral-600 hover:text-rose-600 text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-serif text-2xl text-neutral-900 font-normal">
                    Saved Delivery Destinations
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Primary residences and atelier dispatch addresses across Bangladesh.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-neutral-900 bg-[#FAF8F5] relative text-xs space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900 text-sm">Primary Residence</span>
                      <span className="bg-neutral-900 text-white text-[9px] uppercase px-1.5 py-0.5 font-medium tracking-wider">
                        Default
                      </span>
                    </div>
                    <p className="text-neutral-900 font-medium pt-1">
                      {currentUser.displayName || 'Patron Residence'}
                    </p>
                    <p className="text-neutral-600">House 42, Road 11, Block D, Banani</p>
                    <p className="text-neutral-600">Dhaka-1213, Bangladesh</p>
                    <p className="text-neutral-600 font-mono text-[11px] pt-1">
                      {currentUser.phone || '+880 1711-234567'}
                    </p>
                  </div>

                  <div className="p-4 border border-dashed border-neutral-300 bg-neutral-50 flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:border-neutral-900 transition-colors">
                    <MapPin className="w-6 h-6 text-neutral-400 mb-1" />
                    <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                      + Add New Address
                    </span>
                    <span className="text-[11px] text-neutral-500 mt-0.5">
                      Add another delivery address in Bangladesh
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TRACKING MODAL */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-lg w-full p-6 sm:p-7 border border-neutral-200 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#A67C1E] font-semibold block">
                  Courier Dispatch Logistics
                </span>
                <h3 className="font-serif text-xl text-neutral-900 mt-0.5">
                  Tracking #{selectedOrderForTracking.trackingNumber || selectedOrderForTracking.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForTracking(null)}
                className="text-neutral-400 hover:text-neutral-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#FAF8F5] p-3 text-xs space-y-1 border border-neutral-200">
              <div className="flex justify-between">
                <span className="text-neutral-500">Courier Partner:</span>
                <span className="font-semibold text-neutral-900">{selectedOrderForTracking.courier || 'Pathao Express Prime'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Status:</span>
                <span className="font-semibold text-emerald-800">{selectedOrderForTracking.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Destination:</span>
                <span className="font-semibold text-neutral-900">{selectedOrderForTracking.deliveryAddress || 'Dhaka, Bangladesh'}</span>
              </div>
            </div>

            {/* Stepper detail */}
            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-600" />
                  <div className="w-0.5 h-10 bg-emerald-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900">Order Placed & Confirmed</h4>
                  <p className="text-neutral-500 text-[11px]">{selectedOrderForTracking.date} · Verified</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-600" />
                  <div className="w-0.5 h-10 bg-emerald-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900">Artisan Inspection & Silk Packaging</h4>
                  <p className="text-neutral-500 text-[11px]">Ecobela Handloom Atelier, Sonargaon/Dhaka</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${selectedOrderForTracking.status === 'Delivered' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                  <div className={`w-0.5 h-10 ${selectedOrderForTracking.status === 'Delivered' ? 'bg-emerald-500' : 'bg-neutral-200'}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900">Out for Handover</h4>
                  <p className="text-neutral-500 text-[11px]">Courier Rider Allocated · Pan-BD Express</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${selectedOrderForTracking.status === 'Delivered' ? 'bg-emerald-600' : 'bg-neutral-300'}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900">Delivered to Patron</h4>
                  <p className="text-neutral-500 text-[11px]">Signed by recipient at destination</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrderForTracking(null)}
              className="w-full py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800"
            >
              Close Tracking Details
            </button>
          </div>
        </div>
      )}

      {/* TAX INVOICE MODAL */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 border border-neutral-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
              <div>
                <span className="font-serif text-2xl tracking-[0.2em] font-light text-neutral-900">
                  ECOBELA
                </span>
                <span className="text-[8px] tracking-[0.35em] text-[#A67C1E] uppercase font-sans block font-semibold">
                  HERITAGE LUXURY COUTURE · TAX INVOICE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForInvoice(null)}
                className="text-neutral-400 hover:text-neutral-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-400 uppercase text-[10px] block font-semibold">Billed To (Patron):</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{selectedOrderForInvoice.customerName || currentUser.displayName}</span>
                <span className="text-neutral-600 block">{selectedOrderForInvoice.customerEmail || currentUser.email}</span>
                <span className="text-neutral-600 block">{selectedOrderForInvoice.deliveryAddress || 'Banani, Dhaka'}</span>
              </div>
              <div className="text-right">
                <span className="text-neutral-400 uppercase text-[10px] block font-semibold">Invoice Details:</span>
                <span className="font-mono font-bold text-neutral-900 block mt-0.5">INV-{selectedOrderForInvoice.id}</span>
                <span className="text-neutral-600 block">{selectedOrderForInvoice.date}</span>
                <span className="text-emerald-700 font-semibold block uppercase text-[11px]">{selectedOrderForInvoice.paymentMethod} (PAID)</span>
              </div>
            </div>

            {/* Table of items */}
            <div className="border border-neutral-200 text-xs">
              <div className="bg-neutral-100 p-2.5 font-semibold text-neutral-800 grid grid-cols-12 uppercase text-[10px] tracking-wider">
                <span className="col-span-7">Item Description</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-3 text-right">Amount (BDT)</span>
              </div>
              <div className="divide-y divide-neutral-100">
                {selectedOrderForInvoice.items.map((it, i) => (
                  <div key={i} className="p-2.5 grid grid-cols-12 text-neutral-700">
                    <span className="col-span-7 font-medium text-neutral-900">
                      {it.name}
                      <span className="block text-[10px] text-neutral-400 font-normal">
                        {it.selectedColor ? `Color: ${it.selectedColor}` : ''} {it.selectedSize ? `· Size: ${it.selectedSize}` : ''}
                      </span>
                    </span>
                    <span className="col-span-2 text-center">{it.quantity}</span>
                    <span className="col-span-3 text-right font-mono font-medium">
                      {formatBDT(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Calculation */}
            <div className="space-y-1.5 text-xs text-neutral-600 border-t border-neutral-200 pt-3 max-w-xs ml-auto">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-mono text-neutral-900">{formatBDT(selectedOrderForInvoice.subtotal || selectedOrderForInvoice.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pan-BD Courier Shipping:</span>
                <span className="font-mono text-neutral-900">
                  {selectedOrderForInvoice.deliveryCharge ? formatBDT(selectedOrderForInvoice.deliveryCharge) : 'Complimentary'}
                </span>
              </div>
              <div className="flex justify-between border-t border-neutral-300 pt-2 font-bold text-neutral-950 text-sm">
                <span>Grand Total:</span>
                <span className="font-mono text-[#A67C1E]">{formatBDT(selectedOrderForInvoice.total)}</span>
              </div>
            </div>

            {/* Printable buttons */}
            <div className="flex gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
                className="flex-1 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Tax Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrderForInvoice(null)}
                className="px-5 py-2.5 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider font-medium hover:border-neutral-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
