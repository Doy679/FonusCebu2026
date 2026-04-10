"use client";

import { siteData } from '@/data/siteData';
import { Send, User, MessageSquare, Mail, Loader2, CheckCircle } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { Reveal } from './Reveal';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('LOADING');
    
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('SUCCESS');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('IDLE'), 3000);
      } else {
        setStatus('ERROR');
      }
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="location" className="py-20 bg-base-100 relative z-10 scroll-mt-24">
      <div className="container mx-auto px-4">
        <Reveal width="100%">
          <div className="flex flex-col lg:flex-row rounded-[30px] overflow-hidden shadow-2xl border border-black/5 bg-white">
            
            {/* Map Section - 50% */}
            <div className="lg:w-1/2 h-[400px] lg:h-auto relative min-h-[400px] bg-gray-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.127818784742!2d123.9333913!3d10.3316667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a9990b7964095b%3A0x1c0f055677949514!2sR.+Colina+St%2C+Mandaue+City%2C+Cebu!5e0!3m2!1sen!2sph!4v1652341234567!5m2!1sen!2sph" 
                className="absolute inset-0 w-full h-full border-0 grayscale-[20%] contrast-[1.1]"
                allowFullScreen
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              />
            </div>

            {/* Form Section - 50% */}
            <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-primary to-secondary text-white relative overflow-hidden">
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              
              <div className="mb-8 relative z-10">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Send us a Message</h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  Have questions about our plans? We&apos;re here to help. Send us a message and we&apos;ll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-white/60">Your Name</span></label>
                    <div className="relative group">
                      <User size={16} className="absolute left-3 top-3.5 text-primary/40 group-focus-within:text-accent transition-colors" />
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="" 
                        className="input input-bordered w-full pl-10 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none rounded-xl bg-white text-primary transition-all shadow-sm" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="form-control w-full">
                    <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-white/60">Email Address</span></label>
                    <div className="relative group">
                      <Mail size={16} className="absolute left-3 top-3.5 text-primary/40 group-focus-within:text-accent transition-colors" />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="" 
                        className="input input-bordered w-full pl-10 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none rounded-xl bg-white text-primary transition-all shadow-sm" 
                        required 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-control w-full">
                  <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-white/60">Subject</span></label>
                  <div className="relative group">
                    <MessageSquare size={16} className="absolute left-3 top-3.5 text-primary/40 group-focus-within:text-accent transition-colors" />
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Inquiry about..." 
                      className="input input-bordered w-full pl-10 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none rounded-xl bg-white text-primary transition-all shadow-sm" 
                      required 
                    />
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-white/60">Message</span></label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="textarea textarea-bordered min-h-[120px] focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none rounded-xl bg-white text-primary resize-none transition-all shadow-sm w-full p-4" 
                    placeholder="How can we help you today?" 
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'LOADING' || status === 'SUCCESS'}
                  className={`btn border-none rounded-xl mt-4 w-full h-auto py-4 font-bold uppercase tracking-widest shadow-lg transition-all transform hover:-translate-y-1 active:scale-[0.98] ${
                    status === 'SUCCESS' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-accent text-primary hover:bg-white hover:text-primary'
                  }`}
                >
                  {status === 'LOADING' ? (
                    <><Loader2 className="animate-spin" size={18} /> Sending...</>
                  ) : status === 'SUCCESS' ? (
                    <><CheckCircle size={18} /> Message Sent!</>
                  ) : (
                    <><Send size={18} /> Send Message</>
                  )}
                </button>
                {status === 'ERROR' && <p className="text-red-200 text-sm mt-2 text-center">Something went wrong. Please try again.</p>}
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
