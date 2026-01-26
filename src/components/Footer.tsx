import { siteData } from '@/data/siteData';
import { Facebook, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#380404] text-[#dcdcdc] py-16">
      <div className="container mx-auto px-4 text-center flex flex-col items-center">
        {/* Full Logo Lockup */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
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

        <p className="max-w-md mx-auto mb-8 text-white/70">
          Decent yet affordable and dignified funeral and memorial services.
        </p>

        {/* Contact Info Block */}
        <div className="flex flex-col items-center gap-4 mb-10 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-accent shrink-0" />
            <span>{siteData.contact.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-accent shrink-0" />
            <span className="flex gap-2 flex-wrap justify-center">
              {siteData.contact.phone.map((p, i) => (
                <span key={i}>{p}{i < siteData.contact.phone.length - 1 && " /"}</span>
              ))}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-accent shrink-0" />
            <span className="flex gap-2 flex-wrap justify-center">
              {siteData.contact.emails?.map((e, i) => (
                <span key={i}>{e}{i < (siteData.contact.emails?.length || 0) - 1 && " /"}</span>
              ))}
            </span>
          </div>
        </div>
        
        <div className="flex justify-center gap-6 mb-12">
          <a 
            href={siteData.contact.facebook} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-accent transition-colors"
            title="Facebook"
          >
            <Facebook size={28} />
          </a>
          <a 
            href={`mailto:${siteData.contact.email}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-accent transition-colors"
            title="Gmail"
          >
            <Mail size={28} />
          </a>
        </div>

        <div className="footer-bottom pt-8 border-t border-white/10 text-sm text-white/40">
          &copy; {currentYear} {siteData.general.fullName}. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
