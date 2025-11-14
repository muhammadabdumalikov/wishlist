'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Gift, Plus, Edit2, Trash2, LogOut, User, Share2, Heart } from 'react-feather';
import WishlistModal from '@/components/wishlist/WishlistModal';
import AuthModal from '@/components/wishlist/AuthModal';
import EmptyWishlist from '@/components/wishlist/EmptyWishlist';
import ShareModal from '@/components/wishlist/ShareModal';
import WelcomeScreen from '@/components/wishlist/WelcomeScreen';
import FontProvider from '@/components/FontProvider';
import DeleteConfirmationModal from '@/components/wishlist/DeleteConfirmationModal';
import LanguageSelector from '@/components/LanguageSelector';
import {
  fetchWishlistItems,
  createWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
  isAuthenticated,
  signIn,
  signUp,
  signOut,
  getOwnerId,
  authenticateWithTelegram,
  isTelegramMiniApp,
  type WishlistItem,
  type CreateWishlistDto,
  type UpdateWishlistDto,
  type AuthCredentials,
} from '@/lib/api/wishlist';

// Translations
const translations = {
  en: {
    title: 'List of things which you can gift to me',
    description: 'Thanks for considering! Here are some items I\'d love to receive. Click on any product to view more details and purchase options.',
    viewProduct: 'View Product',
    footerNote: '💝 These are just suggestions! Any gift or even just your kind thoughts are greatly appreciated. Thank you for being so thoughtful!',
    addNew: 'Add New Item',
    edit: 'Edit',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this item?',
    loading: 'Loading...',
    localItem: 'Local',
    apiItem: 'My Wishlist',
    share: 'Share',
    logout: 'Logout',
    signIn: 'Sign In',
  },
  ru: {
    title: 'Список вещей, которые вы можете мне подарить',
    description: 'Спасибо, что рассмотрели! Вот некоторые предметы, которые мне бы хотелось получить. Нажмите на любой продукт, чтобы просмотреть подробности и варианты покупки.',
    viewProduct: 'Просмотр продукта',
    footerNote: '💝 Это всего лишь предложения! Любой подарок или даже просто ваши добрые мысли очень ценятся. Спасибо, что вы такие внимательные!',
    addNew: 'Добавить новый',
    edit: 'Редактировать',
    delete: 'Удалить',
    confirmDelete: 'Вы уверены, что хотите удалить этот элемент?',
    loading: 'Загрузка...',
    localItem: 'Локальный',
    apiItem: 'Мой список',
    share: 'Поделиться',
    logout: 'Выйти',
    signIn: 'Войти',
  },
  uz: {
    title: 'Menga sovg\'a qila oladigan narsalar ro\'yxati',
    description: 'Ko\'rib chiqganingiz uchun rahmat! Quyida menga juda yoqadigan ba\'zi narsalar. Batafsil ma\'lumot va xarid qilish variantlarini ko\'rish uchun har qanday mahsulotni bosing.',
    viewProduct: 'Mahsulotni ko\'rish',
    footerNote: '💝 Bu faqat takliflar! Har qanday sovg\'a yoki hatto faqat sizning mehribon fikrlaringiz juda qadrlanadi. Sizga minnatdorman!',
    addNew: 'Yangi qo\'shish',
    edit: 'Tahrirlash',
    delete: 'O\'chirish',
    confirmDelete: 'Ushbu elementni o\'chirishga ishonchingiz komilmi?',
    loading: 'Yuklanmoqda...',
    localItem: 'Lokal',
    apiItem: 'Mening ro\'yxatim',
    share: 'Ulashish',
    logout: 'Chiqish',
    signIn: 'Kirish',
  }
};

