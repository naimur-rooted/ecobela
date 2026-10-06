'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GoogleLoginButton } from './GoogleLoginButton';
import { FacebookLoginButton } from './FacebookLoginButton';

interface LoginFormProps {
  redirectUrl?: string;
}

export function LoginForm({ redirectUrl = '/account' }: LoginFormProps) {
  const router = useRouter();
  const { loginWithEmail, resetPassword, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setLoading(true);
    setError(null);
    try {
      await loginWithEmail(email, password);
      router.push(redirectUrl);
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      if (errorObj?.code === 'auth/invalid-credential' || errorObj?.code === 'auth/wrong-password') {
        setError('Incorrect email or password combination.');
      } else if (errorObj?.code === 'auth/user-not-found') {
        setError('No patron account found with this email.');
      } else {
        setError(errorObj?.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your registered email address first.');
      return;
    }
    try {
      await resetPassword(email);
      setResetSent(true);
      setError(null);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || 'Failed to dispatch password recovery email.');
    }
  };

  const handleAdminSignIn = () => {
    demoLogin({
      name: 'Ecobela Admin',
      email: 'admin@ecobela.com',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: '+880 1700-000000',
      role: 'admin',
    });
    router.push('/admin');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 border border-neutral-200 shadow-sm">
      <div className="text-center mb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#A67C1E] font-semibold block mb-1">
          Patron Access
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
          Welcome to Ecobela
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Sign in to view orders, saved heirlooms, and bespoke collections.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {resetSent && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
          Recovery instructions dispatched to your email address.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold block mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patron@example.com"
              className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 text-xs text-neutral-900 border border-neutral-300 focus:bg-white focus:outline-none focus:border-neutral-900 disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold block">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgot(!showForgot)}
              className="text-[11px] text-amber-900 hover:text-amber-950 font-medium"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 text-xs text-neutral-900 border border-neutral-300 focus:bg-white focus:outline-none focus:border-neutral-900 disabled:opacity-60"
            />
          </div>
        </div>

        {showForgot && (
          <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs space-y-2 animate-in fade-in">
            <p className="text-neutral-600 text-[11px]">
              Enter your email above and tap below to receive a password reset link.
            </p>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="w-full py-2 bg-neutral-800 text-white text-[11px] uppercase tracking-wider font-medium hover:bg-neutral-900"
            >
              Send Reset Link
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-neutral-900 text-white hover:bg-neutral-800 text-xs uppercase tracking-[0.2em] font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {/* Social Logins */}
      <div className="my-6 relative flex items-center justify-center">
        <div className="border-t border-neutral-200 w-full" />
        <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-neutral-400 absolute">
          Or continue with
        </span>
      </div>

      <div className="space-y-2.5">
        <GoogleLoginButton onSuccess={() => router.push(redirectUrl)} />
        <FacebookLoginButton onSuccess={() => router.push(redirectUrl)} />
      </div>

      {/* Seeded Admin Access */}
      <div className="mt-5 pt-5 border-t border-neutral-200 text-center space-y-3">
        <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
          Master Admin Portal Access
        </span>
        
        <button
          type="button"
          onClick={handleAdminSignIn}
          className="w-full py-3 px-4 bg-neutral-900 text-white hover:bg-[#A67C1E] text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
          <span>Sign In as Demo Admin</span>
        </button>

        <div className="p-3 bg-amber-50/80 border border-amber-200 text-xs text-amber-950 text-left leading-relaxed font-mono">
          <p className="font-semibold font-sans text-[11px] text-amber-900 mb-1">
            🔑 Seeded Admin Credentials:
          </p>
          <div className="text-[11px] space-y-0.5">
            <div><span className="text-neutral-500 font-sans">Email:</span> admin@ecobela.com</div>
            <div><span className="text-neutral-500 font-sans">Password:</span> admin123456</div>
          </div>
        </div>
      </div>

      {/* Link to Register */}
      <div className="mt-6 text-center text-xs text-neutral-600">
        <span>Don&apos;t have an atelier account? </span>
        <Link href="/register" className="font-semibold text-neutral-900 hover:text-amber-900 underline">
          Register Here
        </Link>
      </div>
    </div>
  );
}
