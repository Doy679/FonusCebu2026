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
    bot_trap: '' // Honeypot field
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
    // Basic PH Phone validation: 09XXXXXXXXX or +639XXXXXXXXX
    const regex = /^(09|\+639)\d{9}$/;
    return regex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Check Trap Variable (Honeypot)
    if (formData.bot_trap) {
      console.log("Bot detected");
      setStatus('SUCCESS'); // Pretend it worked
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
        setStatus('ERROR');
      }
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4 py-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">
        
        {/* Fixed Header */}
        <div className="bg-primary px-6 py-5 flex items-center justify-between text-white shrink-0">
          <div>
            <h3 className="font-serif font-bold text-xl tracking-wide">Application Form</h3>
            <p className="text-[10px] text-accent font-bold uppercase tracking-widest">{planName} Plan</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          {status === 'SUCCESS' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle size={40} />
              </div>
              <h4 className="text-2xl font-serif font-bold text-primary">Request Sent!</h4>
              <p className="text-base-content/70">Our team will contact you shortly regarding your {planName} plan application.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Trap Variable (Hidden from humans) */}
              <input 
                type="text" 
                name="bot_trap" 
                value={formData.bot_trap} 
                onChange={handleChange} 
                className="hidden" 
                autoComplete="off"
              />

              <div className="form-control">
                <label className="label pt-0"><span className="label-text font-bold text-primary/60 text-xs uppercase">Full Name</span></label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="e.g. Juan Dela Cruz"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-base-100 focus:border-primary focus:outline-none rounded-xl h-12" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label pt-0"><span className="label-text font-bold text-primary/60 text-xs uppercase">Phone Number</span></label>
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="09XXXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`input input-bordered w-full bg-base-100 focus:border-primary focus:outline-none rounded-xl h-12 ${errorMsg ? 'border-error' : ''}`} 
                    required 
                  />
                </div>
                <div className="form-control">
                  <label className="label pt-0"><span className="label-text font-bold text-primary/60 text-xs uppercase">Email (Optional)</span></label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-base-100 focus:border-primary focus:outline-none rounded-xl h-12" 
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label pt-0"><span className="label-text font-bold text-primary/60 text-xs uppercase">Full Address</span></label>
                <input 
                  type="text" 
                  name="address" 
                  placeholder="Street, Barangay, City, Province"
                  value={formData.address}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-base-100 focus:border-primary focus:outline-none rounded-xl h-12" 
                  required 
                />
              </div>

              <div className="form-control">
                <label className="label pt-0"><span className="label-text font-bold text-primary/60 text-xs uppercase">Additional Message</span></label>
                <textarea 
                  name="message" 
                  placeholder="Tell us more about your needs..."
                  value={formData.message}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-24 bg-base-100 focus:border-primary focus:outline-none rounded-xl resize-none" 
                ></textarea>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-error text-xs font-bold bg-error/10 p-3 rounded-lg border border-error/20">
                  <AlertCircle size={14} /> {errorMsg}
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === 'LOADING'}
                className="btn btn-primary w-full rounded-xl h-14 shadow-lg hover:shadow-primary/30 transition-all font-bold uppercase tracking-widest"
              >
                {status === 'LOADING' ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : <><Send size={20} /> Submit Inquiry</>}
              </button>
            </form>
          )}
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: oklch(28% 0.08 20);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}