'use client';

import React, { useState } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-20 bg-white border-t border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#A67C1E] font-semibold">
          The Ecobela Journal
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-2 font-normal">
          Receive Private Invitations &amp; Weaving Chronicles
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-2.5 max-w-lg mx-auto font-light leading-relaxed">
          Be the first to explore limited-edition Jamdani drops, private bridal consultations, and enjoy complimentary welcome benefits on your initial order.
        </p>

        {isSubscribed ? (
          <div className="mt-8 p-4 bg-[#FAF8F5] border border-amber-900/30 text-amber-950 inline-flex items-center gap-2 text-xs font-medium animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>Thank you for subscribing. A welcome voucher for 10% privilege has been sent to your inbox.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-4 py-3 bg-neutral-50 text-xs text-neutral-900 border border-neutral-300 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all rounded-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-neutral-400 mt-4">
          We honor your sanctuary. Unsubscribe seamlessly with a single click at any time.
        </p>
      </div>
    </section>
  );
}
