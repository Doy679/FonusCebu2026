"use client";

import { useEffect, useState } from 'react';
import { Inquiry } from '@/backend/types';
import { Mail, Search, X, Send } from 'lucide-react';
import Link from 'next/link';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'inbox' | 'archived'>('inbox');
  
  // Reply Modal State
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

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

  const filteredInquiries = inquiries.filter(i => {
    const matchesFilter = 
      i.name.toLowerCase().includes(filter.toLowerCase()) || 
      i.email.toLowerCase().includes(filter.toLowerCase()) ||
      i.subject.toLowerCase().includes(filter.toLowerCase());
    
    if (activeTab === 'inbox') {
      return matchesFilter && i.status !== 'ARCHIVED';
    } else {
      return matchesFilter && i.status === 'ARCHIVED';
    }
  });

  const handleReplyClick = (e: React.MouseEvent, inquiry: Inquiry) => {
    e.preventDefault(); // Prevent navigating to details page
    e.stopPropagation();
    setSelectedInquiry(inquiry);
    setReplyText('');
  };

  const updateStatus = async (e: React.MouseEvent, id: string, newStatus: 'ARCHIVED' | 'READ') => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setInquiries(prev => prev.map(i => 
          i.id === id ? { ...i, status: newStatus } : i
        ));
      }
    } catch (error) {
      console.error(`Failed to update inquiry status to ${newStatus}:`, error);
    }
  };

  const closeReplyModal = () => {
    setSelectedInquiry(null);
    setReplyText('');
  };

  const sendReply = async () => {
    if (!selectedInquiry) return;
    
    setIsSending(true);
    
    try {
      const res = await fetch('/api/email/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedInquiry.email,
          subject: `Re: ${selectedInquiry.subject}`,
          message: replyText
        })
      });

      if (res.ok) {
        alert('Reply sent successfully!');
        closeReplyModal();
      } else {
        alert('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('An error occurred.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto animate-fade-in relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-base-content">Inquiries</h1>
            <p className="text-base-content/60 mt-1">Manage and respond to customer messages</p>
          </div>
          
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-4 top-4 text-base-content/40" size={22} />
            <input 
              type="text" 
              placeholder="Search inquiries..." 
              className="input input-bordered input-lg h-14 pl-12 w-full md:w-96 bg-white shadow-sm focus:border-primary focus:outline-none text-lg rounded-xl"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs with Sliding Animation */}
        <div className="relative flex bg-white mb-8 w-fit shadow-md border border-base-200 p-1.5 rounded-2xl overflow-hidden">
          {/* Sliding Pill */}
          <div 
            className="absolute top-1.5 bottom-1.5 transition-all duration-300 ease-out bg-primary rounded-xl shadow-lg"
            style={{
              left: activeTab === 'inbox' ? '6px' : '174px',
              width: activeTab === 'inbox' ? '160px' : '180px'
            }}
          />
          
          <button 
            className={`relative z-10 h-14 w-[160px] flex items-center justify-center text-lg font-bold transition-colors duration-300 active:scale-95 ${
              activeTab === 'inbox' ? 'text-white' : 'text-base-content/60 hover:text-primary'
            }`}
            onClick={() => setActiveTab('inbox')}
          >
            Inbox
            <span className={`badge badge-md ml-3 transition-colors duration-300 ${
              activeTab === 'inbox' ? 'badge-ghost text-primary' : 'badge-ghost opacity-70'
            }`}>
              {inquiries.filter(i => i.status !== 'ARCHIVED').length}
            </span>
          </button>

          <button 
            className={`relative z-10 h-14 w-[180px] flex items-center justify-center text-lg font-bold transition-colors duration-300 active:scale-95 ${
              activeTab === 'archived' ? 'text-white' : 'text-base-content/60 hover:text-primary'
            }`}
            onClick={() => setActiveTab('archived')}
          >
            Archived
            <span className={`badge badge-md ml-3 transition-colors duration-300 ${
              activeTab === 'archived' ? 'badge-ghost text-primary' : 'badge-ghost opacity-70'
            }`}>
              {inquiries.filter(i => i.status === 'ARCHIVED').length}
            </span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <div key={activeTab} className="grid gap-4 animate-slide-up">
            {filteredInquiries.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-box shadow-sm">
                <Mail className="mx-auto text-base-content/20 mb-4" size={48} />
                <h3 className="text-lg font-medium text-base-content/60">
                  {activeTab === 'inbox' ? 'No new inquiries' : 'No archived inquiries'}
                </h3>
              </div>
            ) : (
              filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="bg-white p-10 rounded-box shadow-sm border border-base-200 hover:shadow-md transition-all relative overflow-hidden group">
                  <Link href={`/admin/inquiries/${inquiry.id}`} className="block">
                    {inquiry.status === 'NEW' && (
                      <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full m-4" title="New Message"></div>
                    )}
                    
                    <div className="flex flex-col md:flex-row gap-10">
                      <div className="flex-shrink-0 flex flex-col gap-3 min-w-[260px]">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                            {inquiry.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-base-content">{inquiry.name}</h3>
                            <p className="text-sm text-base-content/60">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-base text-base-content/70 mt-3 bg-base-100 p-3 rounded-xl">
                          <Mail size={16} /> 
                          <span className="truncate max-w-[200px]">{inquiry.email}</span>
                        </div>
                      </div>
                      
                      <div className="flex-grow border-l border-base-200 md:pl-10 pt-4 md:pt-0">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-2xl text-primary">{inquiry.subject}</h4>
                          <span className={`badge ${inquiry.status === 'NEW' ? 'badge-primary' : 'badge-ghost'} badge-md uppercase font-bold tracking-wide py-3 px-4`}>
                            {inquiry.status}
                          </span>
                        </div>
                        <p className="text-base-content font-medium text-lg whitespace-pre-wrap leading-relaxed">
                          {inquiry.message}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="flex flex-row md:flex-col justify-center gap-3 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-base-200 md:pl-10 min-w-[150px] md:absolute md:right-10 md:bottom-10 md:top-auto">
                    <button 
                      className="btn btn-md btn-primary w-full md:w-auto active:scale-95 transition-all ripple-effect text-base z-10 relative"
                      onClick={(e) => handleReplyClick(e, inquiry)}
                    >
                      Reply
                    </button>
                    
                    {inquiry.status !== 'ARCHIVED' ? (
                      <button 
                        className="btn btn-md btn-ghost w-full md:w-auto text-base-content/60 active:scale-95 transition-all ripple-effect text-base z-10 relative"
                        onClick={(e) => updateStatus(e, inquiry.id, 'ARCHIVED')}
                      >
                        Archive
                      </button>
                    ) : (
                      <button 
                        className="btn btn-md btn-ghost w-full md:w-auto text-primary active:scale-95 transition-all ripple-effect text-base z-10 relative"
                        onClick={(e) => updateStatus(e, inquiry.id, 'READ')}
                      >
                        Unarchive
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh] animate-zoom-in animate-slide-up overflow-hidden">
            {/* Modal Header */}
            <div className="bg-primary px-6 py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  {selectedInquiry.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">Reply to {selectedInquiry.name}</h3>
                  <p className="text-xs text-white/70">via Email</p>
                </div>
              </div>
              <button 
                onClick={closeReplyModal}
                className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-6">
              <div className="grid grid-cols-[80px_1fr] gap-4 items-start text-sm">
                <span className="text-base-content/60 font-medium text-right pt-2">To:</span>
                <div className="bg-base-100 px-4 py-2 rounded-xl text-base-content font-medium border border-base-200">
                  {selectedInquiry.email}
                </div>
                
                <span className="text-base-content/60 font-medium text-right pt-2">Subject:</span>
                <div className="bg-base-100 px-4 py-2 rounded-xl text-base-content font-medium border border-base-200">
                  Re: {selectedInquiry.subject}
                </div>

                <span className="text-base-content/60 font-medium text-right pt-2">Inquiry:</span>
                <div className="bg-primary/5 p-4 rounded-xl text-base-content/80 border border-primary/10 italic text-base">
                  &quot;{selectedInquiry.message}&quot;
                </div>

                <span className="text-base-content/60 font-medium text-right pt-2">Reply:</span>
                <div className="form-control w-full">
                  <textarea 
                    className="textarea textarea-bordered w-full min-h-[300px] text-base focus:border-primary focus:outline-none resize-none p-4 rounded-xl"
                    placeholder="Type your reply message here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    autoFocus
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-base-100 border-t border-base-200 flex justify-between items-center shrink-0">
              <span className="text-xs text-base-content/50 italic">
                A copy of this email will be sent to your admin address.
              </span>
              <div className="flex gap-3">
                <button 
                  className="btn btn-ghost"
                  onClick={closeReplyModal}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary px-6 ripple-effect"
                  onClick={sendReply}
                  disabled={!replyText.trim() || isSending}
                >
                  {isSending ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <>
                      <Send size={16} /> Send Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
