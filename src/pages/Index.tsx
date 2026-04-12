import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import LandCard from '@/components/LandCard';
import Footer from '@/components/Footer';
import { Search, MapPin, Ruler, Route, Upload, SearchCheck, CheckCircle, Shield, Users, Headphones, Star, ChevronDown } from 'lucide-react';
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
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            {lang === 'bn' ? 'আপনার স্বপ্নের জমি,' : 'Find Your Dream'}
            <br />
            <span className="text-secondary-container">
              {lang === 'bn' ? 'এখন হাতের নাগালে।' : 'Land Today.'}
            </span>
          </h1>
          <p className="font-body text-lg md:text-xl text-white/95 mb-12 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'বাংলাদেশের সেরা আবাসিক, বাণিজ্যিক ও কৃষি জমি খুঁজুন। আপনার ভবিষ্যৎ সুরক্ষিত করুন আজই।'
              : 'Explore premium residential, commercial, and agricultural plots across Bangladesh. Secure your future legacy today.'}
          </p>

          {/* Search Bar */}
          <div className="bg-surface/90 backdrop-blur-md p-4 md:p-6 rounded-xl shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full text-left px-4 md:border-r border-outline-variant/50">
              <label className="block text-xs uppercase tracking-widest font-bold text-outline mb-1 font-label">
                {lang === 'bn' ? 'জেলা নির্বাচন' : 'Select District'}
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <select
                  className="w-full bg-transparent border-none focus:ring-0 font-semibold text-on-surface outline-none cursor-pointer appearance-none"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  <option value="">{lang === 'bn' ? 'সব জেলা' : 'All Districts'}</option>
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
            <div className="flex-1 w-full text-left px-4 md:border-r border-outline-variant/50">
              <label className="block text-xs uppercase tracking-widest font-bold text-outline mb-1 font-label">
                {lang === 'bn' ? 'কীওয়ার্ড' : 'Keyword'}
              </label>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <input
                  className="w-full bg-transparent border-none focus:ring-0 font-semibold text-on-surface placeholder:text-outline-variant outline-none"
                  placeholder={lang === 'bn' ? 'জমির ধরন, এলাকা...' : 'Land type, area...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="bg-primary hover:opacity-90 text-primary-foreground px-8 py-4 rounded-lg font-bold flex items-center gap-2 transition-all duration-200 active:scale-95 whitespace-nowrap"
            >
              <Search className="h-5 w-5" />
              {lang === 'bn' ? 'জমি খুঁজুন' : 'Search Land'}
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 md:py-24 bg-surface px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
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
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="py-20 md:py-24 bg-surface-container-low px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-bold text-sm text-secondary tracking-widest uppercase">
              {lang === 'bn' ? 'নতুন এসেছে' : 'New Arrivals'}
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mt-4">
              {lang === 'bn' ? 'সাম্প্রতিক জমি' : 'Latest Listings'}
            </h2>
          </div>
          {isLoading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-xl bg-surface-container" />
              ))}
            </div>
          ) : featuredLands && featuredLands.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
            </div>
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
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl font-bold text-primary">
              {lang === 'bn' ? 'জমি লাগবে কিভাবে কাজ করে' : 'How Jomi Lagbe Works'}
            </h2>
            <p className="text-outline mt-4 max-w-xl mx-auto">
              {lang === 'bn'
                ? 'সহজ, স্বচ্ছ এবং নিরাপদ প্রক্রিয়া জমি মালিক ও ক্রেতা উভয়ের জন্য।'
                : 'Simple, transparent, and secure process for both land owners and seekers.'}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Sellers */}
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

            {/* Buyers */}
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
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 md:py-24 bg-surface px-6 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            <div className="lg:w-1/2">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-8 leading-tight">
                {lang === 'bn' ? 'বিশ্বস্ত ১০,০০০+' : 'Trusted by 10,000+'}
                <br />
                {lang === 'bn' ? 'জমি মালিক ও বিনিয়োগকারী' : 'Landowners & Investors'}
              </h2>
              <div className="space-y-8">
                {/* Testimonial 1 */}
                <div className="bg-surface-container-low p-8 rounded-xl shadow-sm">
                  <div className="flex gap-1 text-secondary mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                  </div>
                  <p className="text-on-surface leading-relaxed mb-6 italic">
                    {lang === 'bn'
                      ? '"Purbachal এ জমি কেনা নিয়ে খুব চিন্তিত ছিলাম। জমি লাগবে প্ল্যাটফর্মের মাধ্যমে আমি সরাসরি মালিকের সাথে কথা বলে ৫ কাঠার প্লটটি নিরাপদভাবে ক্রয় করেছি।"'
                      : '"I was worried about buying land in Purbachal. Through Jomi Lagbe, I talked directly with the owner and safely purchased a 5 katha plot."'}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">ত</div>
                    <div>
                      <h4 className="font-bold text-primary">{lang === 'bn' ? 'তানভীর আহমেদ' : 'Tanvir Ahmed'}</h4>
                      <p className="text-xs text-outline font-bold uppercase">{lang === 'bn' ? 'যাচাইকৃত ক্রেতা' : 'Verified Buyer'}</p>
                    </div>
                  </div>
                </div>
                {/* Testimonial 2 */}
                <div className="bg-surface-container-low p-8 rounded-xl shadow-sm lg:ml-12">
                  <div className="flex gap-1 text-secondary mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                  </div>
                  <p className="text-on-surface leading-relaxed mb-6 italic">
                    {lang === 'bn'
                      ? '"আমার পৈত্রিক সম্পত্তি বিক্রি করার জন্য অনেক দালাল ঘুরেছি। অবশেষে জমি লাগবে তে অ্যাড দিয়ে মাত্র ১০ দিনে একজন সিরিয়াস ইনভেস্টর পেয়ে গেলাম।"'
                      : '"I went through many brokers to sell my ancestral property. Finally, I posted on Jomi Lagbe and found a serious investor in just 10 days."'}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">র</div>
                    <div>
                      <h4 className="font-bold text-primary">{lang === 'bn' ? 'এম এ রহমান' : 'M A Rahman'}</h4>
                      <p className="text-xs text-outline font-bold uppercase">{lang === 'bn' ? 'জমি মালিক' : 'Land Owner'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="lg:w-1/2 grid grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col items-center justify-center p-8 md:p-10 bg-surface rounded-xl shadow-sm text-center">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <span className="text-3xl font-bold text-primary">১০০%</span>
                <p className="text-xs text-outline font-bold uppercase mt-2">{lang === 'bn' ? 'যাচাইকৃত তথ্য' : 'Verified Documents'}</p>
              </div>
              <div className="flex flex-col items-center justify-center p-8 md:p-10 bg-surface rounded-xl shadow-sm text-center mt-8 md:mt-12">
                <Users className="h-10 w-10 text-secondary mb-4" />
                <span className="text-3xl font-bold text-primary">৫০হাজার+</span>
                <p className="text-xs text-outline font-bold uppercase mt-2">{lang === 'bn' ? 'সক্রিয় ইউজার' : 'Active Users'}</p>
              </div>
              <div className="flex flex-col items-center justify-center p-8 md:p-10 bg-surface rounded-xl shadow-sm text-center">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <span className="text-3xl font-bold text-primary">{lang === 'bn' ? 'নিরাপদ' : 'Secure'}</span>
                <p className="text-xs text-outline font-bold uppercase mt-2">{lang === 'bn' ? 'নিরাপদ লেনদেন' : 'Secure Transactions'}</p>
              </div>
              <div className="flex flex-col items-center justify-center p-8 md:p-10 bg-surface rounded-xl shadow-sm text-center mt-8 md:mt-12">
                <Headphones className="h-10 w-10 text-secondary mb-4" />
                <span className="text-3xl font-bold text-primary">২৪/৭</span>
                <p className="text-xs text-outline font-bold uppercase mt-2">{lang === 'bn' ? 'সাপোর্ট' : 'Expert Support'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-primary px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
