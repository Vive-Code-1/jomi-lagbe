import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Heart, MapPin, Ruler, Route, ArrowLeft, Lock, Unlock, Phone, User, Calendar, DollarSign, Info, Map, Star, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Footer from '@/components/Footer';

const LandDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [senderNumber, setSenderNumber] = useState('');
  const [senderTxId, setSenderTxId] = useState('');

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

  // Get user's active unlock purchase
  const { data: activePurchase } = useQuery({
    queryKey: ['active-purchase', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from('unlock_purchases' as any)
        .select('*')
        .eq('user_id', user!.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data as any;
    },
  });

  // Get payment methods
  const { data: paymentMethods } = useQuery({
    queryKey: ['payment-methods-active'],
    queryFn: async () => {
      const { data } = await supabase.from('payment_methods').select('*').eq('is_active', true);
      return data || [];
    },
  });

  // Get unlock package
  const { data: unlockPackage } = useQuery({
    queryKey: ['unlock-package'],
    queryFn: async () => {
      const { data } = await supabase
        .from('unlock_packages' as any)
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();
      return data as any;
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

  // Direct unlock when user has active purchase with remaining unlocks
  const directUnlock = useMutation({
    mutationFn: async () => {
      if (!activePurchase || !user || !id) throw new Error('No active purchase');
      // Insert contact_unlocks
      const { error: unlockError } = await supabase.from('contact_unlocks').insert({
        user_id: user.id,
        land_id: id,
        purchase_id: activePurchase.id,
      } as any);
      if (unlockError) throw unlockError;
      // Increment used_unlocks via security definer function
      const { error: updateError } = await supabase.rpc('increment_used_unlocks', {
        p_purchase_id: activePurchase.id,
      });
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unlock', id, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['active-purchase', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['my-unlock-purchases'] });
      queryClient.invalidateQueries({ queryKey: ['my-unlocked-lands'] });
      toast.success(lang === 'bn' ? 'মালিকের তথ্য আনলক হয়েছে!' : 'Owner info unlocked!');
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Submit payment for new purchase
  const submitPayment = useMutation({
    mutationFn: async () => {
      if (!user || !unlockPackage || !selectedMethod) throw new Error('Missing data');
      if (!senderNumber.trim() || !senderTxId.trim()) {
        throw new Error(lang === 'bn' ? 'সেন্ডার নম্বর ও ট্রানজেকশন আইডি দিন' : 'Enter sender number and transaction ID');
      }
      const { error } = await supabase.from('unlock_purchases' as any).insert({
        user_id: user.id,
        package_id: unlockPackage.id,
        total_unlocks: unlockPackage.unlock_count,
        used_unlocks: 0,
        status: 'pending',
        payment_method_id: selectedMethod,
        sender_number: senderNumber.trim(),
        sender_transaction_id: senderTxId.trim(),
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      setPaymentDialogOpen(false);
      setSenderNumber('');
      setSenderTxId('');
      setSelectedMethod(null);
      queryClient.invalidateQueries({ queryKey: ['active-purchase', user?.id] });
      toast.success(
        lang === 'bn'
          ? 'পেমেন্ট সাবমিট হয়েছে! ভেরিফিকেশনের পর আনলক করতে পারবেন।'
          : 'Payment submitted! You can unlock after verification.'
      );
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleUnlock = () => {
    if (!user) { navigate('/auth?redirect=/land/' + id); return; }
    
    // Check if already has pending purchase
    // Check if has active purchase with remaining unlocks
    if (activePurchase && activePurchase.used_unlocks < activePurchase.total_unlocks) {
      directUnlock.mutate();
      return;
    }
    
    // Open payment dialog (show exhausted notice if applicable)
    setPaymentDialogOpen(true);
  };

  if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground font-body">{t('loading')}</div>;
  if (!land) return <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground font-body">{t('error')}</div>;

  const title = lang === 'bn' ? land.title_bn : land.title_en;
  const location = lang === 'bn' ? land.location_bn : land.location_en;
  const description = lang === 'bn' ? land.description_bn : land.description_en;
  const images = land.images || [];
  const pricePerDecimal = land.area_size > 0 ? Math.round(land.price / land.area_size) : 0;

  const remainingUnlocks = activePurchase ? activePurchase.total_unlocks - activePurchase.used_unlocks : 0;

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
                    <p className="text-sm font-medium text-foreground mb-1">{t('payToUnlock')}</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {lang === 'bn'
                        ? `মালিকের তথ্য আনলক ফি ৳${unlockPackage?.price || 499} টাকায় ${unlockPackage?.unlock_count || 10}টি জমির মালিকের নম্বর পাবেন`
                        : `Pay ৳${unlockPackage?.price || 499} to unlock ${unlockPackage?.unlock_count || 10} land owner contacts`}
                    </p>
                    {activePurchase && remainingUnlocks > 0 && (
                      <div className="mb-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                        <p className="text-xs text-primary font-medium mb-1">
                          {lang === 'bn'
                            ? `আপনার ${remainingUnlocks}টি আনলক বাকি আছে`
                            : `You have ${remainingUnlocks} unlocks remaining`}
                        </p>
                        <Progress value={(activePurchase.used_unlocks / activePurchase.total_unlocks) * 100} className="h-2" />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {activePurchase.used_unlocks}/{activePurchase.total_unlocks} {lang === 'bn' ? 'ব্যবহৃত' : 'used'}
                        </p>
                      </div>
                    )}
                    <Button 
                      onClick={handleUnlock} 
                      className="w-full rounded-xl h-12 text-base font-semibold"
                      disabled={directUnlock.isPending}
                    >
                      {directUnlock.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Unlock className="mr-2 h-4 w-4" />
                      )}
                      {activePurchase && remainingUnlocks > 0
                        ? (lang === 'bn' ? 'আনলক করুন' : 'Unlock Now')
                        : t('unlockOwnerNumber')}
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

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {lang === 'bn' ? 'মালিকের তথ্য আনলক প্যাকেজ' : 'Owner Info Unlock Package'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            {/* Exhausted notice */}
            {activePurchase && activePurchase.used_unlocks >= activePurchase.total_unlocks && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-center">
                <p className="text-sm font-medium text-destructive">
                  {lang === 'bn'
                    ? `আপনার ${activePurchase.total_unlocks}টি আনলক শেষ হয়েছে। আরো জমির মালিকের তথ্য দেখতে আবার প্যাকেজ ক্রয় করুন।`
                    : `Your ${activePurchase.total_unlocks} unlocks are used up. Purchase again to unlock more.`}
                </p>
              </div>
            )}

            {/* Package info */}
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-center">
              <p className="text-2xl font-bold text-primary">৳{unlockPackage?.price || 499}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {lang === 'bn'
                  ? `${unlockPackage?.unlock_count || 10}টি জমির মালিকের নম্বর পাবেন`
                  : `Unlock ${unlockPackage?.unlock_count || 10} land owner contacts`}
              </p>
            </div>

            {/* Payment methods */}
            <div>
              <Label className="mb-2 block">
                {lang === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Select Payment Method'}
              </Label>
              <div className="grid gap-3">
                {paymentMethods?.map((method: any) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{method.method_name}</p>
                      <p className="text-sm text-primary font-medium">{method.account_number}</p>
                      <p className="text-xs text-muted-foreground capitalize">{method.payment_type}</p>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === method.id ? 'border-primary' : 'border-muted-foreground/30'
                    }`}>
                      {selectedMethod === method.id && (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedMethod && (
              <div className="space-y-3">
                <div>
                  <Label>{lang === 'bn' ? 'সেন্ডার নম্বর' : 'Sender Number'}</Label>
                  <Input
                    placeholder={lang === 'bn' ? 'আপনার নম্বর লিখুন' : 'Enter your number'}
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label>{lang === 'bn' ? 'ট্রানজেকশন আইডি' : 'Transaction ID'}</Label>
                  <Input
                    placeholder={lang === 'bn' ? 'ট্রানজেকশন আইডি লিখুন' : 'Enter transaction ID'}
                    value={senderTxId}
                    onChange={(e) => setSenderTxId(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Button
              onClick={() => submitPayment.mutate()}
              disabled={!selectedMethod || !senderNumber.trim() || !senderTxId.trim() || submitPayment.isPending}
              className="w-full h-12 rounded-xl text-base font-semibold"
            >
              {submitPayment.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {lang === 'bn' ? 'পেমেন্ট সাবমিট করুন' : 'Submit Payment'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
