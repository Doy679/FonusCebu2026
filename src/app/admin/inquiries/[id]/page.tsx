"use client";

import { useEffect, useState, use } from 'react';
import { Inquiry } from '@/backend/types';
import { Mail, Phone, MapPin, Archive, Reply, ArrowLeft, Clock, Tag, X, Send, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InquiryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
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

  const handleReplyClick = () => {
    if (!inquiry) return;
    
    // If no email, check for phone
    if (!inquiry.email && inquiry.phone) {
      alert(`No email provided. You can contact ${inquiry.name} via phone: ${inquiry.phone}`);
      return;
    }

    setIsReplyModalOpen(true);
  };

  const sendEmailReply = async () => {
    if (!inquiry || !replyMessage.trim()) return;
    
    setSendingEmail(true);
    try {
      const res = await fetch('/api/email/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: inquiry.email,
          subject: `Re: ${inquiry.subject}`,
          message: replyMessage
        })
      });

      if (res.ok) {
        alert('Reply sent successfully!');
        setIsReplyModalOpen(false);
        setReplyMessage('');
      } else {
        alert('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('An error occurred.');
    } finally {
      setSendingEmail(false);
    }
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
    <div className="max-w-4xl mx-auto animate-fade-in pb-12 relative">
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
            <button onClick={handleReplyClick} className="btn btn-primary gap-2 flex-1 md:flex-none">
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
              <p className="font-medium text-base-content">{inquiry.email || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center text-primary shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-base-content/40 tracking-wider">Phone Number</p>
              <div className="flex items-center gap-2">
                <p className="font-medium text-base-content">{inquiry.phone || 'Not provided'}</p>
                {inquiry.phone && (
                  <div className="flex gap-1">
                    <a href={`tel:${inquiry.phone}`} className="btn btn-xs btn-circle btn-ghost text-green-600" title="Call">
                      <Phone size={12} />
                    </a>
                    <a href={`sms:${inquiry.phone}`} className="btn btn-xs btn-circle btn-ghost text-blue-600" title="SMS">
                      <MessageSquare size={12} />
                    </a>
                  </div>
                )}
              </div>
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

      {/* Reply Modal */}
      {isReplyModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsReplyModalOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-primary px-6 py-4 flex items-center justify-between text-white shrink-0">
              <h3 className="font-bold text-lg">Reply to {inquiry.name}</h3>
              <button onClick={() => setIsReplyModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="form-control mb-4">
                <label className="label"><span className="label-text font-bold">To:</span></label>
                <input type="text" value={inquiry.email} disabled className="input input-bordered w-full bg-base-100" />
              </div>
              
              <div className="form-control mb-4">
                <label className="label"><span className="label-text font-bold">Message:</span></label>
                <textarea 
                  className="textarea textarea-bordered h-48 resize-none focus:outline-none focus:border-primary text-base"
                  placeholder="Type your reply here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  autoFocus
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-base-200 flex justify-end gap-2 bg-base-50 shrink-0">
              <button onClick={() => setIsReplyModalOpen(false)} className="btn btn-ghost">Cancel</button>
              <button 
                onClick={sendEmailReply} 
                disabled={sendingEmail || !replyMessage.trim()} 
                className="btn btn-primary gap-2"
              >
                {sendingEmail ? 'Sending...' : <><Send size={18} /> Send Email</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}