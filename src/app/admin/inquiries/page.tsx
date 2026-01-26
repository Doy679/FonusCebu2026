"use client";

import { useEffect, useState } from 'react';
import { Inquiry } from '@/backend/types';
import { Mail, Search } from 'lucide-react';

import Link from 'next/link';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter(i => 
    i.name.toLowerCase().includes(filter.toLowerCase()) || 
    i.email.toLowerCase().includes(filter.toLowerCase()) ||
    i.subject.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-base-content">Inquiries</h1>
          <p className="text-base-content/60 mt-1">Manage and respond to customer messages</p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-3 text-base-content/40" size={18} />
          <input 
            type="text" 
            placeholder="Search inquiries..." 
            className="input input-bordered pl-10 w-full md:w-80 bg-white shadow-sm focus:border-primary focus:outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredInquiries.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-box shadow-sm">
              <Mail className="mx-auto text-base-content/20 mb-4" size={48} />
              <h3 className="text-lg font-medium text-base-content/60">No inquiries found</h3>
            </div>
          ) : (
            filteredInquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-white p-6 rounded-box shadow-sm border border-base-200 hover:shadow-md transition-all relative overflow-hidden group">
                <Link href={`/admin/inquiries/${inquiry.id}`} className="block">
                  {inquiry.status === 'NEW' && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full m-3" title="New Message"></div>
                  )}
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 flex flex-col gap-2 min-w-[220px]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {inquiry.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-base-content">{inquiry.name}</h3>
                          <p className="text-xs text-base-content/60">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-base-content/70 mt-2 bg-base-100 p-2 rounded-lg">
                        <Mail size={14} /> 
                        <span className="truncate max-w-[180px]">{inquiry.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex-grow border-l border-base-200 md:pl-6 pt-4 md:pt-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-lg text-primary">{inquiry.subject}</h4>
                        <span className={`badge ${inquiry.status === 'NEW' ? 'badge-primary' : 'badge-ghost'} badge-sm uppercase font-bold tracking-wide`}>
                          {inquiry.status}
                        </span>
                      </div>
                      <p className="text-base-content/80 text-sm whitespace-pre-wrap leading-relaxed line-clamp-2">
                        {inquiry.message}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="flex flex-row md:flex-col justify-center gap-2 mt-4 md:mt-0 pt-4 md:pt-0 md:absolute md:right-6 md:top-6 min-w-[120px] pointer-events-none">
                  <Link 
                    href={`/admin/inquiries/${inquiry.id}`}
                    className="btn btn-sm btn-primary w-full md:w-auto pointer-events-auto"
                  >
                    View / Reply
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}