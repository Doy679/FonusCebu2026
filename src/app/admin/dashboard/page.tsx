"use client";

import { useEffect, useState } from 'react';
import { Inquiry } from '@/backend/types';
import { Mail, TrendingUp, Calendar, ArrowRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  subtext: string;
}

const StatCard = ({ title, value, icon: Icon, color, subtext }: StatCardProps) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-md border border-base-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-bold text-base-content/60 uppercase tracking-widest">{title}</p>
        <h3 className="text-5xl font-serif font-bold text-base-content mt-3">{value}</h3>
        <p className="text-sm text-base-content/50 mt-2 font-medium">{subtext}</p>
      </div>
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 shadow-inner`}>
        <Icon size={32} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    todayInquiries: 0
  });

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await fetch('/api/inquiries');
        if (res.ok) {
          const data: Inquiry[] = await res.json();
          setInquiries(data);
          
          // Calculate stats
          const today = new Date().toISOString().split('T')[0];
          setStats({
            totalInquiries: data.length,
            newInquiries: data.filter(i => i.status === 'NEW').length,
            todayInquiries: data.filter(i => i.createdAt.startsWith(today)).length
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchInquiries();
  }, []);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-base-content">Dashboard</h1>
        <p className="text-base-content/60 mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          title="Total Inquiries" 
          value={stats.totalInquiries} 
          icon={Mail} 
          color="bg-primary"
          subtext="All time messages" 
        />
        <StatCard 
          title="New Messages" 
          value={stats.newInquiries} 
          icon={TrendingUp} 
          color="bg-secondary"
          subtext="Unread inquiries" 
        />
        <StatCard 
          title="Today's Activity" 
          value={stats.todayInquiries} 
          icon={Calendar} 
          color="bg-accent"
          subtext="Messages received today" 
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-[2rem] shadow-md border border-base-200 overflow-hidden">
        <div className="p-8 border-b border-base-200 flex justify-between items-center bg-base-100/30">
          <h2 className="text-2xl font-bold font-serif text-base-content">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="btn btn-md btn-ghost gap-2 text-primary font-bold text-base">
            View All <ArrowRight size={20} />
          </Link>
        </div>
        
        <div className="divide-y divide-base-200">
          {inquiries.slice(0, 5).map((inquiry) => (
            <Link key={inquiry.id} href={`/admin/inquiries/${inquiry.id}`} className="block p-6 hover:bg-base-100 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className={`w-3 h-3 rounded-full ${inquiry.status === 'NEW' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-gray-300'}`}></div>
                <div>
                  <h4 className="font-bold text-lg text-base-content group-hover:text-primary transition-colors">{inquiry.name}</h4>
                  <p className="text-base text-base-content/60 mt-0.5">{inquiry.subject}</p>
                </div>
              </div>
              <span className="text-sm text-base-content/50 font-medium">
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </span>
            </Link>
          ))}
          {inquiries.length === 0 && (
            <div className="p-12 text-center text-lg text-base-content/40 italic">No activity yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