export default function WishlistPage() {
  const [currentLang, setCurrentLang] = useState<'en' | 'ru' | 'uz'>('ru');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [apiItems, setApiItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<WishlistItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const t = translations[currentLang];

  // Merge local products with API items
  const allProducts: WishlistItem[] = apiItems;

  // Check authentication on mount
  useEffect(() => {
    setIsMounted(true);
    
    // Check if running in Telegram (client-side only)
    const inTelegram = isTelegramMiniApp();
    setIsInTelegram(inTelegram);
    
    const initTelegram = async () => {
      // Initialize Telegram WebApp if running in Telegram
      if (inTelegram) {
        try {
          // @ts-ignore - Telegram WebApp SDK
          if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            // @ts-ignore
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();

            // Auto-authenticate with Telegram user ID
            await authenticateWithTelegram();
          }
        } catch (error) {
          console.error('Error initializing Telegram WebApp:', error);
        }
      }
    };

    const checkAuth = async () => {
      await initTelegram();
      
      const authenticated = isAuthenticated();
      setIsUserAuthenticated(authenticated);

      if (authenticated) {
        await loadApiItems();
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loadApiItems = async () => {
    if (!isAuthenticated()) {
      setApiItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const items = await fetchWishlistItems();
      setApiItems(items.map((item) => ({ ...item, source: 'api' as const })));
    } catch (error) {
      console.error('Failed to load API items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSignIn = async (credentials: AuthCredentials) => {
    await signIn(credentials);
    setIsUserAuthenticated(true);
    setShowAuthModal(false);
    await loadApiItems();
  };

  const handleUserSignUp = async (credentials: AuthCredentials) => {
    await signUp(credentials);
    setIsUserAuthenticated(true);
    setShowAuthModal(false);
    await loadApiItems();
  };

  const handleUserSignOut = () => {
    signOut();
    setIsUserAuthenticated(false);
    setApiItems([]);
    setShowAuthModal(true);
  };

  const handleImageError = (productId: string) => {
    setImageErrors(prev => new Set(prev).add(productId));
  };

  const handleCreateItem = async (data: CreateWishlistDto) => {
    const newItem = await createWishlistItem(data);
    if (newItem) {
      setApiItems((prev) => [...prev, { ...newItem, source: 'api' }]);
    }
  };

  const handleUpdateItem = async (data: UpdateWishlistDto) => {
    if (!selectedItem) return;
    const updatedItem = await updateWishlistItem(selectedItem.id, data);
    if (updatedItem) {
      setApiItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...updatedItem, source: 'api' } : item
        )
      );
    }
  };

  const handleDeleteClick = (item: WishlistItem) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const success = await deleteWishlistItem(itemToDelete.id);
      if (success) {
        setApiItems((prev) => prev.filter((item) => item.id !== itemToDelete.id));
        setShowDeleteModal(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateModal = () => {
    setSelectedItem(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const openEditModal = (item: WishlistItem) => {
    setSelectedItem(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background-light">
      <FontProvider currentLang={currentLang} />
      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 max-w-7xl mx-auto">
        {/* Language & Controls - TrustMRR Style */}
        <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
          {/* Left: User Controls */}
          <div className="flex items-center gap-2">
            {/* Sign In Button - Show when NOT authenticated and NOT in Telegram */}
            {isMounted && !isUserAuthenticated && !isInTelegram && (
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-2 rounded-md bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-medium text-primary-foreground transition-all shadow-sm"
              >
                <User className="h-4 w-4" />
                <span>{t.signIn}</span>
              </button>
            )}

            {/* User Sign Out - Hide in Telegram Mini App (no logout in Telegram) */}
            {isMounted && isUserAuthenticated && !isInTelegram && (
              <button
                onClick={handleUserSignOut}
                className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-grey transition-all hover:bg-gray-50 hover:text-gray-700 border border-grey-light shadow-xs"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            )}

            {/* Share Button */}
            {isUserAuthenticated && apiItems.length > 0 && (
              <button
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center gap-2 rounded-md bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-medium text-primary-foreground transition-all shadow-xs"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t.share}</span>
              </button>
            )}
          </div>

          {/* Language Selector */}
          <LanguageSelector
            currentLang={currentLang}
            onLanguageChange={setCurrentLang}
          />
        </div>

        {/* Welcome Screen for First-Time Users - Hide in Telegram Mini App */}
        {isMounted && !isUserAuthenticated && !isLoading && !isInTelegram && (
          <WelcomeScreen
            onGetStarted={() => setShowAuthModal(true)}
            currentLang={currentLang}
          />
        )}

        {/* Header Section - Only show for authenticated users */}
        {isUserAuthenticated && (
          <div className="text-center mb-12">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
              <Gift className="w-12 h-12 md:w-10 md:h-10 text-purple" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-primary tracking-tight">
                {t.title}
              </h1>
            </div>
            <p className="text-grey text-base md:text-lg max-w-2xl mx-auto px-4 leading-relaxed">
              {t.description}
            </p>
          </div>
        )}

        {/* Content for Authenticated Users Only */}
        {isUserAuthenticated && (
          <>
            {/* Add New Item Button - Show only if user has items */}
            {apiItems.length > 0 && (
              <div className="mb-6 flex justify-center">
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-bold hover:bg-primary/90 transition-all shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  {t.addNew}
                </button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-grey">{t.loading}</p>
              </div>
            )}

            {/* Empty State - Show when user is authenticated but has no items */}
            {!isLoading && apiItems.length === 0 && (
              <EmptyWishlist
                onCreateFirst={openCreateModal}
                currentLang={currentLang}
              />
            )}

            {/* Products Grid */}
            {!isLoading && apiItems.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
                {allProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-lg overflow-hidden border border-grey-light hover:border-primary/50 transition-all duration-200"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      {!isMounted || imageErrors.has(product.id) ? (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple/5 to-magenta/5">
                          <Gift className="w-8 h-8 md:w-10 md:h-10 text-purple/40" />
                        </div>
                      ) : (
                        <img
                          src={product.imageurl}
                          alt={product.title}
                          onError={() => handleImageError(product.id)}
                          onLoad={(e) => {
                            const img = e.currentTarget;
                            if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                              handleImageError(product.id);
                            }
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-2 md:p-3">
                      <div className="flex items-start justify-between gap-1.5 mb-1.5">
                        <h3 className="text-xs md:text-sm font-medium text-primary min-h-[2rem] md:min-h-[2.5rem] line-clamp-2 flex-1 leading-tight">
                          {product.title}
                        </h3>
                      </div>

                      {/* Edit/Delete Controls - Only for user's own items */}
                      {isUserAuthenticated && product.source === 'api' && (
                        <div className="flex gap-1.5 mb-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-[10px] md:text-xs font-medium transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span className="hidden sm:inline">{t.edit}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md text-[10px] md:text-xs font-medium transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span className="hidden sm:inline">{t.delete}</span>
                          </button>
                        </div>
                      )}

                      {/* View Product Link */}
                      <a
                        href={product.producturl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all cursor-pointer w-full bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-3 gap-1.5 shadow-sm"
                      >
                        {t.viewProduct}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Note */}
            {apiItems.length > 0 && (
              <div className="mt-12 md:mt-16 text-center">
                <div className="bg-white rounded-lg p-6 md:p-8 border border-grey-light max-w-2xl mx-auto shadow-sm">
                  <p className="text-grey text-sm md:text-base leading-relaxed">
                    {t.footerNote}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Made with Love Footer */}
      <footer className="py-6 md:py-8 border-t border-grey-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-grey text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-purple fill-purple" />
            <span>by YOU</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignIn={handleUserSignIn}
        onSignUp={handleUserSignUp}
        currentLang={currentLang}
      />

      <WishlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          if (modalMode === 'create') {
            await handleCreateItem(data as CreateWishlistDto);
          } else {
            await handleUpdateItem(data as UpdateWishlistDto);
          }
        }}
        item={selectedItem}
        mode={modalMode}
        currentLang={currentLang}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        ownerId={getOwnerId() || ''}
        currentLang={currentLang}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemTitle={itemToDelete?.title}
        currentLang={currentLang}
        isDeleting={isDeleting}
      />
    </div>
  );
}
