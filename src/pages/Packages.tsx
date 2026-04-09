import { useI18n } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Star } from 'lucide-react';

const Packages = () => {
  const { t, lang } = useI18n();

  const { data: packages, isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ad_packages').select('*').order('price');
      if (error) throw error;
      return data;
    },
  });

  const handleBuy = () => {
    toast.info(lang === 'bn' ? 'পেমেন্ট সিস্টেম শীঘ্রই আসছে' : 'Payment system coming soon');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-center text-2xl font-bold text-foreground">{t('adPackages')}</h1>
      <p className="mb-8 text-center text-muted-foreground">
        {lang === 'bn' ? 'আপনার জমির বিজ্ঞাপন দিন' : 'Advertise your land'}
      </p>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />)}
        </div>
      ) : packages && packages.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg: any) => (
            <Card key={pkg.id} className={pkg.is_featured ? 'border-secondary ring-2 ring-secondary' : ''}>
              <CardHeader className="text-center">
                {pkg.is_featured && (
                  <Badge className="mx-auto mb-2 w-fit bg-secondary text-secondary-foreground">
                    <Star className="mr-1 h-3 w-3" /> {t('featured')}
                  </Badge>
                )}
                <CardTitle>{lang === 'bn' ? pkg.name_bn : pkg.name_en}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-2 text-3xl font-bold text-primary">{t('taka')} {pkg.price.toLocaleString()}</p>
                <p className="mb-4 text-sm text-muted-foreground">{pkg.duration} {t('days')}</p>
                <Button onClick={handleBuy} className="w-full">{t('buyPackage')}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">{t('noResults')}</p>
      )}
    </div>
  );
};

export default Packages;
