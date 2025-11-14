'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Image, Link2 } from 'react-feather';
import type { WishlistItem, CreateWishlistDto, UpdateWishlistDto } from '@/lib/api/wishlist';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWishlistDto | UpdateWishlistDto) => Promise<void>;
  item?: WishlistItem | null;
  mode: 'create' | 'edit';
  currentLang: 'en' | 'ru' | 'uz';
}

const modalTranslations = {
  en: {
    createTitle: 'Add New Item',
    editTitle: 'Edit Item',
    titleLabel: 'Title',
    titlePlaceholder: 'Enter product title',
    imageUrlLabel: 'Image URL',
    imageUrlPlaceholder: 'https://example.com/image.jpg',
    productUrlLabel: 'Product URL',
    productUrlPlaceholder: 'https://example.com/product',
    cancel: 'Cancel',
    save: 'Save',
    create: 'Create',
    saving: 'Saving...',
  },
  ru: {
    createTitle: 'Добавить новый товар',
    editTitle: 'Редактировать товар',
    titleLabel: 'Название',
    titlePlaceholder: 'Введите название товара',
    imageUrlLabel: 'URL изображения',
    imageUrlPlaceholder: 'https://example.com/image.jpg',
    productUrlLabel: 'URL товара',
    productUrlPlaceholder: 'https://example.com/product',
    cancel: 'Отмена',
    save: 'Сохранить',
    create: 'Создать',
    saving: 'Сохранение...',
  },
  uz: {
    createTitle: 'Yangi mahsulot qo\'shish',
    editTitle: 'Mahsulotni tahrirlash',
    titleLabel: 'Nomi',
    titlePlaceholder: 'Mahsulot nomini kiriting',
    imageUrlLabel: 'Rasm URL',
    imageUrlPlaceholder: 'https://example.com/image.jpg',
    productUrlLabel: 'Mahsulot URL',
    productUrlPlaceholder: 'https://example.com/product',
    cancel: 'Bekor qilish',
    save: 'Saqlash',
    create: 'Yaratish',
    saving: 'Saqlanmoqda...',
  },
};

export default function WishlistModal({
  isOpen,
  onClose,
  onSubmit,
  item,
  mode,
  currentLang,
}: WishlistModalProps) {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = modalTranslations[currentLang];

  useEffect(() => {
    if (item && mode === 'edit') {
      setTitle(item.title);
      setImageUrl(item.imageurl ?? '');
      setProductUrl(item.producturl ?? '');
    } else {
      setTitle('');
      setImageUrl('');
      setProductUrl('');
    }
  }, [item, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        title,
        imageurl: imageUrl,
        producturl: productUrl,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Simple Background with Opacity */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header - TrustMRR Style */}
        <div className="relative bg-primary p-6 text-white">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-md">
                <Gift className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold">
                {mode === 'create' ? t.createTitle : t.editTitle}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-primary">
              <Gift className="w-4 h-4" />
              {t.titleLabel}
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.titlePlaceholder}
              required
              className="w-full px-4 py-2.5 border border-grey-light rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-primary placeholder:text-grey"
            />
          </div>

          {/* Image URL Input */}
          <div className="space-y-2">
            <label htmlFor="imageUrl" className="flex items-center gap-2 text-sm font-medium text-primary">
              <Image className="w-4 h-4" />
              {t.imageUrlLabel}
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder={t.imageUrlPlaceholder}
              required
              className="w-full px-4 py-2.5 border border-grey-light rounded-md focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition-all text-primary placeholder:text-grey"
            />
            {imageUrl && (
              <div className="mt-3 rounded-md overflow-hidden border border-grey-light shadow-sm">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Product URL Input */}
          <div className="space-y-2">
            <label htmlFor="productUrl" className="flex items-center gap-2 text-sm font-medium text-primary">
              <Link2 className="w-4 h-4" />
              {t.productUrlLabel}
            </label>
            <input
              type="url"
              id="productUrl"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              placeholder={t.productUrlPlaceholder}
              required
              className="w-full px-4 py-2.5 border border-grey-light rounded-md focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition-all text-primary placeholder:text-grey"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-2.5 border border-grey-light text-grey rounded-md font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t.saving : mode === 'create' ? t.create : t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

