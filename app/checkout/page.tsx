'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatBDT } from '@/lib/utils';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { saveNewOrder } from '@/lib/orders';
import { UserOrder, OrderItem } from '@/types/user';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  CheckCircle,
  ArrowRight,
  Lock
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, deliveryCharge, estimatedTotal, clearCart, deliveryCity, setDeliveryCity } = useCart();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
    city: deliveryCity === 'dhaka' ? 'Dhaka' : 'Chittagong',
    area: '',
    postalCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('bkash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<{ id: string } | null>(null);

  const breadcrumbItems = [
    { label: 'Shopping Bag', href: '/cart' },
    { label: 'Secure Checkout' },
  ];

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, city: val });
    if (val === 'Dhaka') {
      setDeliveryCity('dhaka');
    } else {
      setDeliveryCity('outside');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) return;

    setIsProcessing(true);
    setTimeout(() => {
      const orderId = 'ECO-ORD-' + Math.floor(100000 + Math.random() * 900000);
      const trackingNumber = 'ECO-EXP-' + Math.floor(100000 + Math.random() * 900000);

      const orderItems: OrderItem[] = cartItems.map((ci) => ({
        id: ci.product.id,
        name: ci.product.name,
        slug: ci.product.slug,
        price: ci.product.price,
        quantity: ci.quantity,
        selectedColor: ci.selectedColor,
        selectedSize: ci.selectedSize,
        imageUrl: ci.product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      }));

      const newOrder: UserOrder = {
        id: orderId,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        total: estimatedTotal,
        subtotal: subtotal,
        deliveryCharge: deliveryCharge,
        status: 'Processing',
        paymentMethod: paymentMethod === 'bkash' ? 'bKash Online' : paymentMethod === 'nagad' ? 'Nagad Wallet' : paymentMethod === 'card' ? 'Visa / Mastercard' : 'Cash on Delivery',
        itemsCount: cartItems.length,
        deliveryCity: formData.city,
        customerName: formData.fullName,
        customerEmail: formData.email || currentUser?.email || 'patron@ecobela.com',
        customerPhone: formData.phone,
        deliveryAddress: `${formData.address}, ${formData.area}, ${formData.city}`,
        trackingNumber: trackingNumber,
        courier: formData.city === 'Dhaka' ? 'Pathao Express Prime' : 'RedX Logistics Nationwide',
        estimatedDelivery: '2 to 3 Business Days',
        items: orderItems,
      };

      saveNewOrder(newOrder);

      setOrderConfirmed({ id: orderId });
      clearCart();
      setIsProcessing(false);
    }, 1200);
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white border border-neutral-200 p-8 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A67C1E] font-semibold block">
              Order Placed Successfully
            </span>
            <h2 className="font-serif text-2xl text-neutral-900 mt-1 font-normal">
              Thank You for Supporting Bengal Craft
            </h2>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed font-light">
            Your patron order <strong className="font-mono text-neutral-900">#{orderConfirmed.id}</strong> has been received by our atelier concierge. A confirmation dispatch message has been queued for {formData.phone}.
          </p>

          <div className="bg-[#FAF8F5] p-4 text-left text-xs space-y-1.5 border border-neutral-200 text-neutral-700">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-semibold uppercase">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery To:</span>
              <span className="font-semibold">{formData.fullName}, {formData.city}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery:</span>
              <span className="text-emerald-700 font-medium">2 to 3 Business Days</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/account"
              className="w-full py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors"
            >
              View in My Account
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 border border-neutral-200 text-neutral-700 text-xs uppercase tracking-widest font-medium hover:border-neutral-900 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="font-serif text-2xl text-neutral-900 mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-neutral-500 mb-6">Add items to proceed to checkout.</p>
        <Link
          href="/women"
          className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="border-b border-neutral-200 pb-4 mt-2">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#A67C1E] font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
            Checkout &amp; Delivery Details
          </h1>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8">
            {/* Left 7 Columns: Delivery & Payment Options */}
            <div className="lg:col-span-7 space-y-8">
              {/* Customer Info Section */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg text-neutral-900 uppercase tracking-wider font-medium border-b border-neutral-200 pb-2">
                  1. Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Mahinur Rahman"
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+880 1711-000000"
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900 focus:bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold block mb-1">
                      Email Address (for order tracking receipt) *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="patron@example.com"
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg text-neutral-900 uppercase tracking-wider font-medium border-b border-neutral-200 pb-2">
                  2. Delivery Address in Bangladesh
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold block mb-1">
                      Division / City *
                    </label>
                    <select
                      value={formData.city}
                      onChange={handleCityChange}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900 focus:bg-white cursor-pointer"
                    >
                      <option value="Dhaka">Dhaka (City Delivery: ৳80)</option>
                      <option value="Chittagong">Chittagong (Nationwide: ৳150)</option>
                      <option value="Sylhet">Sylhet (Nationwide: ৳150)</option>
                      <option value="Rajshahi">Rajshahi (Nationwide: ৳150)</option>
                      <option value="Khulna">Khulna (Nationwide: ৳150)</option>
                      <option value="Barisal">Barisal (Nationwide: ৳150)</option>
                      <option value="Rangpur">Rangpur (Nationwide: ৳150)</option>
                      <option value="Mymensingh">Mymensingh (Nationwide: ৳150)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold block mb-1">
                      Area / Neighborhood *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="e.g. Gulshan-2, Dhanmondi, Agrabad"
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold block mb-1">
                      House, Road, Apartment Details *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="House #, Road #, Flat/Floor, Landmark..."
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg text-neutral-900 uppercase tracking-wider font-medium border-b border-neutral-200 pb-2">
                  3. Select Payment Preference
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* bKash */}
                  <label
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-4 border cursor-pointer flex items-center justify-between transition-colors ${
                      paymentMethod === 'bkash' ? 'border-[#E2136E] bg-pink-50/40 ring-1 ring-[#E2136E]' : 'border-neutral-200 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E2136E] text-white flex items-center justify-center font-bold text-xs">
                        ৳
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-neutral-900 block">bKash Online Payment</span>
                        <span className="text-[10px] text-neutral-500">Instant direct gateway</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="text-[#E2136E] focus:ring-0"
                    />
                  </label>

                  {/* Nagad */}
                  <label
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-4 border cursor-pointer flex items-center justify-between transition-colors ${
                      paymentMethod === 'nagad' ? 'border-[#F7941D] bg-amber-50/40 ring-1 ring-[#F7941D]' : 'border-neutral-200 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F7941D] text-white flex items-center justify-center font-bold text-xs">
                        N
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-neutral-900 block">Nagad Wallet</span>
                        <span className="text-[10px] text-neutral-500">Instant zero fee</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'nagad'}
                      onChange={() => setPaymentMethod('nagad')}
                      className="text-[#F7941D] focus:ring-0"
                    />
                  </label>

                  {/* Cards */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border cursor-pointer flex items-center justify-between transition-colors ${
                      paymentMethod === 'card' ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-neutral-800" />
                      <div>
                        <span className="font-semibold text-xs text-neutral-900 block">Credit / Debit Card</span>
                        <span className="text-[10px] text-neutral-500">Visa, Mastercard, AMEX</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-neutral-900 focus:ring-0"
                    />
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 border cursor-pointer flex items-center justify-between transition-colors ${
                      paymentMethod === 'cod' ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Banknote className="w-6 h-6 text-neutral-800" />
                      <div>
                        <span className="font-semibold text-xs text-neutral-900 block">Cash on Delivery</span>
                        <span className="text-[10px] text-neutral-500">Pay upon parcel inspection</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-neutral-900 focus:ring-0"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Order Summary & Placement */}
            <div className="lg:col-span-5">
              <div className="bg-[#FAF8F5] border border-neutral-200 p-6 sm:p-8 space-y-6 sticky top-24">
                <h3 className="font-serif text-lg text-neutral-900 uppercase tracking-wider font-medium border-b border-neutral-200 pb-3">
                  Summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                </h3>

                {/* Items preview list */}
                <div className="divide-y divide-neutral-200/70 max-h-64 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-3 flex items-center gap-3 text-xs">
                      <div className="relative w-14 h-16 shrink-0 bg-neutral-100 overflow-hidden">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="60px"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-xs text-neutral-900 truncate font-medium">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500">
                          Qty: {item.quantity} · {item.selectedColor}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-semibold text-neutral-900">
                        {formatBDT(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing calculations */}
                <div className="space-y-2.5 text-xs text-neutral-700 pt-2 border-t border-neutral-200">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono font-medium">{formatBDT(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pan-BD Delivery Fee</span>
                    <span className="font-mono font-medium">
                      {deliveryCharge === 0 ? 'Complimentary' : formatBDT(deliveryCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-500 text-[11px]">
                    <span>Estimated Tax (VAT Included)</span>
                    <span className="font-mono">৳0</span>
                  </div>
                  <div className="pt-3 border-t border-neutral-300 flex justify-between text-base font-semibold text-neutral-900">
                    <span className="font-serif uppercase tracking-wider text-sm">Total Amount</span>
                    <span className="font-mono text-xl">{formatBDT(estimatedTotal)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-neutral-900 text-white hover:bg-neutral-800 text-xs uppercase tracking-[0.2em] font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                >
                  <span>{isProcessing ? 'Confirming Order...' : 'Confirm & Place Order'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-neutral-400 text-center">
                  By confirming, you agree to Ecobela Atelier policies and 7-day exchange guarantee.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
