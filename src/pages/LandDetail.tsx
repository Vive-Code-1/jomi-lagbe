import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Heart, MapPin, Ruler, Route, ArrowLeft, Lock, Unlock, Phone, User, Calendar, DollarSign, Info, Map, Star, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import Footer from '@/components/Footer';

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
    toast.info(lang === 'bn' ? 'পেমেন্ট সিস্টেম শীঘ্রই আসছে' : 'Payment system coming soon');
  };

  if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground font-body">{t('loading')}</div>;
  if (!land) return <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground font-body">{t('error')}</div>;

  const title = lang === 'bn' ? land.title_bn : land.title_en;
  const location = lang === 'bn' ? land.location_bn : land.location_en;
  const description = lang === 'bn' ? land.description_bn : land.description_en;
  const images = land.images || [];
  const pricePerDecimal = land.area_size > 0 ? Math.round(land.price / land.area_size) : 0;

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Back button */}
      <div className="container mx-auto px-4 pt-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> {t('back')}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT COLUMN — Image + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border shadow-lg">
              <img
                src={images[selectedImage] || '/placeholder.svg'}
                alt={title}
                className="h-full w-full object-cover"
              />
              {land.is_featured && (
                <Badge className="absolute left-4 top-4 bg-secondary text-secondary-foreground font-semibold px-3 py-1 shadow-md">
                  <Star className="mr-1 h-3 w-3" /> {t('featured')}
                </Badge>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-4 top-4 bg-background/70 backdrop-blur-sm hover:bg-background/90 rounded-full h-10 w-10"
                onClick={() => toggleFavorite.mutate()}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
              </Button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      i === selectedImage ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Location */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground font-heading">{title}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" /> {location}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl md:text-4xl font-bold text-primary">{t('taka')} {land.price.toLocaleString()}</span>
              {pricePerDecimal > 0 && (
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {t('taka')} {pricePerDecimal.toLocaleString()} / {t('decimal')}
                </span>
              )}
            </div>

            {/* Property Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard icon={<Ruler className="h-5 w-5 text-primary" />} label={t('area')} value={`${land.area_size} ${t('decimal')}`} />
              <InfoCard icon={<Route className="h-5 w-5 text-primary" />} label={t('roadWidth')} value={`${land.road_width} ${t('feet')}`} />
              <InfoCard icon={<DollarSign className="h-5 w-5 text-primary" />} label={t('pricePerDecimal')} value={`${t('taka')} ${pricePerDecimal.toLocaleString()}`} />
              <InfoCard icon={<Info className="h-5 w-5 text-primary" />} label={t('status')} value={land.status === 'active' ? t('active') : t('sold')} />
            </div>

            {/* Description */}
            {description && (
              <div className="rounded-2xl bg-muted/50 border border-border p-6">
                <h2 className="text-lg font-bold text-foreground mb-3 font-heading">{t('description')}</h2>
                <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Map placeholder */}
            <div className="rounded-2xl bg-muted/30 border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-3 font-heading flex items-center gap-2">
                <Map className="h-5 w-5 text-primary" /> {t('mapLocation')}
              </h2>
              <div className="aspect-[16/7] rounded-xl bg-surface-container flex items-center justify-center text-muted-foreground">
                <MapPin className="h-8 w-8 mr-2 opacity-40" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Owner Info & Tips */}
          <div className="space-y-6">
            {/* Owner Info Card */}
            <div className="rounded-2xl border-2 border-primary/30 bg-card shadow-lg overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b border-primary/20">
                <h3 className="font-bold text-foreground font-heading text-lg">{t('getOwnerInfo')}</h3>
              </div>
              <div className="p-6">
                {isUnlocked ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Unlock className="h-4 w-4 text-primary" />
                      <Badge className="bg-primary/10 text-primary border-primary/20">{t('alreadyUnlocked')}</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t('ownerName')}</p>
                          <p className="font-semibold text-foreground">{land.owner_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t('ownerPhone')}</p>
                          <p className="font-semibold text-foreground">{land.owner_phone}</p>
                        </div>
                      </div>
                      {land.owner_address && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">{t('ownerAddress')}</p>
                            <p className="font-semibold text-foreground">{land.owner_address}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{t('payToUnlock')}</p>
                    <p className="text-xs text-muted-foreground mb-5">{t('contactUnlockFee')}</p>
                    <Button onClick={handleUnlock} className="w-full rounded-xl h-12 text-base font-semibold">
                      <Unlock className="mr-2 h-4 w-4" /> {t('unlockOwnerNumber')}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Favorite button */}
            <Button
              className="w-full rounded-xl h-12 text-base"
              variant={isFavorited ? 'outline' : 'secondary'}
              onClick={() => toggleFavorite.mutate()}
            >
              <Heart className={`mr-2 h-5 w-5 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
              {isFavorited ? t('removeFromFavorites') : t('addToFavorites')}
            </Button>

            {/* Tips Card */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-bold text-foreground font-heading flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                {t('safetyTips')}
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">১.</span>
                  {t('tip1')}
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">২.</span>
                  {t('tip2')}
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">৩.</span>
                  {t('tip3')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

/* Small info card component */
const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
    <div className="mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground text-sm">{value}</p>
    </div>
  </div>
);

export default LandDetail;
