import { siteData } from '@/data/siteData';
import { Facebook, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#2a1b18] text-[#dcdcdc] py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="footer-logo font-serif text-4xl text-white mb-6">
          {siteData.general.name}
        </div>
        <p className="max-w-md mx-auto mb-10 text-white/70">
          Decent yet affordable and dignified funeral and memorial services.
        </p>
        
        <div className="flex justify-center gap-6 mb-12">
          <a href="#" className="text-white hover:text-accent transition-colors">
            <Facebook size={28} />
          </a>
          <a href={`mailto:${siteData.contact.email}`} className="text-white hover:text-accent transition-colors">
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
