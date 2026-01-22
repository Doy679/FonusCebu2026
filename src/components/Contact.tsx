import { siteData } from '@/data/siteData';
import { Phone } from 'lucide-react';

export default function Contact() {
  return (
    <section id="location" className="map-section w-full h-[450px] relative bg-gray-200">
      <div className="container mx-auto px-4 h-full relative">
        <div className="map-overlay absolute top-1/2 left-4 md:left-10 -translate-y-1/2 bg-white p-10 rounded-2xl shadow-2xl max-w-md z-10">
          <h3 className="text-2xl font-serif font-bold mb-4 text-primary">Visit Our Office</h3>
          <p className="mb-6 text-base-content/70 text-sm leading-relaxed">
            <strong className="text-primary">{siteData.general.name}</strong><br />
            {siteData.contact.address}<br />
            Philippines
          </p>
          <div className="flex gap-3 items-center text-primary font-bold mb-8">
            <Phone size={20} className="text-accent" />
            <span>{siteData.contact.phone.join(' / ')}</span>
          </div>
          <a 
            href="https://www.google.com/maps/dir//R.+Colina,+Mandaue+City,+Cebu" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary w-full justify-center bg-accent text-primary border-none hover:bg-[#b08d4b] hover:text-white rounded-full py-4 h-auto min-h-0 font-bold uppercase tracking-wider text-xs"
          >
            Get Directions
          </a>
        </div>
      </div>
      
      {/* Google Map Embed */}
      <div className="absolute inset-0 z-0">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.127818784742!2d123.9333913!3d10.3316667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a9990b7964095b%3A0x1c0f055677949514!2sR.+Colina+St%2C+Mandaue+City%2C+Cebu!5e0!3m2!1sen!2sph!4v1652341234567!5m2!1sen!2sph" 
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(20%) contrast(1.1)' }}
          allowFullScreen
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Office Location"
        />
      </div>
    </section>
  );
}
