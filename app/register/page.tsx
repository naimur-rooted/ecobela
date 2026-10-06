import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Patron Registration — Ecobela',
  description: 'Join the Ecobela patron circle for private previews, order tracking, and sustainable luxury fashion.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] bg-[#FAF8F5] py-12 px-4 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full px-4 mb-4">
        <Breadcrumb items={[{ label: 'Register' }]} />
      </div>
      <Suspense fallback={<div className="text-center py-12 text-xs text-neutral-500">Loading form...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
