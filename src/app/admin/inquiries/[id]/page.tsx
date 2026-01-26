"use client";

import { useEffect, useState, use } from 'react';
import { Inquiry } from '@/backend/types';
import { Mail, Phone, MapPin, Calendar, Archive, Reply, ArrowLeft, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InquiryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const unwrappedParams = use(params);

  useEffect(() => {
    fetchInquiry();
  }, []);

  const fetchInquiry = async () => {
    try {
      const res = await fetch(`/api/inquiries/${unwrappedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        setInquiry(data);
        // Auto-mark as read if NEW
        if (data.status === 'NEW') {
          await fetch(`/api/inquiries/${unwrappedParams.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'READ' })
          });
        }
      } else {
        router.push('/admin/inquiries');
      }
    } catch (error) {
      console.error('Failed to fetch inquiry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!inquiry) return;
    try {
      const res = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ARCHIVED' })
      });
      if (res.ok) {
        setInquiry(prev => prev ? { ...prev, status: 'ARCHIVED' } : null);
      }
    } catch (error) {
      console.error('Failed to archive:', error);
    }
  };

  const handleReply = () => {
    if (!inquiry) return;
    const subject = `Re: ${inquiry.subject}`;
    const body = `\n\n\n--- Original Message ---\nFrom: ${inquiry.name}\nDate: ${new Date(inquiry.createdAt).toLocaleString()}\n\n${inquiry.message}`;
    window.location.href = `mailto:${inquiry.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!inquiry) return null;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="mb-6">
        <Link href="/admin/inquiries" className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-primary pl-0">
          <ArrowLeft size={16} /> Back to Inquiries
        </Link>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-[24px] shadow-sm border border-base-200 p-8 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-serif font-bold text-primary">{inquiry.subject}</h1>
              <span className={`badge ${ 
                inquiry.status === 'NEW' ? 'badge-error text-white' : 
                inquiry.status === 'ARCHIVED' ? 'badge-ghost' : 'badge-info text-white'
              } font-bold tracking-wide uppercase`}>
                {inquiry.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <Clock size={14} />
              Received on {new Date(inquiry.createdAt).toLocaleString()}
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={handleReply} className="btn btn-primary gap-2 flex-1 md:flex-none">
              <Reply size={18} /> Reply
            </button>
            <button onClick={handleArchive} disabled={inquiry.status === 'ARCHIVED'} className="btn btn-outline gap-2 flex-1 md:flex-none">
              <Archive size={18} /> {inquiry.status === 'ARCHIVED' ? 'Archived' : 'Archive'}
            </button>
          </div>
        </div>

        <div className="divider my-0"></div>

        {/* Customer Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center text-primary shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-base-content/40 tracking-wider">Email Address</p>
              <p className="font-medium text-base-content">{inquiry.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center text-primary shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-base-content/40 tracking-wider">Phone Number</p>
              <p className="font-medium text-base-content">{inquiry.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center text-primary shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-base-content/40 tracking-wider">Address</p>
              <p className="font-medium text-base-content">{inquiry.address || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
             <div className="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center text-primary shrink-0">
              <Tag size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-base-content/40 tracking-wider">Interested Plan</p>
              <p className="font-medium text-primary font-bold">{inquiry.plan || 'General Inquiry'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Body */}
      <div className="bg-white rounded-[24px] shadow-sm border border-base-200 p-8 min-h-[200px]">
        <p className="text-xs font-bold uppercase text-base-content/40 tracking-wider mb-4">Message Content</p>
        <div className="prose max-w-none text-base-content/90 whitespace-pre-wrap leading-relaxed">
          {inquiry.message}
        </div>
      </div>
    </div>
  );
}
