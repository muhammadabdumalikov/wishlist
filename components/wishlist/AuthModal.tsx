'use client';

import { useState } from 'react';
import { X, User, Lock, Eye, EyeOff, Star } from 'react-feather';
import type { AuthCredentials } from '@/lib/api/wishlist';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (credentials: AuthCredentials) => Promise<void>;
  onSignUp: (credentials: AuthCredentials) => Promise<void>;
  currentLang: 'en' | 'ru' | 'uz';
}

const translations = {
  en: {
    welcome: 'Welcome to Your Wishlist',
    subtitle: 'Create your personal wishlist and share it with loved ones',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    username: 'Username',
    password: 'Password',
    usernamePlaceholder: 'Enter your username',
    passwordPlaceholder: 'Enter your password',
    signInButton: 'Sign In',
    signUpButton: 'Create Account',
    switchToSignUp: "Don't have an account?",
    switchToSignIn: 'Already have an account?',
    signingIn: 'Signing in...',
    creatingAccount: 'Creating account...',
    errorGeneric: 'Something went wrong. Please try again.',
  },
  ru: {
    welcome: 'Добро пожаловать в Ваш список желаний',
    subtitle: 'Создайте свой личный список желаний и поделитесь им с близкими',
    signIn: 'Войти',
    signUp: 'Регистрация',
    username: 'Имя пользователя',
    password: 'Пароль',
    usernamePlaceholder: 'Введите имя пользователя',
    passwordPlaceholder: 'Введите пароль',
    signInButton: 'Войти',
    signUpButton: 'Создать аккаунт',
    switchToSignUp: 'Нет аккаунта?',
    switchToSignIn: 'Уже есть аккаунт?',
    signingIn: 'Вход...',
    creatingAccount: 'Создание аккаунта...',
    errorGeneric: 'Что-то пошло не так. Попробуйте снова.',
  },
  uz: {
    welcome: 'Sizning istaklar ro\'yxatingizga xush kelibsiz',
    subtitle: 'Shaxsiy istaklar ro\'yxatingizni yarating va yaqinlaringiz bilan baham ko\'ring',
    signIn: 'Kirish',
    signUp: 'Ro\'yxatdan o\'tish',
    username: 'Foydalanuvchi nomi',
    password: 'Parol',
    usernamePlaceholder: 'Foydalanuvchi nomini kiriting',
    passwordPlaceholder: 'Parolni kiriting',
    signInButton: 'Kirish',
    signUpButton: 'Akkaunt yaratish',
    switchToSignUp: 'Akkauntingiz yo\'qmi?',
    switchToSignIn: 'Akkauntingiz bormi?',
    signingIn: 'Kirilmoqda...',
    creatingAccount: 'Akkaunt yaratilmoqda...',
    errorGeneric: 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.',
  },
};

export default function AuthModal({
  isOpen,
  onClose,
  onSignIn,
  onSignUp,
  currentLang,
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[currentLang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const credentials = { login: username, password };
      if (mode === 'signin') {
        await onSignIn(credentials);
      } else {
        await onSignUp(credentials);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneric);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        {/* Header - TrustMRR Style */}
        <div className="relative bg-primary p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-md">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{t.welcome}</h2>
            </div>
          </div>
          <p className="text-white/90 text-sm">{t.subtitle}</p>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-grey-light bg-gray-50">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-3 text-sm font-medium transition-all ${
              mode === 'signin'
                ? 'text-primary border-b-2 border-primary bg-white'
                : 'text-grey hover:text-primary'
            }`}
          >
            {t.signIn}
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 text-sm font-medium transition-all ${
              mode === 'signup'
                ? 'text-primary border-b-2 border-primary bg-white'
                : 'text-grey hover:text-primary'
            }`}
          >
            {t.signUp}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              {t.username}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-grey">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.usernamePlaceholder}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-grey-light rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-primary"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              {t.password}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-grey">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                required
                className="w-full pl-10 pr-12 py-2.5 border border-grey-light rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-primary"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-grey hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-md shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? mode === 'signin'
                ? t.signingIn
                : t.creatingAccount
              : mode === 'signin'
                ? t.signInButton
                : t.signUpButton}
          </button>

          {/* Switch Mode */}
          <div className="text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-grey hover:text-primary transition-colors"
            >
              {mode === 'signin' ? t.switchToSignUp : t.switchToSignIn}{' '}
              <span className="font-medium">
                {mode === 'signin' ? t.signUp : t.signIn}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

