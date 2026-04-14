import { useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { gsap } from 'gsap';

const WhatsAppButton = () => {
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (btnRef.current) {
      gsap.fromTo(btnRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 1 });
    }
  }, []);

  return (
    <a
      ref={btnRef}
      href="https://wa.me/8801791208768"
      target="_blank"
      rel="noopener noreferrer"
      title="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 group"
      style={{ backgroundColor: '#25D366', opacity: 0 }}
    >
      <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: '#25D366' }} />
      <MessageCircle className="h-7 w-7 text-white fill-white" />
      <span className="absolute right-16 bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        WhatsApp-এ চ্যাট করুন
      </span>
    </a>
  );
};

export default WhatsAppButton;
