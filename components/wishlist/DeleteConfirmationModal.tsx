'use client';

import { X, Trash2, AlertTriangle } from 'react-feather';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle?: string;
  currentLang: 'en' | 'ru' | 'uz';
  isDeleting?: boolean;
}

const translations = {
  en: {
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item?',
    messageWithTitle: 'Are you sure you want to delete "{title}"?',
    cancel: 'Cancel',
    delete: 'Delete',
    deleting: 'Deleting...',
  },
  ru: {
    title: 'Удалить элемент',
    message: 'Вы уверены, что хотите удалить этот элемент?',
    messageWithTitle: 'Вы уверены, что хотите удалить "{title}"?',
    cancel: 'Отмена',
    delete: 'Удалить',
    deleting: 'Удаление...',
  },
  uz: {
    title: 'Elementni o\'chirish',
    message: 'Ushbu elementni o\'chirishga ishonchingiz komilmi?',
    messageWithTitle: '"{title}" ni o\'chirishga ishonchingiz komilmi?',
    cancel: 'Bekor qilish',
    delete: 'O\'chirish',
    deleting: 'O\'chilmoqda...',
  },
};

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
  currentLang,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  const t = translations[currentLang];

  if (!isOpen) return null;

  const message = itemTitle
    ? t.messageWithTitle.replace('{title}', itemTitle)
    : t.message;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        {/* Header - TrustMRR Style */}
        <div className="relative bg-primary p-6 text-white">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-md">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold">{t.title}</h2>
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="p-2 hover:bg-white/20 rounded-md transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Message */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <Trash2 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-grey leading-relaxed flex-1">{message}</p>
          </div>

          {/* Warning Note */}
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-md">
            <p className="text-sm text-primary">
              {currentLang === 'en' && 'This action cannot be undone.'}
              {currentLang === 'ru' && 'Это действие нельзя отменить.'}
              {currentLang === 'uz' && 'Bu harakatni bekor qilib bo\'lmaydi.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-6 py-2.5 border border-grey-light text-grey rounded-md font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? t.deleting : t.delete}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

