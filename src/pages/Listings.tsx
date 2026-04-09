import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Footer from '@/components/Footer';
import { Search, MapPin, Ruler, Route, Heart, ChevronLeft, ChevronRight, ArrowRight, Map } from 'lucide-react';

const Listings = () => {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [areaFilter, setAreaFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [roadFilter, setRoadFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const { data: lands, isLoading } = useQuery({
    queryKey: ['all-lands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lands')
        .select('*')
        .eq('status', 'active')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const areas = useMemo(() => {
    if (!lands) return [];
    const set = new Set(lands.map((l: any) => lang === 'bn' ? l.location_bn : l.location_en));
    return Array.from(set);
  }, [lands, lang]);

  const filtered = useMemo(() => {
    if (!lands) return [];
    let result = lands.filter((l: any) => {
      const title = lang === 'bn' ? l.title_bn : l.title_en;
      const loc = lang === 'bn' ? l.location_bn : l.location_en;
      const searchMatch = !search || title.toLowerCase().includes(search.toLowerCase()) || loc.toLowerCase().includes(search.toLowerCase());
      const areaMatch = areaFilter === 'all' || loc === areaFilter;
      const priceMinMatch = !minPrice || l.price >= Number(minPrice);
      const priceMaxMatch = !maxPrice || l.price <= Number(maxPrice);
      
      let sizeMatch = true;
      if (sizeFilter === '3-5') sizeMatch = l.area_size >= 3 && l.area_size <= 5;
      else if (sizeFilter === '5-10') sizeMatch = l.area_size >= 5 && l.area_size <= 10;
      else if (sizeFilter === '10+') sizeMatch = l.area_size >= 10;

      let roadMatch = true;
      if (roadFilter.includes('20+')) roadMatch = roadMatch && l.road_width >= 20;
      if (roadFilter.includes('40+')) roadMatch = roadMatch && l.road_width >= 40;

      return searchMatch && areaMatch && priceMinMatch && priceMaxMatch && sizeMatch && roadMatch;
    });

    if (sortBy === 'price-asc') result.sort((a: any, b: any) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a: any, b: any) => b.price - a.price);
    else if (sortBy === 'size-desc') result.sort((a: any, b: any) => b.area_size - a.area_size);

    return result;
  }, [lands, search, areaFilter, minPrice, maxPrice, sizeFilter, roadFilter, sortBy, lang]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginatedLands = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleRoadFilter = (val: string) => {
    setRoadFilter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch(''); setAreaFilter('all'); setMinPrice(''); setMaxPrice(''); setSizeFilter('all'); setRoadFilter([]); setCurrentPage(1);
  };

  return (
    <div className="bg-surface min-h-screen">
      <div className="flex pt-20">
        {/* Sidebar Filter */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-20 h-[calc(100vh-5rem)] w-72 bg-surface-container-low p-8 overflow-y-auto z-40">
          <div className="mb-8">
            <h3 className="font-headline font-bold text-primary text-xl mb-6">
              {lang === 'bn' ? 'ফিল্টার করুন' : 'Filter'}
            </h3>

            {/* Price Range */}
            <div className="mb-8">
              <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                {lang === 'bn' ? 'মূল্য সীমা (BDT)' : 'Price Range (BDT)'}
              </label>
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder={lang === 'bn' ? 'সর্বনিম্ন' : 'Min'}
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-md py-2 px-3 text-sm focus:ring-primary focus:border-primary font-medium"
                />
                <input
                  type="number"
                  placeholder={lang === 'bn' ? 'সর্বোচ্চ' : 'Max'}
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-md py-2 px-3 text-sm focus:ring-primary focus:border-primary font-medium"
                />
              </div>
            </div>

            {/* Size (Katha) */}
            <div className="mb-8">
              <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                {lang === 'bn' ? 'পরিমাণ (কাঠা)' : 'Size (Katha)'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: '3-5', label: '৩-৫ কাঠা' },
                  { val: '5-10', label: '৫-১০ কাঠা' },
                  { val: '10+', label: '১০+ কাঠা' },
                  { val: 'all', label: lang === 'bn' ? 'সবগুলো' : 'All' },
                ].map(s => (
                  <button
                    key={s.val}
                    onClick={() => { setSizeFilter(s.val); setCurrentPage(1); }}
                    className={`px-3 py-2 text-xs rounded-md font-medium transition-colors ${
                      sizeFilter === s.val
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Road Width */}
            <div className="mb-8">
              <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                {lang === 'bn' ? 'রাস্তার প্রস্থ' : 'Road Width'}
              </label>
              <div className="space-y-2">
                {[
                  { val: '20+', label: lang === 'bn' ? '২০ ফুট+ রাস্তা' : '20ft+ Road' },
                  { val: '40+', label: lang === 'bn' ? '৪০ ফুট+ রাস্তা' : '40ft+ Road' },
                ].map(r => (
                  <label key={r.val} className="flex items-center gap-3 text-sm cursor-pointer group font-medium">
                    <input
                      type="checkbox"
                      checked={roadFilter.includes(r.val)}
                      onChange={() => toggleRoadFilter(r.val)}
                      className="rounded text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="group-hover:text-primary transition-colors">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mb-8">
              <label className="block font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                {lang === 'bn' ? 'লোকেশন' : 'Location'}
              </label>
              <select
                value={areaFilter}
                onChange={(e) => { setAreaFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-md py-2 px-3 text-sm focus:ring-primary focus:border-primary font-medium"
              >
                <option value="all">{lang === 'bn' ? 'সব এলাকা' : 'All Areas'}</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-primary/20"
            >
              {lang === 'bn' ? 'ফিল্টার প্রয়োগ করুন' : 'Apply Filters'}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:ml-72 min-h-screen px-6 lg:px-12 py-10 bg-surface">
          {/* Header & Sorting */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary leading-tight mb-2">
                {lang === 'bn' ? 'উপলব্ধ সকল জমি' : 'Available Land Listings'}
              </h1>
              <p className="text-on-surface-variant font-body">
                {lang === 'bn' ? 'আপনার স্বপ্নের ঠিকানার জন্য সেরা প্লটটি বেছে নিন' : 'Choose the best plot for your dream address'}
              </p>
            </div>
            <div className="flex items-center gap-4 self-end">
              <span className="text-sm font-label font-semibold text-on-surface-variant">
                {lang === 'bn' ? 'সর্ট করুন:' : 'Sort by:'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer font-body"
              >
                <option value="newest">{lang === 'bn' ? 'নতুন তালিকা' : 'Newest'}</option>
                <option value="price-asc">{lang === 'bn' ? 'মূল্য: কম থেকে বেশি' : 'Price: Low to High'}</option>
                <option value="price-desc">{lang === 'bn' ? 'মূল্য: বেশি থেকে কম' : 'Price: High to Low'}</option>
                <option value="size-desc">{lang === 'bn' ? 'আকার: বড় থেকে ছোট' : 'Size: Large to Small'}</option>
              </select>
            </div>
          </div>

          {/* Mobile search */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center bg-surface-container rounded-full px-4 py-2">
              <Search className="h-4 w-4 text-on-surface-variant" />
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 font-label outline-none"
                placeholder={lang === 'bn' ? 'লোকেশন খুঁজুন...' : 'Search locations...'}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>

          {/* Property Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 animate-pulse rounded-xl bg-surface-container" />
              ))}
            </div>
          ) : paginatedLands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {paginatedLands.map((land: any, idx: number) => {
                const title = lang === 'bn' ? land.title_bn : land.title_en;
                const location = lang === 'bn' ? land.location_bn : land.location_en;
                return (
                  <div key={land.id} className="group bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_24px_48px_rgba(27,29,14,0.08)]">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={land.images?.[0] || '/placeholder.svg'}
                        alt={title}
                        loading="lazy"
                      />
                      {land.is_featured && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            {lang === 'bn' ? 'প্রিমিয়াম' : 'Premium Listing'}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-white/90 backdrop-blur-md text-primary px-3 py-1 rounded-lg text-sm font-bold">
                          ৳ {land.price.toLocaleString()} / {lang === 'bn' ? 'কাঠা' : 'Katha'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-headline font-bold text-xl text-primary group-hover:text-secondary transition-colors line-clamp-1">
                          {title}
                        </h3>
                        <button className="text-on-surface-variant hover:text-destructive transition-colors flex-shrink-0 ml-2">
                          <Heart className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-y-4 mb-6">
                        <div className="flex items-center gap-2">
                          <Ruler className="h-4 w-4 text-secondary" />
                          <span className="text-sm font-label font-medium text-on-surface-variant">
                            {land.area_size} {lang === 'bn' ? 'কাঠা' : 'Katha'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Route className="h-4 w-4 text-secondary" />
                          <span className="text-sm font-label font-medium text-on-surface-variant">
                            {land.road_width} {lang === 'bn' ? 'ফুট রাস্তা' : 'ft Road'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <MapPin className="h-4 w-4 text-secondary" />
                          <span className="text-sm font-label font-medium text-on-surface-variant line-clamp-1">
                            {location}
                          </span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-surface-container flex justify-between items-center">
                        <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
                          Plot ID: {land.id.slice(0, 5).toUpperCase()}
                        </span>
                        <Link
                          to={`/land/${land.id}`}
                          className="text-primary font-bold text-sm flex items-center gap-1 group/btn"
                        >
                          {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* CTA Card - show after 3rd card if there are enough cards */}
              {currentPage === 1 && paginatedLands.length >= 3 && (
                <div className="flex flex-col justify-between bg-primary rounded-xl p-8 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-2xl font-headline font-bold mb-4">
                      {lang === 'bn' ? 'আপনি কি জমি বিক্রি করতে চান?' : 'Want to sell your land?'}
                    </h2>
                    <p className="text-primary-container/80 font-body text-sm mb-8">
                      {lang === 'bn'
                        ? 'হাজার হাজার বিশ্বস্ত ক্রেতার কাছে আপনার জমিটি পৌঁছে দিন সহজ ৩টি ধাপে।'
                        : 'Reach thousands of trusted buyers in 3 simple steps.'}
                    </p>
                    <Link to="/packages">
                      <button className="bg-secondary-container text-on-secondary-container px-8 py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95">
                        {lang === 'bn' ? 'বিজ্ঞাপন দিন' : 'Post Ad'}
                      </button>
                    </Link>
                  </div>
                  <Map className="absolute -bottom-8 -right-8 h-44 w-44 opacity-10 rotate-12" />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-on-surface-variant text-lg font-body">{t('noResults')}</p>
              <button onClick={clearFilters} className="mt-4 text-primary font-bold underline">
                {lang === 'bn' ? 'ফিল্টার মুছুন' : 'Clear Filters'}
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2 font-body">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {lang === 'bn' ? page.toLocaleString('bn-BD') : page}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="flex items-center text-outline-variant">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${
                        currentPage === totalPages
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {lang === 'bn' ? totalPages.toLocaleString('bn-BD') : totalPages}
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Listings;
