import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';

const Footer = () => {
  const { lang } = useI18n();

  return (
    <footer className="w-full bg-[#003215] rounded-t-3xl mt-12 text-white font-body text-sm leading-relaxed">
      <div className="flex flex-col md:flex-row justify-between items-start px-8 md:px-12 py-16 gap-12 max-w-screen-2xl mx-auto">
        <div className="md:w-1/3">
          <span className="text-xl font-bold text-secondary-container block mb-6">জমি লাগবে</span>
          <p className="text-[#aef2bb]/80 leading-relaxed mb-8">
            {lang === 'bn'
              ? 'বাংলাদেশের সবচেয়ে বিশ্বস্ত জমি মার্কেটপ্লেস। নিরাপদ ও স্বচ্ছ জমি কেনাবেচার মাধ্যমে আপনার ভবিষ্যৎ গড়ুন।'
              : 'The most trusted marketplace for land properties in Bangladesh. Building legacies through safe and transparent land ownership.'}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest mb-8 text-secondary-container">
            {lang === 'bn' ? 'কোম্পানি' : 'Company'}
          </h4>
          <ul className="space-y-4">
            <li><Link to="/about" className="text-[#aef2bb]/80 hover:text-white transition-all">{lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</Link></li>
            <li><a className="text-[#aef2bb]/80 hover:text-white transition-all" href="#">{lang === 'bn' ? 'কিভাবে কাজ করে' : 'How it Works'}</a></li>
            <li><Link to="/contact" className="text-[#aef2bb]/80 hover:text-white transition-all">{lang === 'bn' ? 'যোগাযোগ' : 'Contact Support'}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest mb-8 text-secondary-container">
            {lang === 'bn' ? 'রিসোর্স' : 'Resources'}
          </h4>
          <ul className="space-y-4">
            <li><a className="text-[#aef2bb]/80 hover:text-white transition-all" href="#">{lang === 'bn' ? 'জমি আইন' : 'Land Laws BD'}</a></li>
            <li><a className="text-[#aef2bb]/80 hover:text-white transition-all" href="#">{lang === 'bn' ? 'রেজিস্ট্রেশন গাইড' : 'Registration Guide'}</a></li>
            <li><Link to="/packages" className="text-[#aef2bb]/80 hover:text-white transition-all">{lang === 'bn' ? 'এড প্যাকেজ' : 'Ad Packages'}</Link></li>
          </ul>
        </div>
        <div className="md:w-1/4">
          <h4 className="font-bold text-sm uppercase tracking-widest mb-8 text-secondary-container">
            {lang === 'bn' ? 'নিউজলেটার' : 'Newsletter'}
          </h4>
          <p className="text-[#aef2bb]/80 mb-6">
            {lang === 'bn' ? 'সেরা জমির অফার ইমেইলে পান।' : 'Get the latest property deals sent to your inbox.'}
          </p>
          <div className="relative">
            <input
              className="w-full bg-white/10 border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-[#aef2bb]/50 focus:ring-0 focus:border-secondary-container outline-none transition-all"
              placeholder={lang === 'bn' ? 'ইমেইল দিন' : 'Email Address'}
              type="email"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-secondary-container text-[#003215] px-4 rounded-lg font-bold text-xs opacity-80 hover:opacity-100 transition-all">
              {lang === 'bn' ? 'সাবস্ক্রাইব' : 'Subscribe'}
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-12 py-8 text-center text-[#aef2bb]/60 text-xs">
        <p>© 2024 জমি লাগবে। সর্বস্বত্ব সংরক্ষিত। <a href="https://webogrowth.com/" target="_blank" rel="noopener noreferrer" className="text-secondary-container hover:text-white transition-all underline">Webogrowth</a></p>
      </div>
    </footer>
  );
};

export default Footer;
