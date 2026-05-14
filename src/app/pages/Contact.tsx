import { useLanguage } from '../context/LanguageContext';
import { Phone, Clock, Facebook, Instagram, MapPin } from 'lucide-react';

export function Contact() {
  const { t } = useLanguage();

  const businessHours = [
    { day: t('sunday'), hours: '9:00 AM - 9:00 PM' },
    { day: t('monday'), hours: '9:00 AM - 9:00 PM' },
    { day: t('tuesday'), hours: '9:00 AM - 9:00 PM' },
    { day: t('wednesday'), hours: '9:00 AM - 9:00 PM' },
    { day: t('thursday'), hours: '9:00 AM - 9:00 PM' },
    { day: t('friday'), hours: t('closed') },
    { day: t('saturday'), hours: '9:00 AM - 9:00 PM' },
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl text-center mb-6">{t('contactTitle')}</h1>
          <p className="text-xl text-center text-muted-foreground mb-16">
            {t('contactDesc')}
          </p>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl mb-6">{t('getInTouch')}</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="mb-2">{t('phone')}</h3>
                      <a href="tel:+962799010111" className="text-muted-foreground hover:text-primary transition-colors" dir="ltr">+962 79 901 0111</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="mb-2">{t('location')}</h3>
                      <p className="text-muted-foreground">Jordan, Amman</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-lg">
                <div className="flex items-start gap-4 mb-4">
                  <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <h3>{t('businessHours')}</h3>
                </div>
                <div className="space-y-2">
                  {businessHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-border last:border-0"
                    >
                      <span className="text-muted-foreground">{schedule.day}</span>
                      <span className={schedule.hours === t('closed') ? 'text-destructive' : ''} dir="ltr">
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h3 className="mb-4">{t('followUs')}</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.facebook.com/Octopusstickers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.instagram.com/octopus_stickers_designer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.4421634897973!2d35.8917!3d31.9539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDU3JzE0LjAiTiAzNcKwNTMnMzAuMSJF!5e0!3m2!1sen!2sjo!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="OCTOPUS Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
