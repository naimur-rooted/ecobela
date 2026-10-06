'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface FacebookLoginButtonProps {
  onSuccess?: () => void;
  text?: string;
}

export function FacebookLoginButton({ onSuccess, text = 'Continue with Facebook' }: FacebookLoginButtonProps) {
  const { loginWithFacebook } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await loginWithFacebook();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || 'Facebook authentication was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full py-3 px-4 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-white" />
        ) : (
          <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        )}
        <span>{loading ? 'Connecting to Facebook...' : text}</span>
      </button>
      {error && (
        <div className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 p-2.5 mt-1.5 text-center leading-relaxed">
          {error}
        </div>
      )}
    </div>
  );
}
