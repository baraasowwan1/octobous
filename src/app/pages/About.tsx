import { useLanguage } from '../context/LanguageContext';
import { CheckCircle, Lightbulb, Award } from 'lucide-react';

export function About() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: t('quality'),
      description: t('qualityDesc'),
    },
    {
      icon: <Lightbulb className="w-12 h-12" />,
      title: t('creativity'),
      description: t('creativityDesc'),
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: t('experience'),
      description: t('experienceDesc'),
    },
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl text-center mb-8">{t('aboutTitle')}</h1>
          <p className="text-xl text-center text-muted-foreground mb-16">
            {t('aboutDesc')}
          </p>

          <h2 className="text-4xl text-center mb-12">{t('whyChooseUs')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
