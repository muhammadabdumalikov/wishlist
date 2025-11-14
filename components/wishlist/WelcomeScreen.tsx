'use client';

import { Gift, Heart, Star, Share2, Lock } from 'react-feather';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  currentLang: 'en' | 'ru' | 'uz';
}

const translations = {
  en: {
    title: 'Welcome to Your Wishlist',
    subtitle: 'Create, manage, and share your dream wishlist with friends and family',
    getStarted: 'Get Started',
    features: [
      {
        icon: Gift,
        title: 'Create Your Wishlist',
        description: 'Add unlimited items with images and links to products you love',
      },
      {
        icon: Share2,
        title: 'Share Easily',
        description: 'Get a unique link to share your wishlist with anyone',
      },
      {
        icon: Lock,
        title: 'Private & Secure',
        description: 'Your wishlist is private and only accessible with your account',
      },
    ],
  },
  ru: {
    title: 'Добро пожаловать в ваш список желаний',
    subtitle: 'Создавайте, управляйте и делитесь списком желаний с друзьями и семьей',
    getStarted: 'Начать',
    features: [
      {
        icon: Gift,
        title: 'Создайте свой список',
        description: 'Добавляйте неограниченное количество товаров с изображениями и ссылками',
      },
      {
        icon: Share2,
        title: 'Легко делитесь',
        description: 'Получите уникальную ссылку для обмена списком с кем угодно',
      },
      {
        icon: Lock,
        title: 'Приватно и безопасно',
        description: 'Ваш список приватный и доступен только с вашей учетной записью',
      },
    ],
  },
  uz: {
    title: 'Istaklar ro\'yxatingizga xush kelibsiz',
    subtitle: 'Do\'stlar va oila a\'zolari bilan istaklar ro\'yxatingizni yarating, boshqaring va ulashing',
    getStarted: 'Boshlash',
    features: [
      {
        icon: Gift,
        title: 'Ro\'yxatingizni yarating',
        description: 'Yoqtirgan mahsulotlaringizni rasm va havolalar bilan qo\'shing',
      },
      {
        icon: Share2,
        title: 'Oson ulashing',
        description: 'Ro\'yxatingizni har kim bilan ulashish uchun noyob havola oling',
      },
      {
        icon: Lock,
        title: 'Xavfsiz va shaxsiy',
        description: 'Ro\'yxatingiz shaxsiy va faqat sizning hisobingiz orqali ochiladi',
      },
    ],
  },
};

export default function WelcomeScreen({
  onGetStarted,
  currentLang,
}: WelcomeScreenProps) {
  const t = translations[currentLang];

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12">
      {/* Hero Section */}
      <div className="text-center mb-10 md:mb-12">
        {/* Icons */}
        <div className="flex justify-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Gift className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          </div>
          <div className="p-3 bg-purple/10 rounded-lg">
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-purple" />
          </div>
          <div className="p-3 bg-magenta/10 rounded-lg">
            <Star className="w-6 h-6 md:w-8 md:h-8 text-magenta" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold text-primary mb-3">
          {t.title}
        </h1>
        
        {/* Subtitle */}
        <p className="text-base md:text-lg text-grey max-w-2xl mx-auto mb-6">
          {t.subtitle}
        </p>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-base font-medium rounded-md shadow-sm hover:bg-primary/90 transition-all"
        >
          <Star className="w-5 h-5" />
          {t.getStarted}
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {t.features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg p-5 md:p-6 border border-primary/10 hover:border-primary/50 transition-all"
            >
              <div className="mb-3">
                <div className="inline-flex p-2 bg-primary/10 rounded-md">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-grey text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom Decoration */}
      <div className="mt-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-grey-light">
          <Star className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-grey">
            {currentLang === 'en' && 'Free forever • No credit card required'}
            {currentLang === 'ru' && 'Бесплатно навсегда • Без кредитной карты'}
            {currentLang === 'uz' && 'Abadiy bepul • Karta talab qilinmaydi'}
          </span>
        </div>
      </div>
    </div>
  );
}

