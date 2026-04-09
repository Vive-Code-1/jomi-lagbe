import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import LandCard from '@/components/LandCard';
import { Search } from 'lucide-react';

const Listings = () => {
  const { t, lang } = useI18n();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [areaFilter, setAreaFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minSize, setMinSize] = useState('');
  const [maxRoad, setMaxRoad] = useState('');

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
    return lands.filter((l: any) => {
      const title = lang === 'bn' ? l.title_bn : l.title_en;
      const loc = lang === 'bn' ? l.location_bn : l.location_en;
      const searchMatch = !search || title.toLowerCase().includes(search.toLowerCase()) || loc.toLowerCase().includes(search.toLowerCase());
      const areaMatch = areaFilter === 'all' || loc === areaFilter;
      const priceMinMatch = !minPrice || l.price >= Number(minPrice);
      const priceMaxMatch = !maxPrice || l.price <= Number(maxPrice);
      const sizeMatch = !minSize || l.area_size >= Number(minSize);
      const roadMatch = !maxRoad || l.road_width >= Number(maxRoad);
      return searchMatch && areaMatch && priceMinMatch && priceMaxMatch && sizeMatch && roadMatch;
    });
  }, [lands, search, areaFilter, minPrice, maxPrice, minSize, maxRoad, lang]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">{t('listings')}</h1>

      {/* Filters */}
      <div className="mb-8 rounded-lg border bg-card p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2 lg:col-span-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger><SelectValue placeholder={t('filterByArea')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allAreas')}</SelectItem>
              {areas.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="number" placeholder={t('minPrice')} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <Input type="number" placeholder={t('maxPrice')} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          <Input type="number" placeholder={`${t('filterByRoad')} (${t('feet')})`} value={maxRoad} onChange={(e) => setMaxRoad(e.target.value)} />
        </div>
        {(search || areaFilter !== 'all' || minPrice || maxPrice || minSize || maxRoad) && (
          <Button variant="ghost" size="sm" className="mt-3" onClick={() => { setSearch(''); setAreaFilter('all'); setMinPrice(''); setMaxPrice(''); setMinSize(''); setMaxRoad(''); }}>
            {t('clearFilter')}
          </Button>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((land: any) => (
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
        <p className="py-12 text-center text-muted-foreground">{t('noResults')}</p>
      )}
    </div>
  );
};

export default Listings;
