import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  LogIn, 
  UserPlus, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  customMessage?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  customMessage,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const supabase = getSupabase();
    if (!supabase) {
      setErrorMsg('Supabase is not configured yet. Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in settings.');
      return;
    }

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMsg(error.message || 'Failed to sign in. Please verify your credentials.');
      } else if (data.user) {
        setSuccessMsg('Welcome back! Loading your curriculum...');
        setTimeout(() => {
          onAuthSuccess(data.user!);
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const supabase = getSupabase();
    if (!supabase) {
      setErrorMsg('Supabase is not configured yet. Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in settings.');
      return;
    }

    if (!email.trim() || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please double-check.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMsg(error.message || 'Failed to create account.');
      } else if (data.user) {
        // If email confirmation is disabled in Supabase, user session is active immediately
        setSuccessMsg('Account created successfully! Preparing your learning journey...');
        setTimeout(() => {
          onAuthSuccess(data.user!);
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      id="auth-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-[#0F172A] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        id="auth-modal-dialog"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#020617]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 border border-indigo-400/30 text-white flex items-center justify-center font-black shadow-[0_0_12px_rgba(99,102,241,0.3)]">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block">
                AI Architect
              </span>
              <h3 className="text-base font-black uppercase tracking-tight text-white">
                {mode === 'signin' ? 'Sign In to Continue' : 'Create Your Account'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer"
            id="close-auth-modal-button"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Custom Informational Subtitle / Banner */}
          {customMessage ? (
            <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs flex items-start gap-2.5 font-medium leading-relaxed">
              <Sparkles className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
              <span>{customMessage}</span>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center font-medium">
              {mode === 'signin'
                ? 'Sign in to access your personalized learning roadmap and resume your progress.'
                : 'Create an account to save your generated curriculum, quiz records, and XP.'}
            </p>
          )}

          {/* Toggle Tab between Sign In and Sign Up */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#020617] border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="tab-signin"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="tab-signup"
            >
              Sign Up
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span className="font-medium leading-relaxed">{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in duration-150">
              <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span className="font-medium leading-relaxed">{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                autoComplete="email"
                className="w-full px-4 py-2.5 rounded-xl bg-[#020617] border border-white/10 text-white text-xs placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-mono transition-all"
                id="auth-input-email"
              />
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full px-4 py-2.5 rounded-xl bg-[#020617] border border-white/10 text-white text-xs placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-mono transition-all"
                id="auth-input-password"
              />
            </div>

            {/* Confirm Password (only for sign up) */}
            {mode === 'signup' && (
              <div className="space-y-1.5 animate-in fade-in duration-150">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#020617] border border-white/10 text-white text-xs placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-mono transition-all"
                  id="auth-input-confirm-password"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 cursor-pointer mt-2"
              id="auth-submit-btn"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : mode === 'signin' ? (
                <LogIn className="w-4 h-4" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span>
                {loading
                  ? 'Processing...'
                  : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
              </span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
