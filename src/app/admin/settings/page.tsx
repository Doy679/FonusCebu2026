"use client";

import { useState } from 'react';
import { Bell, Shield, Moon, Globe, Save } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    desktopNotifications: false,
    twoFactor: true,
    darkMode: false,
    publicProfile: true
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-serif font-bold text-base-content mb-8">System Settings</h1>

      <div className="bg-white rounded-[24px] shadow-sm border border-base-200 overflow-hidden">
        
        {/* Notifications */}
        <div className="p-8 border-b border-base-200">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
            <Bell size={20} /> Notifications
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-base-content">Email Alerts</p>
                <p className="text-sm text-base-content/60">Receive emails about new inquiries</p>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={settings.emailNotifications}
                onChange={() => toggle('emailNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-base-content">Desktop Notifications</p>
                <p className="text-sm text-base-content/60">Show popups when online</p>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={settings.desktopNotifications}
                onChange={() => toggle('desktopNotifications')}
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="p-8 border-b border-base-200">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
            <Shield size={20} /> Security
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-base-content">Two-Factor Authentication</p>
                <p className="text-sm text-base-content/60">Secure your account with 2FA</p>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-success" 
                checked={settings.twoFactor}
                onChange={() => toggle('twoFactor')}
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="p-8">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary">
            <Globe size={20} /> General
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-base-content">Public Visibility</p>
                <p className="text-sm text-base-content/60">Allow search engines to index site</p>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={settings.publicProfile}
                onChange={() => toggle('publicProfile')}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-base-100 p-6 flex justify-end">
           <button className="btn btn-primary rounded-xl gap-2">
             <Save size={18} /> Save Changes
           </button>
        </div>
      </div>
    </div>
  );
}