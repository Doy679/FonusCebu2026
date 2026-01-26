"use client";

import { useState } from 'react';
import { User, Mail, Lock, Save, Camera } from 'lucide-react';

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    name: 'Fonus Admin',
    email: 'admin@fonus.com',
    role: 'Administrator'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-serif font-bold text-base-content mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-base-200 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 group cursor-pointer">
              <div className="w-full h-full rounded-full bg-primary text-white flex items-center justify-center text-4xl font-serif overflow-hidden border-4 border-base-100 shadow-lg">
                FA
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-base-content">{user.name}</h2>
            <p className="text-sm text-base-content/60 mb-4">{user.role}</p>
            <div className="badge badge-primary badge-outline">Active</div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-base-200">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <User size={20} className="text-primary" /> Edit Information
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-base-content/60">Full Name</span></label>
                <input 
                  type="text" 
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  className="input input-bordered w-full focus:border-primary focus:outline-none rounded-xl"
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-base-content/60">Email Address</span></label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3.5 text-base-content/40" />
                  <input 
                    type="email" 
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    className="input input-bordered w-full pl-10 focus:border-primary focus:outline-none rounded-xl"
                  />
                </div>
              </div>

              <div className="divider">Security</div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium text-base-content/60">New Password</span></label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3.5 text-base-content/40" />
                  <input 
                    type="password" 
                    placeholder="Leave blank to keep current"
                    className="input input-bordered w-full pl-10 focus:border-primary focus:outline-none rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn btn-primary w-full rounded-xl"
                >
                  {isLoading ? 'Saving Changes...' : <><Save size={18} /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}