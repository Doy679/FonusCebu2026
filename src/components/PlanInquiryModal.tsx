"use client";

import { useState, useEffect } from 'react';
import { X, Send, Loader2, CheckCircle } from 'lucide-react';

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
    message: ''
  });
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          setFormData({ name: '', phone: '', address: '', email: '', message: '' });
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
    <div className="fixed inset-0 z-[1002] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between text-white">
          <h3 className="font-serif font-bold text-xl tracking-wide">Get {planName}</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          {status === 'SUCCESS' ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle size={32} />
              </div>
              <h4 className="text-2xl font-serif font-bold text-primary">Request Sent!</h4>
              <p className="text-base-content/70">Thank you for choosing {planName}.<br/>Our team will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-sm text-base-content/70 mb-2">Please fill out your details so we can assist you with your application.</p>
              
              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/60">Full Name *</span></label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:border-primary focus:outline-none rounded-lg" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/60">Phone Number *</span></label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    className="input input-bordered w-full focus:border-primary focus:outline-none rounded-lg" 
                    required 
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/60">Email Address</span></label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered w-full focus:border-primary focus:outline-none rounded-lg" 
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/60">Complete Address *</span></label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:border-primary focus:outline-none rounded-lg" 
                  required 
                />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/60">Additional Notes (Optional)</span></label>
                <textarea 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-24 focus:border-primary focus:outline-none rounded-lg resize-none" 
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === 'LOADING'}
                className="btn btn-primary w-full mt-4 rounded-xl shadow-lg hover:shadow-primary/30"
              >
                {status === 'LOADING' ? <><Loader2 className="animate-spin" size={18} /> Submitting...</> : <><Send size={18} /> Submit Application</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
