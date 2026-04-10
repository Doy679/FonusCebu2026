import { siteData } from '@/data/siteData';
import { Facebook, Mail, MapPin, Phone, Clock, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#380404] text-[#dcdcdc] py-20 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Full Logo Lockup */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="bg-white p-0.5 rounded-full relative h-16 w-16 overflow-hidden border border-white/20">
              <Image 
                src="/fonus.webp" 
                alt="FONUS Logo" 
                fill
                className="object-cover scale-[1.6] origin-top"
                sizes="64px"
              />
            </div>
            <div className="flex flex-col text-center sm:text-left">
              <span className="font-serif font-bold text-3xl text-white tracking-wide leading-none">
                {siteData.general.name}
              </span>
              <span className="text-[11px] text-white/80 font-medium tracking-widest uppercase leading-tight">
                Federation of Cooperative
              </span>
            </div>
            <div className="bg-white p-0.5 rounded-full relative h-16 w-16 overflow-hidden border border-white/20">
              <Image 
                src="/coop.png" 
                alt="Coop Logo" 
                fill
                className="object-contain scale-125"
                sizes="64px"
              />
            </div>
          </div>

          <p className="max-w-md mx-auto mb-12 text-center text-white/70 italic font-serif">
            &quot;Decent yet affordable and dignified funeral and memorial services.&quot;
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full max-w-6xl mb-16">
            
            {/* Contact Information */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <h4 className="text-accent font-bold uppercase tracking-widest text-xs mb-2">Connect With Us</h4>
              <div className="flex items-start gap-3 text-sm text-white/80 group">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-center md:text-left leading-relaxed">{siteData.contact.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80 group">
                <Phone size={18} className="text-accent shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col gap-1">
                  {siteData.contact.phone.map((p, i) => (
                    <span key={i}>{p}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Hours & Availability */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <h4 className="text-accent font-bold uppercase tracking-widest text-xs mb-2">Service Hours</h4>
              <div className="flex items-start gap-3 text-sm text-white/80 group">
                <Clock size={18} className="text-accent shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-white">Emergency Response: 24/7</span>
                  <span className="text-xs text-white/60">Office: Mon-Sat 8:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>

            {/* Official Registration */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <h4 className="text-accent font-bold uppercase tracking-widest text-xs mb-2">Trust & Safety</h4>
              <div className="flex items-start gap-3 text-sm text-white/80 group">
                <ShieldCheck size={18} className="text-accent shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-white">CDA Registered</span>
                  <span className="text-[10px] text-white/60 font-mono tracking-tighter uppercase">{siteData.general.registrationNumber}</span>
                </div>
              </div>
            </div>

            {/* Social & Direct */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <h4 className="text-accent font-bold uppercase tracking-widest text-xs mb-2">Follow Us</h4>
              <div className="flex gap-4">
                <a 
                  href={siteData.contact.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-accent hover:text-white transition-all hover:-translate-y-1 shadow-lg"
                  title="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href={`mailto:${siteData.contact.email}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-accent hover:text-white transition-all hover:-translate-y-1 shadow-lg"
                  title="Email"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>

          </div>

          <div className="w-full pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <div>&copy; {currentYear} {siteData.general.fullName}. All Rights Reserved.</div>
            <div className="flex gap-6 uppercase tracking-widest font-bold text-[10px]">
              <a href="#about" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#about" className="hover:text-accent transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
