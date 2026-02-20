"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase';
import TransitionScreen from '@/components/TransitionScreen';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError('');

    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set cookie for middleware protection
      document.cookie = `auth_token=${user.uid}; path=/; max-age=86400; SameSite=Lax`;

      // Redirect
      router.push('/admin/dashboard');
    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <TransitionScreen />
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-[var(--radius-box)] shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/fonus.webp')] bg-cover bg-center mix-blend-overlay"></div>
            <h1 className="text-3xl font-serif font-bold text-white relative z-10 mb-2">Welcome Back</h1>
            <p className="text-primary-content/80 text-sm relative z-10">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/70">Email Address</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    className="input input-bordered w-full pl-10 bg-base-100 focus:border-primary focus:outline-none transition-all" 
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label flex justify-between">
                  <span className="label-text font-medium text-base-content/70">Password</span>
                  <Link href="#" className="label-text-alt link link-hover text-primary font-medium">Forgot password?</Link>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="input input-bordered w-full pl-10 bg-base-100 focus:border-primary focus:outline-none transition-all" 
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary w-full shadow-lg hover:shadow-primary/30 transition-all duration-300"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Signing in...
                  </>
                ) : (
                  <>
                    Log In
                    <ArrowRight size={18} className="ml-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-base-content/60">
              Don&apos;t have an account?{' '}
              <Link href="/#contact" className="text-primary font-bold hover:underline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-base-content/50 hover:text-primary transition-colors flex items-center justify-center gap-2">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
