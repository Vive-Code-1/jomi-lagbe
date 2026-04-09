import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import LandCard from '@/components/LandCard';
import { Search, MapPin, Shield, Phone } from 'lucide-react';

const Index = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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
    navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-primary px-4 py-20 text-center text-primary-foreground md:py-32">
        <div className="container mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">{t('heroTitle')}</h1>
          <p className="mb-8 text-lg opacity-90">{t('heroSubtitle')}</p>
          <div className="flex gap-2 mx-auto max-w-xl">
            <Input
              className="flex-1 bg-background text-foreground"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="secondary" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-1" />
              {t('search')}
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">
              {lang === 'bn' ? 'সব এলাকার জমি' : 'Lands from All Areas'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {lang === 'bn' ? 'আপনার পছন্দের এলাকায় জমি খুঁজুন' : 'Find land in your preferred area'}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">
              {lang === 'bn' ? 'যাচাইকৃত তথ্য' : 'Verified Information'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {lang === 'bn' ? 'সব জমির তথ্য যাচাই করা হয়' : 'All land information is verified'}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">
              {lang === 'bn' ? 'সরাসরি মালিকের সাথে যোগাযোগ' : 'Direct Contact with Owner'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {lang === 'bn' ? 'মালিকের সাথে সরাসরি কথা বলুন' : 'Talk directly with the owner'}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Lands */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {lang === 'bn' ? 'ফিচার্ড জমি' : 'Featured Lands'}
          </h2>
          <Button variant="outline" asChild>
            <Link to="/listings">{t('viewDetails')}</Link>
          </Button>
        </div>
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : featuredLands && featuredLands.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <p className="text-center text-muted-foreground">{t('noResults')}</p>
        )}
      </section>
    </div>
  );
};

export default Index;
