"use client";

import { useState, useEffect } from 'react';
import { X, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface PlanInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

export default function PlanInquiryModal({ isOpen, onClose, planName }: PlanInquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    message: '',
    bot_trap: '' 
  });
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validatePhone = (phone: string) => {
    const regex = /^(09|\+639)\d{9}$/;
    return regex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.bot_trap) {
      setStatus('SUCCESS'); 
      return;
    }

    if (!validatePhone(formData.phone)) {
      setErrorMsg('Please enter a valid PH phone number (e.g., 09171234567)');
      return;
    }

    setStatus('LOADING');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          plan: planName,
          subject: `Inquiry for ${planName} Plan`,
          message: formData.message || `I am interested in the ${planName} plan.`
        }),
      });

      if (res.ok) {
        setStatus('SUCCESS');
        setTimeout(() => {
          onClose();
          setStatus('IDLE');
          setFormData({ name: '', phone: '', address: '', email: '', message: '', bot_trap: '' });
        }, 2000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to submit. Please try again.');
        setStatus('ERROR');
      }
    } catch (error) {
      setErrorMsg('A connection error occurred.');
      setStatus('ERROR');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Compact Header */}
        <div className="bg-primary px-5 py-3 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <h3 className="font-serif font-bold text-lg tracking-wide text-white">Get {planName}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar bg-base-100 flex-1">
          {status === 'SUCCESS' ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 min-h-[300px]">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-primary mb-1">Message Sent!</h4>
                <p className="text-sm text-base-content/70">
                  We will contact you shortly about the<br/><strong>{planName} Plan</strong>.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 h-full">
              
              <input 
                type="text" 
                name="bot_trap" 
                value={formData.bot_trap} 
                onChange={handleChange} 
                className="hidden" 
                autoComplete="off"
              />

              <div className="form-control">
                <label className="label py-0 pb-1"><span className="label-text font-bold text-primary/70 text-[10px] uppercase tracking-wider">Full Name</span></label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white focus:border-primary focus:outline-none rounded-xl h-10 text-sm" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label py-0 pb-1"><span className="label-text font-bold text-primary/70 text-[10px] uppercase tracking-wider">Phone</span></label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    className={`input input-bordered w-full bg-white focus:border-primary focus:outline-none rounded-xl h-10 text-sm ${errorMsg.includes('phone') ? 'border-error' : ''}`} 
                    required 
                  />
                </div>
                <div className="form-control">
                  <label className="label py-0 pb-1"><span className="label-text font-bold text-primary/70 text-[10px] uppercase tracking-wider">Email (Optional)</span></label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-white focus:border-primary focus:outline-none rounded-xl h-10 text-sm" 
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label py-0 pb-1"><span className="label-text font-bold text-primary/70 text-[10px] uppercase tracking-wider">Complete Address</span></label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white focus:border-primary focus:outline-none rounded-xl h-10 text-sm" 
                  required 
                />
              </div>

              <div className="form-control flex-1 min-h-[60px]">
                <label className="label py-0 pb-1"><span className="label-text font-bold text-primary/70 text-[10px] uppercase tracking-wider">Notes (Optional)</span></label>
                <textarea 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full bg-white focus:border-primary focus:outline-none rounded-xl resize-none p-3 text-sm h-full min-h-[60px]" 
                ></textarea>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-error text-xs font-bold bg-error/5 p-2 rounded-lg border border-error/20">
                  <AlertCircle size={14} /> {errorMsg}
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === 'LOADING'}
                className="btn btn-primary w-full rounded-xl h-11 min-h-[2.75rem] shadow-md transition-all font-bold uppercase tracking-widest text-sm mt-1"
              >
                {status === 'LOADING' ? (
                  <><Loader2 className="animate-spin" size={16} /> sending...</>
                ) : (
                  <>Submit Application <Send size={16} /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
