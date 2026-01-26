"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // In a real app, handle redirect or error here
    alert('Login functionality coming soon!');
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-base-200 px-4">
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
                    placeholder="you@example.com" 
                    className="input input-bordered w-full pl-10 bg-base-100 focus:border-primary focus:outline-none transition-all" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="••••••••" 
                    className="input input-bordered w-full pl-10 bg-base-100 focus:border-primary focus:outline-none transition-all" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full shadow-lg hover:shadow-primary/30 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
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