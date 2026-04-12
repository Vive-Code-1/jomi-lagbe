import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'bn' | 'en';

const translations = {
  bn: {
    // Nav
    home: 'হোম',
    listings: 'জমি তালিকা',
    favorites: 'ফেভারিট',
    login: 'লগইন',
    register: 'রেজিস্ট্রেশন',
    logout: 'লগআউট',
    admin: 'অ্যাডমিন',
    adPackages: 'এড প্যাকেজ',

    // Hero
    heroTitle: 'আপনার স্বপ্নের জমি খুঁজুন',
    heroSubtitle: 'আপনার শহরের সেরা জমি কিনুন ও বিক্রি করুন সহজেই',
    searchPlaceholder: 'এলাকা, লোকেশন দিয়ে খুঁজুন...',
    search: 'খুঁজুন',

    // Land card
    area: 'পরিমাণ',
    price: 'দাম',
    roadWidth: 'রাস্তার প্রস্থ',
    location: 'লোকেশন',
    decimal: 'শতক',
    feet: 'ফিট',
    taka: '৳',
    viewDetails: 'বিস্তারিত দেখুন',
    featured: 'ফিচার্ড',

    // Detail page
    getOwnerInfo: 'মালিকের তথ্য নিন',
    ownerName: 'মালিকের নাম',
    ownerPhone: 'মালিকের ফোন',
    ownerAddress: 'মালিকের ঠিকানা',
    payToUnlock: 'তথ্য দেখতে পেমেন্ট করুন',
    alreadyUnlocked: 'তথ্য আনলক করা হয়েছে',
    landDetails: 'জমির বিস্তারিত',
    description: 'বিবরণ',
    addToFavorites: 'ফেভারিটে যোগ করুন',
    removeFromFavorites: 'ফেভারিট থেকে সরান',

    // Filter
    filterByArea: 'এলাকা অনুযায়ী',
    filterByPrice: 'দামের রেঞ্জ',
    filterBySize: 'পরিমাণ',
    filterByRoad: 'রাস্তার প্রস্থ',
    allAreas: 'সব এলাকা',
    minPrice: 'সর্বনিম্ন দাম',
    maxPrice: 'সর্বোচ্চ দাম',
    applyFilter: 'ফিল্টার করুন',
    clearFilter: 'ফিল্টার মুছুন',

    // Auth
    email: 'ইমেইল',
    password: 'পাসওয়ার্ড',
    fullName: 'পূর্ণ নাম',
    loginTitle: 'লগইন করুন',
    registerTitle: 'রেজিস্ট্রেশন করুন',
    noAccount: 'অ্যাকাউন্ট নেই?',
    hasAccount: 'অ্যাকাউন্ট আছে?',

    // Admin
    addLand: 'জমি যোগ করুন',
    editLand: 'জমি সম্পাদনা',
    deleteLand: 'জমি মুছুন',
    title: 'শিরোনাম',
    titleBn: 'শিরোনাম (বাংলা)',
    titleEn: 'শিরোনাম (ইংরেজি)',
    descriptionBn: 'বিবরণ (বাংলা)',
    descriptionEn: 'বিবরণ (ইংরেজি)',
    images: 'ছবি',
    status: 'স্ট্যাটাস',
    active: 'সক্রিয়',
    sold: 'বিক্রিত',
    save: 'সেভ করুন',
    cancel: 'বাতিল',
    payments: 'পেমেন্ট',
    managePackages: 'প্যাকেজ ম্যানেজমেন্ট',
    manageLands: 'জমি ম্যানেজমেন্ট',
    dashboard: 'ড্যাশবোর্ড',
    totalLands: 'মোট জমি',
    totalPayments: 'মোট পেমেন্ট',
    totalUsers: 'মোট ইউজার',

    // Packages
    packageName: 'প্যাকেজের নাম',
    packagePrice: 'দাম',
    duration: 'মেয়াদ (দিন)',
    isFeatured: 'ফিচার্ড',
    buyPackage: 'কিনুন',
    days: 'দিন',

    // General
    noResults: 'কোন জমি পাওয়া যায়নি',
    loading: 'লোড হচ্ছে...',
    error: 'কিছু ভুল হয়েছে',
    success: 'সফল!',
    confirm: 'নিশ্চিত করুন',
    back: 'পিছনে',
    contactUnlockFee: 'মালিকের তথ্য আনলক ফি',
    pricePerDecimal: 'প্রতি শতক দাম',
    unlockOwnerNumber: 'মালিকের নম্বর আনলক করুন',
    mapLocation: 'মানচিত্র অবস্থান',
    safetyTips: 'নিরাপত্তা টিপস',
    tip1: 'জমি কেনার আগে সরাসরি পরিদর্শন করুন।',
    tip2: 'দলিল ও রেকর্ড যাচাই করুন।',
    tip3: 'বিশ্বস্ত আইনজীবীর পরামর্শ নিন।',
  },
  en: {
    home: 'Home',
    listings: 'Land Listings',
    favorites: 'Favorites',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    admin: 'Admin',
    adPackages: 'Ad Packages',

    heroTitle: 'Find Your Dream Land',
    heroSubtitle: 'Buy and sell the best land in your city easily',
    searchPlaceholder: 'Search by area, location...',
    search: 'Search',

    area: 'Area',
    price: 'Price',
    roadWidth: 'Road Width',
    location: 'Location',
    decimal: 'Decimal',
    feet: 'ft',
    taka: '৳',
    viewDetails: 'View Details',
    featured: 'Featured',

    getOwnerInfo: 'Get Owner Info',
    ownerName: 'Owner Name',
    ownerPhone: 'Owner Phone',
    ownerAddress: 'Owner Address',
    payToUnlock: 'Pay to unlock info',
    alreadyUnlocked: 'Info unlocked',
    landDetails: 'Land Details',
    description: 'Description',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',

    filterByArea: 'Filter by Area',
    filterByPrice: 'Price Range',
    filterBySize: 'Land Size',
    filterByRoad: 'Road Width',
    allAreas: 'All Areas',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    applyFilter: 'Apply Filter',
    clearFilter: 'Clear Filter',

    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    loginTitle: 'Login',
    registerTitle: 'Register',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',

    addLand: 'Add Land',
    editLand: 'Edit Land',
    deleteLand: 'Delete Land',
    title: 'Title',
    titleBn: 'Title (Bengali)',
    titleEn: 'Title (English)',
    descriptionBn: 'Description (Bengali)',
    descriptionEn: 'Description (English)',
    images: 'Images',
    status: 'Status',
    active: 'Active',
    sold: 'Sold',
    save: 'Save',
    cancel: 'Cancel',
    payments: 'Payments',
    managePackages: 'Manage Packages',
    manageLands: 'Manage Lands',
    dashboard: 'Dashboard',
    totalLands: 'Total Lands',
    totalPayments: 'Total Payments',
    totalUsers: 'Total Users',

    packageName: 'Package Name',
    packagePrice: 'Price',
    duration: 'Duration (days)',
    isFeatured: 'Featured',
    buyPackage: 'Buy',
    days: 'days',

    noResults: 'No lands found',
    loading: 'Loading...',
    error: 'Something went wrong',
    success: 'Success!',
    confirm: 'Confirm',
    back: 'Back',
    contactUnlockFee: 'Owner Info Unlock Fee',
    pricePerDecimal: 'Price per Decimal',
    unlockOwnerNumber: 'Unlock Owner Number',
    mapLocation: 'Map Location',
    safetyTips: 'Safety Tips',
    tip1: 'Visit the land in person before buying.',
    tip2: 'Verify all documents and records.',
    tip3: 'Consult a trusted lawyer.',
  },
} as const;

type TranslationKey = keyof typeof translations.bn;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('bn');

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] || key,
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};
