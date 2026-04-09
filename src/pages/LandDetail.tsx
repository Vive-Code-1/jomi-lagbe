import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Heart, MapPin, Ruler, Route, ArrowLeft, Lock, Unlock, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const LandDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: land, isLoading } = useQuery({
    queryKey: ['land', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('lands').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: isUnlocked } = useQuery({
    queryKey: ['unlock', id, user?.id],
    enabled: !!user && !!id,
    queryFn: async () => {
      const { data } = await supabase
        .from('contact_unlocks')
        .select('id')
        .eq('user_id', user!.id)
        .eq('land_id', id!)
        .maybeSingle();
      return !!data;
    },
  });

  const { data: isFavorited } = useQuery({
    queryKey: ['favorite', id, user?.id],
    enabled: !!user && !!id,
    queryFn: async () => {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user!.id)
        .eq('land_id', id!)
        .maybeSingle();
      return !!data;
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: async () => {
      if (!user) { navigate('/auth'); return; }
      if (isFavorited) {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('land_id', id!);
      } else {
        await supabase.from('favorites').insert({ user_id: user.id, land_id: id! });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite', id, user?.id] });
    },
  });

  const handleUnlock = async () => {
    if (!user) { navigate('/auth'); return; }
    // TODO: integrate UddoktaPay payment
    toast.info(lang === 'bn' ? 'পেমেন্ট সিস্টেম শীঘ্রই আসছে' : 'Payment system coming soon');
  };

  if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">{t('loading')}</div>;
  if (!land) return <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">{t('error')}</div>;

  const title = lang === 'bn' ? land.title_bn : land.title_en;
  const location = lang === 'bn' ? land.location_bn : land.location_en;
  const description = lang === 'bn' ? land.description_bn : land.description_en;
  const images = land.images || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-1 h-4 w-4" /> {t('back')}
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Images */}
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            <img
              src={images[selectedImage] || '/placeholder.svg'}
              alt={title}
              className="h-full w-full object-cover"
            />
            {land.is_featured && (
              <Badge className="absolute left-3 top-3 bg-secondary text-secondary-foreground">{t('featured')}</Badge>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                    i === selectedImage ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="mt-1 flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" /> {location}
            </p>
          </div>

          <div className="text-3xl font-bold text-primary">
            {t('taka')} {land.price.toLocaleString()}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="flex items-center gap-2 p-3">
                <Ruler className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('area')}</p>
                  <p className="font-semibold text-foreground">{land.area_size} {t('decimal')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-2 p-3">
                <Route className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('roadWidth')}</p>
                  <p className="font-semibold text-foreground">{land.road_width} {t('feet')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            className="w-full"
            variant={isFavorited ? 'outline' : 'secondary'}
            onClick={() => toggleFavorite.mutate()}
          >
            <Heart className={`mr-1 h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
            {isFavorited ? t('removeFromFavorites') : t('addToFavorites')}
          </Button>

          {/* Owner Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('getOwnerInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isUnlocked ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Unlock className="h-4 w-4 text-primary" />
                    <Badge variant="secondary">{t('alreadyUnlocked')}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{land.owner_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{land.owner_phone}</span>
                  </div>
                  {land.owner_address && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{land.owner_address}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <Lock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-3 text-sm text-muted-foreground">{t('payToUnlock')}</p>
                  <Button onClick={handleUnlock} className="w-full">
                    {t('getOwnerInfo')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Description */}
      {description && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t('description')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-foreground">{description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LandDetail;
