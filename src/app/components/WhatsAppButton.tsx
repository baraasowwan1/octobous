import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function WhatsAppButton() {
  const { language } = useLanguage();
  const phoneNumber = '962799010111';
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 z-50 group"
      style={{
        [language === 'ar' ? 'left' : 'right']: '1.5rem',
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#20BA5A] transition-all hover:scale-110">
          <MessageCircle className="w-7 h-7" />
        </div>
      </div>
    </a>
  );
}
