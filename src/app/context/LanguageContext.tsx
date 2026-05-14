import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    about: 'من نحن',
    portfolio: 'أعمالنا',
    contact: 'اتصل بنا',

    // Home Page
    welcomeTitle: 'أوكتوبوس لتصميم الملصقات',
    welcomeSubtitle: 'متخصصون في ملصقات السيارات والتصاميم الفريدة',
    ourServices: 'خدماتنا',
    service1Title: 'تغيير ألوان السيارات',
    service1Desc: 'تغيير شامل للون سيارتك بأفضل المواد',
    service2Title: 'تصاميم متنوعة',
    service2Desc: 'تصاميم مبتكرة وفريدة تناسب ذوقك',
    service3Title: 'كاربون فايبر للداخلية',
    service3Desc: 'تحويل داخلية سيارتك بتأثيرات الكاربون فايبر',
    qualityGuarantee: 'نضمن جودة جميع أعمالنا',
    uniqueDesigns: 'نسعى دائماً للتصاميم الفريدة',

    // About Page
    aboutTitle: 'من نحن',
    aboutDesc: 'أوكتوبوس لتصميم الملصقات هي شركة متخصصة في ملصقات السيارات والتصاميم الفريدة. نحن نقدم أعلى مستويات الجودة والإبداع في كل عمل نقوم به.',
    whyChooseUs: 'لماذا تختارنا',
    quality: 'جودة مضمونة',
    qualityDesc: 'نستخدم أفضل المواد ونضمن جودة جميع أعمالنا',
    creativity: 'إبداع فريد',
    creativityDesc: 'نسعى دائماً لتقديم تصاميم فريدة ومبتكرة',
    experience: 'خبرة واسعة',
    experienceDesc: 'فريق محترف مع سنوات من الخبرة في المجال',

    // Portfolio Page
    portfolioTitle: 'معرض أعمالنا',
    portfolioDesc: 'اطلع على بعض من أفضل أعمالنا في تصميم وتطبيق ملصقات السيارات',
    viewProject: 'عرض المشروع',

    // Contact Page
    contactTitle: 'اتصل بنا',
    contactDesc: 'نحن هنا للإجابة على استفساراتك وتحقيق رؤيتك',
    getInTouch: 'تواصل معنا',
    phone: 'الهاتف',
    location: 'الموقع',
    businessHours: 'ساعات العمل',
    followUs: 'تابعنا',
    sunday: 'الأحد',
    monday: 'الاثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة',
    saturday: 'السبت',
    closed: 'مغلق',
  },
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    portfolio: 'Portfolio',
    contact: 'Contact',

    // Home Page
    welcomeTitle: 'OCTOPUS Stickers Designer',
    welcomeSubtitle: 'Specialists in car stickers and unique designs',
    ourServices: 'Our Services',
    service1Title: 'Car Color Changes',
    service1Desc: 'Complete color transformation with premium materials',
    service2Title: 'Various Designs',
    service2Desc: 'Innovative and unique designs tailored to your taste',
    service3Title: 'Carbon Fiber Interior',
    service3Desc: 'Transform your car interior with carbon fiber effects',
    qualityGuarantee: 'We guarantee the quality of all our work',
    uniqueDesigns: 'We always strive for unique designs',

    // About Page
    aboutTitle: 'About Us',
    aboutDesc: 'OCTOPUS Stickers Designer is a company specialized in car stickers and unique designs. We provide the highest levels of quality and creativity in every project we undertake.',
    whyChooseUs: 'Why Choose Us',
    quality: 'Guaranteed Quality',
    qualityDesc: 'We use the best materials and guarantee all our work',
    creativity: 'Unique Creativity',
    creativityDesc: 'We always strive to deliver unique and innovative designs',
    experience: 'Extensive Experience',
    experienceDesc: 'Professional team with years of experience in the field',

    // Portfolio Page
    portfolioTitle: 'Our Portfolio',
    portfolioDesc: 'Browse some of our best work in car sticker design and application',
    viewProject: 'View Project',

    // Contact Page
    contactTitle: 'Contact Us',
    contactDesc: 'We are here to answer your questions and bring your vision to life',
    getInTouch: 'Get In Touch',
    phone: 'Phone',
    location: 'Location',
    businessHours: 'Business Hours',
    followUs: 'Follow Us',
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    closed: 'Closed',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ar] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
