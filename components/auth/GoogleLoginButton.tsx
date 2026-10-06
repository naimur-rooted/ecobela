'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  text?: string;
}

export function GoogleLoginButton({ onSuccess, text = 'Continue with Google' }: GoogleLoginButtonProps) {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || 'Google authentication was cancelled or could not be completed.');
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
        className="w-full py-3 px-4 bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        )}
        <span>{loading ? 'Authenticating with Google...' : text}</span>
      </button>
      {error && (
        <div className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 p-2.5 mt-1.5 text-center leading-relaxed">
          {error}
        </div>
      )}
    </div>
  );
}
