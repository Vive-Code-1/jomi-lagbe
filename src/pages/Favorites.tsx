import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import LandCard from '@/components/LandCard';
import { Navigate } from 'react-router-dom';

const Favorites = () => {
  const { t } = useI18n();
  const { user, loading: authLoading } = useAuth();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('land_id, lands(*)')
        .eq('user_id', user!.id);
      if (error) throw error;
      return data?.map((f: any) => f.lands).filter(Boolean) || [];
    },
  });

  if (!authLoading && !user) return <Navigate to="/auth" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">{t('favorites')}</h1>
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-72 animate-pulse rounded-lg bg-muted" />)}
        </div>
      ) : favorites && favorites.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((land: any) => (
            <LandCard key={land.id} {...land} images={land.images || []} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">{t('noResults')}</p>
      )}
    </div>
  );
};

export default Favorites;
