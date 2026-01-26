"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  User, 
  Settings, 
  History, 
  LogOut,
  Menu
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Inquiries', icon: MessageSquare, href: '/admin/inquiries' },
    { name: 'Profile', icon: User, href: '/admin/profile' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
    { name: 'History', icon: History, href: '/admin/history' },
  ];

  return (
    <div className="min-h-screen bg-base-200 flex">
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 right-4 z-50 btn btn-circle btn-primary shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-primary text-white transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Sidebar Header */}
        <Link 
          href="/" 
          className="p-4 border-b border-white/10 block hover:bg-white/5 transition-colors group"
          title="Back to Landing Page"
        >
          <div className="flex items-center justify-between w-full gap-2 transition-transform group-hover:scale-[0.98]">
            {/* Left Logo */}
            <div className="bg-white p-0.5 rounded-full relative h-9 w-9 shrink-0 overflow-hidden border border-white/20 shadow-sm">
              <Image 
                src="/fonus.webp" 
                alt="FONUS Logo" 
                fill
                priority
                className="object-cover scale-[1.6] origin-top"
                sizes="36px"
              />
            </div>

            {/* Middle Text */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <h2 className="font-serif font-bold text-base tracking-tight text-white leading-none truncate w-full text-center">FONUS CEBU</h2>
              <span className="text-[8px] text-white/50 tracking-widest uppercase mt-1 truncate w-full text-center">Federation</span>
            </div>

            {/* Right Logo */}
            <div className="bg-white p-0.5 rounded-full relative h-9 w-9 shrink-0 overflow-hidden border border-white/20 shadow-sm">
              <Image 
                src="/coop.png" 
                alt="Coop Logo" 
                fill
                priority
                className="object-contain scale-110"
                sizes="36px"
              />
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  font-medium text-sm tracking-wide
                  ${isActive 
                    ? 'bg-white text-primary shadow-md translate-x-1' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1'}
                `}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-colors font-medium text-sm"
          >
            <LogOut size={20} />
            Log Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
