'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GoogleLoginButton } from './GoogleLoginButton';
import { FacebookLoginButton } from './FacebookLoginButton';

interface RegisterFormProps {
  redirectUrl?: string;
}

export function RegisterForm({ redirectUrl = '/account' }: RegisterFormProps) {
  const router = useRouter();
  const { registerWithEmail } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await registerWithEmail(name, email, password);
      router.push(redirectUrl);
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      if (errorObj?.code === 'auth/email-already-in-use') {
        setError('This email is already associated with an existing account.');
      } else {
        setError(errorObj?.message || 'Registration failed. Please check details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 border border-neutral-200 shadow-xs">
      <div className="text-center mb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C1E] font-semibold block mb-1">
          Patron Membership
        </span>
        <h2 className="font-serif text-2xl text-neutral-900 font-normal">
          Create Your Atelier Account
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Enjoy personal styling, order tracking, and private collection drops.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold block mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Farhana Ahmed"
              className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 text-xs text-neutral-900 border border-neutral-300 focus:bg-white focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold block mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patron@example.com"
              className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 text-xs text-neutral-900 border border-neutral-300 focus:bg-white focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold block mb-1">
            Password (Min 6 Characters)
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 text-xs text-neutral-900 border border-neutral-300 focus:bg-white focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold block mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 text-xs text-neutral-900 border border-neutral-300 focus:bg-white focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>

        <div className="flex items-start gap-2 pt-1 text-xs text-neutral-600">
          <input
            type="checkbox"
            id="terms"
            required
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 w-3.5 h-3.5 rounded-none border-neutral-300 text-neutral-900 focus:ring-0 cursor-pointer"
          />
          <label htmlFor="terms" className="cursor-pointer">
            I agree to Ecobela Terms of Service and Privacy Policy.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-neutral-900 text-white hover:bg-neutral-800 text-xs uppercase tracking-[0.2em] font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Complete Registration'}
        </button>
      </form>

      {/* Social Logins */}
      <div className="my-6 relative flex items-center justify-center">
        <div className="border-t border-neutral-200 w-full" />
        <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-neutral-400 absolute">
          Or register with
        </span>
      </div>

      <div className="space-y-2.5">
        <GoogleLoginButton text="Sign Up with Google" onSuccess={() => router.push(redirectUrl)} />
        <FacebookLoginButton text="Sign Up with Facebook" onSuccess={() => router.push(redirectUrl)} />
      </div>

      {/* Link to Login */}
      <div className="mt-6 text-center text-xs text-neutral-600 pt-4 border-t border-neutral-100">
        <span>Already have an account? </span>
        <Link href="/login" className="font-semibold text-neutral-900 hover:text-amber-900 underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
