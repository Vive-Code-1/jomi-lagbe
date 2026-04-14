import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import LandCard from '@/components/LandCard';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { Search, MapPin, Ruler, Upload, SearchCheck, CheckCircle, Shield, Users, Headphones, Star, Quote } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { divisions } from '@/data/districts';

const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfJbrhRcLOg2UDGwhdK3-tfBDXxKRp5ymrrV2SonGV_FkWvylWZcMFh-99TpXXax-Om9uRh9AbRjpy-l84ZsO153sHkLpYQSvEamdD4xyMH5OF_0QtzM39J0CfTCl76PRgv4LJ4SoelIBWUofOqLYpHLEBGibjxzZtEF15Dc3i5UnQt_t3_XNADHIDeX-Hi90AgV7SCmEqfHZwrkhH1xyJbgOH7XDq76vfMhvF35fvGc3hQPacAOHZL-TXVHLNAb6NSqTcJ39zYl0';

const categoryImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBhi15Sm-kuoPn9iQ_P9sj2FBegEAaoD8Ip_GJ9KMjzrxYkhKZIVIHty3tl9vvH3ESTogN1n4rFP37uWgqP0DbLoF4rBFV9DVqWgnYqCBIJrA9aypxzQnv-9K6ng-1fwlk3rBkDhsvwtxHN71aDz4s4SRIBco9KNTdFjVhX81BQk9oDcmFE5FXkXRXLRcdNPctqUUa8mGyYrnPpA3u8wLIzO-ytNgkMhHRvzFzfQm-0xAYNiFH_Za9IhuOFoHplB6xjNllJ1K1RKzo',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCtCVj3k4Pix0EO-5NMxN9l4F6UCVpl5zq4gSsEagcsO9G7RmppEnuLHqTGntVl-GTb4HgSsEgXK6ZM84DhUiaWUvL1kiAjAMQLJDXq869e_nqC2lUsdijDrBFks7CRu6k4mHo87n3SgKfweOCoE3bsAgjSZKvlO_WvD0uDkJuOkGftk1QA5h5Itp9zFuQlCNBktyi7Qk1YVgk4YdZ0jNGw6Mcty7gbbKUIgO8HL0qAnU4kD1X2ofS9t9xBhIWsq1tLULtic_4R85Q',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBQizBxxUYZ9a24IRWHq2-N3HVysd1yl1FgfAS2yLGX4nc2Y9KjLdIvnIKU3G77VkqL16B4VNf3FAuGuxn_paYqKe-af79PLE8M6Qz-f0FKj76uDy1tyq7Yd_p12U2ssC3FP4dwNWMcD9ZO6_sQGkfhNqMuMpo8Zxo6sfAvyMRI8CEBasCJVCpGRZTCuu7CGODPG4y-JuuefDH7ksVyV-G8KgD0S3m5sPb6BXxZClI660EH4lz4RppNhcm9BraPW2drvNWm8kY-ab4',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBEt7dI_ReVYZ43CRkY1bZU0LtZadlQy76ktTNQTbP9wxINjsICuhUNO_HRVA38coHiIs_gEN3NI-mgKXwzbvg08f2VSuQ1zoVoN74E8651WSyhETwBA7iwWZ6bn3Q-SzTU9HwuCaX2-mRrxT99HhQXysZS1QJaQJiCxl-hCdMsiw1mMesBauha8ZVgI8J7W1t25TGwV1omtiPeElQrjh2flq4gESMpqTqY7g0p_BtnnjT_UxRr8UmAnfEGNXGwTyR9lKdqIO_GAo8',
];

const categories = [
  { name_bn: 'আবাসিক', name_en: 'Residential', sub_bn: 'আপনার স্বপ্নের ঘর তৈরি করুন', sub_en: 'Build your future home' },
  { name_bn: 'বাণিজ্যিক', name_en: 'Commercial', sub_bn: 'প্রাইম বিজনেস লোকেশন', sub_en: 'Prime business hubs' },
  { name_bn: 'কৃষি', name_en: 'Agriculture', sub_bn: 'উর্বর কৃষিজমি', sub_en: 'Fertile land ventures' },
  { name_bn: 'শিল্প', name_en: 'Industrial', sub_bn: 'বড় কারখানার জমি', sub_en: 'Large scale factory plots' },
];

