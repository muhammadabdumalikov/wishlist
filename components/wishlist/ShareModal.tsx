'use client';

import { useState, useEffect } from 'react';
import { X, Share2, Copy, Check, Link2 } from 'react-feather';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerId: string;
  currentLang: 'en' | 'ru' | 'uz';
}

const translations = {
  en: {
    title: 'Share Your Wishlist',
    subtitle: 'Share this link with friends and family so they can see your wishlist',
    copyLink: 'Copy Link',
    copied: 'Copied!',
    close: 'Close',
    shareUrl: 'Your Shareable Link',
  },
  ru: {
    title: 'Поделиться списком желаний',
    subtitle: 'Поделитесь этой ссылкой с друзьями и семьей, чтобы они могли увидеть ваш список желаний',
    copyLink: 'Копировать ссылку',
    copied: 'Скопировано!',
    close: 'Закрыть',
    shareUrl: 'Ваша ссылка для обмена',
  },
  uz: {
    title: 'Istaklar ro\'yxatini ulashish',
    subtitle: 'Do\'stlar va oila a\'zolariga istaklar ro\'yxatingizni ko\'rishlari uchun ushbu havolani ulashing',
    copyLink: 'Havolani nusxalash',
    copied: 'Nusxalandi!',
    close: 'Yopish',
    shareUrl: 'Ulashish havolangiz',
  },
};

export default function ShareModal({
  isOpen,
  onClose,
  ownerId,
  currentLang,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const t = translations[currentLang];

  useEffect(() => {
    async function getShortUrl() {
      if (isOpen && typeof window !== 'undefined') {
        const url = `${window.location.origin}/wishlist/${ownerId}`;

        try {
          const response = await fetch('https://ulvis.net/api/v1/shorten', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url,
            }),
          });
          const data = await response.json();
          if (data && data.shortUrl) {
            setShareUrl(data.shortUrl);
          } else {
            setShareUrl(url);
            console.warn('Shorten API did not return a shortUrl, using original URL.');
          }
        } catch (error) {
          setShareUrl(url);
          console.error('Failed to shorten URL:', error);
        }
      }
    }

    getShortUrl();
  }, [isOpen, ownerId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
        {/* Header - TrustMRR Style */}
        <div className="relative bg-primary p-6 text-white">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-md">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{t.title}</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-2 text-white/90 text-sm">{t.subtitle}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Share URL Display */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-primary">
              <Link2 className="w-4 h-4" />
              {t.shareUrl}
            </label>
            <div className="px-4 py-3 bg-gray-50 border border-grey-light rounded-md text-grey text-sm break-all">
              {shareUrl}
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            disabled={copied}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all shadow-sm disabled:opacity-90"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                {t.copied}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                {t.copyLink}
              </>
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-2.5 border border-grey-light text-grey rounded-md font-medium hover:bg-gray-50 transition-all"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}

