'use client';

import { Gift, Plus, Star, Heart } from 'react-feather';

interface EmptyWishlistProps {
  onCreateFirst: () => void;
  currentLang: 'en' | 'ru' | 'uz';
}

const translations = {
  en: {
    title: 'Your Wishlist is Empty',
    subtitle: 'Start building your dream wishlist',
    description: 'Add items you love and share your wishlist with friends and family. They\'ll know exactly what makes you happy!',
    createFirst: 'Add Your First Item',
    features: [
      { icon: Gift, text: 'Add unlimited items' },
      { icon: Heart, text: 'Share with loved ones' },
      { icon: Star, text: 'Track your wishes' },
    ],
  },
  ru: {
    title: 'Ваш список желаний пуст',
    subtitle: 'Начните создавать список своей мечты',
    description: 'Добавляйте любимые вещи и делитесь списком с друзьями и семьей. Они будут точно знать, что сделает вас счастливыми!',
    createFirst: 'Добавить первый товар',
    features: [
      { icon: Gift, text: 'Неограниченное количество товаров' },
      { icon: Heart, text: 'Делитесь с близкими' },
      { icon: Star, text: 'Отслеживайте желания' },
    ],
  },
  uz: {
    title: 'Sizning istaklar ro\'yxatingiz bo\'sh',
    subtitle: 'Orzuingizdagi ro\'yxatni yaratishni boshlang',
    description: 'Yoqtirgan narsalaringizni qo\'shing va do\'stlaringiz hamda oilangiz bilan baham ko\'ring. Ular sizni nima xursand qilishini aniq bilishadi!',
    createFirst: 'Birinchi mahsulotni qo\'shish',
    features: [
      { icon: Gift, text: 'Cheksiz mahsulotlar' },
      { icon: Heart, text: 'Yaqinlaringiz bilan baham ko\'ring' },
      { icon: Star, text: 'Istaklaringizni kuzating' },
    ],
  },
};

export default function EmptyWishlist({ onCreateFirst, currentLang }: EmptyWishlistProps) {
  const t = translations[currentLang];

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-grey-light overflow-hidden">
          {/* Header - TrustMRR Style */}
          <div className="bg-primary p-8 text-center text-white">
            <div className="inline-flex p-4 bg-white/20 backdrop-blur-sm rounded-lg mb-4">
              <Gift className="w-12 h-12" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              {t.title}
            </h2>
            <p className="text-white/90 text-base">
              {t.subtitle}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <p className="text-grey text-center text-base mb-6">
              {t.description}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {t.features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 bg-gray-50 rounded-md border border-primary/10 hover:border-primary/50 transition-all"
                  >
                    <div className="p-2 bg-white rounded-md shadow-sm mb-2">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-primary text-center">
                      {feature.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <button
              onClick={onCreateFirst}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground font-medium rounded-md shadow-sm hover:bg-primary/90 transition-all"
            >
              <Plus className="w-5 h-5" />
              {t.createFirst}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