const Index = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedLandType, setSelectedLandType] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');

  const { data: featuredLands, isLoading } = useQuery({
    queryKey: ['featured-lands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lands')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedDistrict) params.set('district', selectedDistrict);
    if (selectedLandType) params.set('landType', selectedLandType);
    if (budgetMin) params.set('minPrice', budgetMin);
    if (budgetMax) params.set('maxPrice', budgetMax);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="relative min-h-[700px] md:min-h-[800px] flex items-center justify-center overflow-hidden px-6 pt-20">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover" src={heroImage} alt="lush green agricultural land" />
          <div className="absolute inset-0 bg-primary/30" />
        </div>
        <div className="relative z-10 max-w-5xl w-full text-center mt-[-4rem]">
          <AnimatedSection direction="fade" duration={1}>
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              {lang === 'bn' ? 'আপনার স্বপ্নের জমি,' : 'Find Your Dream'}
              <br />
              <span className="text-secondary-container">
                {lang === 'bn' ? 'এখন হাতের নাগালে।' : 'Land Today.'}
              </span>
            </h1>
          </AnimatedSection>
          <AnimatedSection direction="up" delay={0.3}>
            <p className="font-body text-lg md:text-xl text-white/95 mb-12 max-w-2xl mx-auto leading-relaxed">
              {lang === 'bn'
                ? 'বাংলাদেশের সেরা আবাসিক, বাণিজ্যিক ও কৃষি জমি খুঁজুন। আপনার ভবিষ্যৎ সুরক্ষিত করুন আজই।'
                : 'Explore premium residential, commercial, and agricultural plots across Bangladesh. Secure your future legacy today.'}
            </p>
          </AnimatedSection>

          {/* Search Bar */}
          <AnimatedSection direction="up" delay={0.5} distance={40}>
            <div className="bg-surface-container-lowest/95 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-xl max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-stretch">
                {/* Location */}
                <div className="flex-1 px-4 py-3 md:border-r border-outline-variant/30">
                  <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-outline mb-1.5 font-label">
                    {lang === 'bn' ? 'লোকেশন' : 'LOCATION'}
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <select
                      className="w-full bg-transparent border-none focus:ring-0 font-semibold text-sm text-on-surface outline-none cursor-pointer appearance-none pl-1"
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                    >
                      <option value="">{lang === 'bn' ? 'কোথায় খুঁজছেন?' : 'Where are you looking?'}</option>
                      {divisions.map(div => (
                        <optgroup key={div.name_en} label={lang === 'bn' ? div.name_bn : div.name_en}>
                          {div.districts.map(d => (
                            <option key={d.name_en} value={d.name_en}>
                              {lang === 'bn' ? d.name_bn : d.name_en}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Land Type */}
                <div className="flex-1 px-4 py-3 md:border-r border-outline-variant/30">
                  <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-outline mb-1.5 font-label">
                    {lang === 'bn' ? 'জমির ধরন' : 'LAND TYPE'}
                  </label>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-primary flex-shrink-0" />
                    <select
                      className="w-full bg-transparent border-none focus:ring-0 font-semibold text-sm text-on-surface outline-none cursor-pointer appearance-none pl-1"
                      value={selectedLandType}
                      onChange={(e) => setSelectedLandType(e.target.value)}
                    >
                      <option value="">{lang === 'bn' ? 'জমির ধরন নির্বাচন করুন' : 'Select Land Type'}</option>
                      <option value="residential">{lang === 'bn' ? 'আবাসিক' : 'Residential'}</option>
                      <option value="commercial">{lang === 'bn' ? 'বাণিজ্যিক' : 'Commercial'}</option>
                      <option value="agriculture">{lang === 'bn' ? 'কৃষি' : 'Agriculture'}</option>
                      <option value="industrial">{lang === 'bn' ? 'শিল্প' : 'Industrial'}</option>
                    </select>
                  </div>
                </div>

                {/* Budget Range */}
                <div className="flex-1 px-4 py-3 md:border-r border-outline-variant/30">
                  <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-outline mb-1.5 font-label">
                    {lang === 'bn' ? 'বাজেট রেঞ্জ' : 'BUDGET RANGE'}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold text-sm flex-shrink-0">৳</span>
                    <input
                      type="number"
                      className="w-full bg-transparent border-none focus:ring-0 font-semibold text-sm text-on-surface placeholder:text-outline-variant outline-none"
                      placeholder={lang === 'bn' ? 'সর্বনিম্ন' : 'Min'}
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                    />
                    <span className="text-outline-variant">—</span>
                    <input
                      type="number"
                      className="w-full bg-transparent border-none focus:ring-0 font-semibold text-sm text-on-surface placeholder:text-outline-variant outline-none"
                      placeholder={lang === 'bn' ? 'সর্বোচ্চ' : 'Max'}
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex items-center px-2 py-3 md:py-0">
                  <button
                    onClick={handleSearch}
                    className="w-full md:w-auto bg-primary hover:opacity-90 text-primary-foreground px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 whitespace-nowrap shadow-lg shadow-primary/20"
                  >
                    <Search className="h-5 w-5" />
                    {lang === 'bn' ? 'জমি খুঁজুন' : 'Search Land'}
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 md:py-24 bg-surface px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="up" className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-headline text-3xl font-bold text-primary mb-2">
                {lang === 'bn' ? 'ফিচার্ড ক্যাটেগরি' : 'Featured Categories'}
              </h2>
              <div className="w-20 h-1 bg-secondary rounded-full" />
            </div>
            <Link to="/listings" className="text-primary font-bold flex items-center gap-2 group">
              {lang === 'bn' ? 'সব দেখুন' : 'Browse All'}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </AnimatedSection>
          <AnimatedSection stagger={0.15} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <Link to="/listings" key={i} className="group relative overflow-hidden rounded-xl h-72 md:h-80 bg-surface-container">
                <img
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={categoryImages[i]}
                  alt={lang === 'bn' ? cat.name_bn : cat.name_en}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <h3 className="text-white font-headline text-2xl font-bold mb-1">{lang === 'bn' ? cat.name_bn : cat.name_en}</h3>
                  <p className="text-white/80 text-sm">{lang === 'bn' ? cat.sub_bn : cat.sub_en}</p>
                </div>
              </Link>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="py-20 md:py-24 bg-surface-container-low px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="up" className="text-center mb-16">
            <span className="font-bold text-sm text-secondary tracking-widest uppercase">
              {lang === 'bn' ? 'নতুন এসেছে' : 'New Arrivals'}
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mt-4">
              {lang === 'bn' ? 'সাম্প্রতিক জমি' : 'Latest Listings'}
            </h2>
          </AnimatedSection>
          {isLoading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-xl bg-surface-container" />
              ))}
            </div>
          ) : featuredLands && featuredLands.length > 0 ? (
            <AnimatedSection stagger={0.12} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredLands.map((land: any) => (
                <LandCard
                  key={land.id}
                  id={land.id}
                  title_bn={land.title_bn}
                  title_en={land.title_en}
                  price={land.price}
                  area_size={land.area_size}
                  location_bn={land.location_bn}
                  location_en={land.location_en}
                  road_width={land.road_width}
                  images={land.images || []}
                  is_featured={land.is_featured}
                />
              ))}
            </AnimatedSection>
          ) : (
            <div className="text-center py-12">
              <p className="text-outline text-lg">{t('noResults')}</p>
              <Link to="/listings">
                <Button className="mt-4 bg-primary text-primary-foreground">{t('viewDetails')}</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-24 bg-surface px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="up" className="text-center mb-16">
            <h2 className="font-headline text-4xl font-bold text-primary">
              {lang === 'bn' ? 'জমি লাগবে কিভাবে কাজ করে' : 'How Jomi Lagbe Works'}
            </h2>
            <p className="text-outline mt-4 max-w-xl mx-auto">
              {lang === 'bn'
                ? 'সহজ, স্বচ্ছ এবং নিরাপদ প্রক্রিয়া জমি মালিক ও ক্রেতা উভয়ের জন্য।'
                : 'Simple, transparent, and secure process for both land owners and seekers.'}
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Sellers */}
            <AnimatedSection direction="left">
              <div className="bg-surface-container-low p-10 md:p-12 rounded-xl">
                <div className="w-16 h-16 bg-primary text-white rounded-lg flex items-center justify-center mb-8 shadow-md">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary mb-4">
                  {lang === 'bn' ? 'বিক্রেতাদের জন্য' : 'For Sellers'}
                </h3>
                <p className="text-on-surface/80 mb-8 leading-relaxed">
                  {lang === 'bn'
                    ? 'হাজার হাজার প্রকৃত ক্রেতার কাছে আপনার জমির বিজ্ঞাপন দিন।'
                    : 'Reach thousands of genuine buyers instantly.'}
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 font-semibold text-primary">
                    <CheckCircle className="h-5 w-5" />
                    {lang === 'bn' ? 'প্রিমিয়াম এড প্লেসমেন্ট' : 'Pay small fee for premium ad placement'}
                  </li>
                  <li className="flex items-center gap-3 font-semibold text-primary">
                    <CheckCircle className="h-5 w-5" />
                    {lang === 'bn' ? 'যাচাইকৃত জমির তথ্য' : 'Get your land verified by our field agents'}
                  </li>
                  <li className="flex items-center gap-3 font-semibold text-primary">
                    <CheckCircle className="h-5 w-5" />
                    {lang === 'bn' ? 'যাচাইকৃত ক্রেতাদের সাথে সরাসরি যোগাযোগ' : 'Direct communication with verified buyers'}
                  </li>
                </ul>
                <Link to="/packages">
                  <button className="w-full py-4 border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                    {lang === 'bn' ? 'বিক্রি শুরু করুন' : 'Start Selling Now'}
                  </button>
                </Link>
              </div>
            </AnimatedSection>

            {/* Buyers */}
            <AnimatedSection direction="right">
              <div className="bg-surface-container-low p-10 md:p-12 rounded-xl">
                <div className="w-16 h-16 bg-secondary text-white rounded-lg flex items-center justify-center mb-8 shadow-md">
                  <SearchCheck className="h-8 w-8" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-secondary mb-4">
                  {lang === 'bn' ? 'ক্রেতাদের জন্য' : 'For Buyers'}
                </h3>
                <p className="text-on-surface/80 mb-8 leading-relaxed">
                  {lang === 'bn'
                    ? 'হাজার হাজার জমির লিস্টিং ব্রাউজ করুন আত্মবিশ্বাসের সাথে।'
                    : 'Browse thousands of land listings with confidence.'}
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 font-semibold text-secondary">
                    <CheckCircle className="h-5 w-5" />
                    {lang === 'bn' ? 'সব লিস্টিং ফ্রিতে দেখুন' : 'Free browsing of all listings'}
                  </li>
                  <li className="flex items-center gap-3 font-semibold text-secondary">
                    <CheckCircle className="h-5 w-5" />
                    {lang === 'bn' ? 'মালিকের তথ্য আনলক করতে পেমেন্ট করুন' : 'Pay only to unlock owner contact details'}
                  </li>
                  <li className="flex items-center gap-3 font-semibold text-secondary">
                    <CheckCircle className="h-5 w-5" />
                    {lang === 'bn' ? 'জমি রেজিস্ট্রেশনে আইনি সহায়তা' : 'Get legal assistance for land registration'}
                  </li>
                </ul>
                <Link to="/listings">
                  <button className="w-full py-4 border-2 border-secondary text-secondary rounded-lg font-bold hover:bg-secondary hover:text-secondary-foreground transition-all duration-200">
                    {lang === 'bn' ? 'জমি খুঁজুন' : 'Find Land Now'}
                  </button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Client Reviews Carousel - CSS Marquee Infinite Scroll */}
      <section className="py-20 md:py-24 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <AnimatedSection direction="up" className="text-center mb-16">
            <span className="font-bold text-sm text-secondary tracking-widest uppercase">
              {lang === 'bn' ? 'ক্লায়েন্ট রিভিউ' : 'Client Reviews'}
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mt-4">
              {lang === 'bn' ? 'বিশ্বস্ত ১০,০০০+ গ্রাহক' : 'Trusted by 10,000+ Clients'}
            </h2>
          </AnimatedSection>
        </div>

        {(() => {
          const reviews = [
            { name_bn: 'তানভীর আহমেদ', name_en: 'Tanvir Ahmed', role_bn: 'যাচাইকৃত ক্রেতা', role_en: 'Verified Buyer', initial: 'ত',
              text_bn: '"Purbachal এ জমি কেনা নিয়ে খুব চিন্তিত ছিলাম। জমি লাগবে প্ল্যাটফর্মের মাধ্যমে আমি সরাসরি মালিকের সাথে কথা বলে ৫ কাঠার প্লটটি নিরাপদভাবে ক্রয় করেছি।"',
              text_en: '"I was worried about buying land in Purbachal. Through Jomi Lagbe, I talked directly with the owner and safely purchased a 5 katha plot."', rating: 5 },
            { name_bn: 'এম এ রহমান', name_en: 'M A Rahman', role_bn: 'জমি মালিক', role_en: 'Land Owner', initial: 'র',
              text_bn: '"আমার পৈত্রিক সম্পত্তি বিক্রি করার জন্য অনেক দালাল ঘুরেছি। অবশেষে জমি লাগবে তে অ্যাড দিয়ে মাত্র ১০ দিনে একজন সিরিয়াস ইনভেস্টর পেয়ে গেলাম।"',
              text_en: '"I went through many brokers to sell my ancestral property. Finally, I posted on Jomi Lagbe and found a serious investor in just 10 days."', rating: 5 },
            { name_bn: 'ফারহানা ইসলাম', name_en: 'Farhana Islam', role_bn: 'বিনিয়োগকারী', role_en: 'Investor', initial: 'ফ',
              text_bn: '"কৃষি জমিতে বিনিয়োগ করতে চেয়েছিলাম। জমি লাগবে থেকে ময়মনসিংহে ১০ বিঘা উর্বর জমি পেয়েছি একদম যাচাইকৃত দলিল সহ।"',
              text_en: '"I wanted to invest in agricultural land. Found 10 bigha fertile land in Mymensingh through Jomi Lagbe with fully verified documents."', rating: 5 },
            { name_bn: 'কামরুল হাসান', name_en: 'Kamrul Hasan', role_bn: 'যাচাইকৃত ক্রেতা', role_en: 'Verified Buyer', initial: 'ক',
              text_bn: '"ঢাকার আশেপাশে কমার্শিয়াল প্লট খুঁজছিলাম। জমি লাগবে তে ফিল্টার করে সহজেই গাজীপুরে পারফেক্ট লোকেশন পেয়ে গেলাম।"',
              text_en: '"Was looking for commercial plots near Dhaka. Used Jomi Lagbe filters and easily found the perfect location in Gazipur."', rating: 5 },
            { name_bn: 'সাবরিনা চৌধুরী', name_en: 'Sabrina Chowdhury', role_bn: 'জমি মালিক', role_en: 'Land Owner', initial: 'স',
              text_bn: '"প্ল্যাটফর্মটি অসাধারণ! আমার জমির বিজ্ঞাপন দেওয়ার ২ সপ্তাহের মধ্যে ৫ জন আগ্রহী ক্রেতা পেয়েছি। সত্যিই কাজের।"',
              text_en: '"The platform is amazing! Within 2 weeks of posting my land ad, I got 5 interested buyers. Truly effective."', rating: 5 },
            { name_bn: 'আরিফুল ইসলাম', name_en: 'Ariful Islam', role_bn: 'বিনিয়োগকারী', role_en: 'Investor', initial: 'আ',
              text_bn: '"চট্টগ্রামে ইন্ডাস্ট্রিয়াল জমি খুঁজতে গিয়ে জমি লাগবে আমার জন্য সবচেয়ে ভালো অভিজ্ঞতা দিয়েছে। ম্যাপ ও ভেরিফাইড ডকুমেন্ট দেখে সিদ্ধান্ত নিতে সুবিধা হয়েছে।"',
              text_en: '"Jomi Lagbe gave me the best experience while searching for industrial land in Chittagong. The map and verified documents made decision-making easy."', rating: 5 },
            { name_bn: 'নাজমুল হক', name_en: 'Nazmul Hoque', role_bn: 'যাচাইকৃত ক্রেতা', role_en: 'Verified Buyer', initial: 'ন',
              text_bn: '"সাভারে বাড়ির জন্য প্লট কিনেছি জমি লাগবে থেকে। মালিকের সাথে সরাসরি কথা বলে ডিল করেছি, কোনো দালালের ঝামেলা নেই।"',
              text_en: '"Bought a plot for a house in Savar from Jomi Lagbe. Dealt directly with the owner, no broker hassle."', rating: 4 },
            { name_bn: 'রুমানা আক্তার', name_en: 'Rumana Akter', role_bn: 'জমি মালিক', role_en: 'Land Owner', initial: 'রু',
              text_bn: '"রাজশাহীতে আমার কৃষি জমি বিক্রি করতে জমি লাগবে ব্যবহার করেছি। সহজ প্রক্রিয়া, দ্রুত ক্রেতা পেয়েছি।"',
              text_en: '"Used Jomi Lagbe to sell my agricultural land in Rajshahi. Simple process, found a buyer quickly."', rating: 5 },
          ];
          const duplicated = [...reviews, ...reviews];
          return (
            <div className="marquee-container">
              <div className="marquee-track">
                {duplicated.map((review, i) => (
                  <div key={i} className="marquee-item">
                    <div className="bg-surface-container-low p-8 rounded-xl shadow-sm h-full flex flex-col min-w-[320px] max-w-[380px]">
                      <Quote className="h-8 w-8 text-secondary/30 mb-4" />
                      <div className="flex gap-1 text-secondary mb-4">
                        {[...Array(review.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                      </div>
                      <p className="text-on-surface leading-relaxed mb-6 italic flex-1 text-sm">
                        {lang === 'bn' ? review.text_bn : review.text_en}
                      </p>
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{review.initial}</div>
                        <div>
                          <h4 className="font-bold text-primary text-sm">{lang === 'bn' ? review.name_bn : review.name_en}</h4>
                          <p className="text-xs text-outline font-bold uppercase">{lang === 'bn' ? review.role_bn : review.role_en}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-24 bg-surface px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection stagger={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center justify-center p-6 bg-card rounded-xl text-center border border-outline-variant/20 shadow-sm hover-lift">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <span className="text-2xl font-bold text-primary">১০০%</span>
              <p className="text-xs text-outline font-bold uppercase mt-1">{lang === 'bn' ? 'যাচাইকৃত তথ্য' : 'Verified Docs'}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-card rounded-xl text-center border border-outline-variant/20 shadow-sm hover-lift">
              <Users className="h-8 w-8 text-secondary mb-3" />
              <span className="text-2xl font-bold text-primary">৫০হাজার+</span>
              <p className="text-xs text-outline font-bold uppercase mt-1">{lang === 'bn' ? 'সক্রিয় ইউজার' : 'Active Users'}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-card rounded-xl text-center border border-outline-variant/20 shadow-sm hover-lift">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <span className="text-2xl font-bold text-primary">{lang === 'bn' ? 'নিরাপদ' : 'Secure'}</span>
              <p className="text-xs text-outline font-bold uppercase mt-1">{lang === 'bn' ? 'নিরাপদ লেনদেন' : 'Secure Transactions'}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-card rounded-xl text-center border border-outline-variant/20 shadow-sm hover-lift">
              <Headphones className="h-8 w-8 text-secondary mb-3" />
              <span className="text-2xl font-bold text-primary">২৪/৭</span>
              <p className="text-xs text-outline font-bold uppercase mt-1">{lang === 'bn' ? 'সাপোর্ট' : 'Expert Support'}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-24 bg-surface-container px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="up" className="text-center mb-16">
            <span className="font-bold text-sm text-secondary tracking-widest uppercase">
              {lang === 'bn' ? 'সচরাচর জিজ্ঞাসা' : 'FAQ'}
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mt-4">
              {lang === 'bn' ? 'আপনার প্রশ্নের উত্তর' : 'Frequently Asked Questions'}
            </h2>
          </AnimatedSection>
          <AnimatedSection stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <Accordion type="single" collapsible className="space-y-4">
              {[
                { q_bn: 'জমি লাগবে কিভাবে কাজ করে?', q_en: 'How does Jomi Lagbe work?',
                  a_bn: 'জমি লাগবে একটি অনলাইন প্ল্যাটফর্ম যেখানে জমি মালিকরা তাদের জমি বিক্রির বিজ্ঞাপন দিতে পারেন এবং ক্রেতারা সহজেই ফিল্টার করে তাদের পছন্দের জমি খুঁজে পেতে পারেন।',
                  a_en: 'Jomi Lagbe is an online platform where land owners can post their land for sale and buyers can easily filter and find their preferred land.' },
                { q_bn: 'জমি কেনা কি নিরাপদ?', q_en: 'Is it safe to buy land here?',
                  a_bn: 'হ্যাঁ, আমাদের প্ল্যাটফর্মে সকল জমির তথ্য যাচাই করা হয়। তবে চূড়ান্ত কেনার আগে অবশ্যই একজন আইনজীবীর পরামর্শ নিন এবং সরাসরি জমি পরিদর্শন করুন।',
                  a_en: 'Yes, all land information on our platform is verified. However, always consult a lawyer and visit the land in person before finalizing a purchase.' },
                { q_bn: 'মালিকের তথ্য কিভাবে পাবো?', q_en: 'How do I get owner contact info?',
                  a_bn: 'মালিকের ফোন নম্বর ও ঠিকানা দেখতে আপনাকে একটি ছোট আনলক ফি প্রদান করতে হবে। একবার আনলক করলে সেটি সবসময় দেখতে পাবেন।',
                  a_en: 'You need to pay a small unlock fee to view the owner\'s phone number and address. Once unlocked, you can always access it.' },
              ].map((faq, i) => (
                <AccordionItem key={`left-${i}`} value={`left-${i}`} className="bg-surface-container-lowest rounded-xl border-none px-6">
                  <AccordionTrigger className="text-primary font-semibold text-left hover:no-underline">
                    {lang === 'bn' ? faq.q_bn : faq.q_en}
                  </AccordionTrigger>
                  <AccordionContent className="text-on-surface/80 leading-relaxed">
                    {lang === 'bn' ? faq.a_bn : faq.a_en}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {/* Right column */}
            <Accordion type="single" collapsible className="space-y-4">
              {[
                { q_bn: 'জমি বিক্রির বিজ্ঞাপন কিভাবে দেবো?', q_en: 'How do I post a land ad?',
                  a_bn: 'প্রথমে রেজিস্ট্রেশন করুন, তারপর এড প্যাকেজ কিনুন। প্যাকেজ কেনার পর আপনি জমির ছবি, বিবরণ ও দাম দিয়ে বিজ্ঞাপন দিতে পারবেন।',
                  a_en: 'First register, then buy an ad package. After purchasing, you can post your land ad with photos, description, and pricing.' },
                { q_bn: 'পেমেন্ট কিভাবে করবো?', q_en: 'What payment methods are accepted?',
                  a_bn: 'আমরা বিকাশ, নগদ, রকেট এবং ব্যাংক ট্রান্সফারের মাধ্যমে পেমেন্ট গ্রহণ করি। সকল লেনদেন নিরাপদ ও এনক্রিপ্টেড।',
                  a_en: 'We accept payments via bKash, Nagad, Rocket, and bank transfers. All transactions are secure and encrypted.' },
                { q_bn: 'রিফান্ড পলিসি কি?', q_en: 'What is the refund policy?',
                  a_bn: 'যদি কোনো জমির তথ্য ভুল প্রমাণিত হয় তাহলে আনলক ফি ফেরত দেওয়া হবে। এড প্যাকেজের টাকা প্রকাশের পর ফেরতযোগ্য নয়।',
                  a_en: 'If any land information is proven incorrect, the unlock fee will be refunded. Ad package fees are non-refundable after publication.' },
              ].map((faq, i) => (
                <AccordionItem key={`right-${i}`} value={`right-${i}`} className="bg-surface-container-lowest rounded-xl border-none px-6">
                  <AccordionTrigger className="text-primary font-semibold text-left hover:no-underline">
                    {lang === 'bn' ? faq.q_bn : faq.q_en}
                  </AccordionTrigger>
                  <AccordionContent className="text-on-surface/80 leading-relaxed">
                    {lang === 'bn' ? faq.a_bn : faq.a_en}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-primary px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection direction="up">
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
              {lang === 'bn' ? 'আপনার জমি খোঁজার সময় এসেছে!' : 'Ready to secure your piece of earth?'}
            </h2>
            <p className="text-white/80 text-lg mb-12 font-body">
              {lang === 'bn'
                ? 'হাজার হাজার মানুষ জমি লাগবেতে তাদের স্বপ্নের জমি পেয়েছেন। আজই ব্রাউজ করুন অথবা আপনার জমি লিস্ট করুন।'
                : 'Join thousands of people who have found their perfect land on Jomi Lagbe. Start browsing or list your property today.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/listings">
                <button className="bg-secondary-container text-on-secondary-container px-12 py-5 rounded-lg font-bold text-lg transition-all hover:scale-105">
                  {lang === 'bn' ? 'জমি দেখুন' : 'Browse Listings'}
                </button>
              </Link>
              <Link to="/packages">
                <button className="bg-white/10 text-white border border-white/20 backdrop-blur px-12 py-5 rounded-lg font-bold text-lg transition-all hover:bg-white/20">
                  {lang === 'bn' ? 'এড দিন' : 'Contact Sales'}
                </button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
