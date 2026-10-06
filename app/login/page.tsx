import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Patron Sign In — Ecobela',
  description: 'Access your Ecobela account to manage orders, wishlists, and invitations.',
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] bg-[#FAF8F5] py-12 px-4 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full px-4 mb-4">
        <Breadcrumb items={[{ label: 'Sign In' }]} />
      </div>
      <Suspense fallback={<div className="text-center py-12 text-xs text-neutral-500">Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
