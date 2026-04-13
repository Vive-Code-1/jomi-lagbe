import { Navigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { MapPin, CreditCard, Loader2, Clock, CheckCircle, XCircle, Unlock, Phone, User } from 'lucide-react';
import Footer from '@/components/Footer';

const statusConfig: Record<string, { label_bn: string; label_en: string; color: string; icon: any }> = {
  pending: { label_bn: 'পেন্ডিং', label_en: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  active: { label_bn: 'ভেরিফাইড', label_en: 'Verified', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { label_bn: 'প্রত্যাখ্যাত', label_en: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
  inactive: { label_bn: 'নিষ্ক্রিয়', label_en: 'Inactive', color: 'bg-muted text-muted-foreground', icon: XCircle },
};

const paymentStatusConfig: Record<string, { label_bn: string; label_en: string; color: string }> = {
  pending: { label_bn: 'পেন্ডিং', label_en: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  completed: { label_bn: 'সম্পন্ন', label_en: 'Completed', color: 'bg-green-100 text-green-800' },
  failed: { label_bn: 'ব্যর্থ', label_en: 'Failed', color: 'bg-red-100 text-red-800' },
};

const unlockStatusConfig: Record<string, { label_bn: string; label_en: string; color: string; icon: any }> = {
  pending: { label_bn: 'পেন্ডিং', label_en: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  active: { label_bn: 'সক্রিয়', label_en: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { label_bn: 'প্রত্যাখ্যাত', label_en: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
  expired: { label_bn: 'মেয়াদোত্তীর্ণ', label_en: 'Expired', color: 'bg-muted text-muted-foreground', icon: XCircle },
};

const UserDashboard = () => {
  const { lang } = useI18n();
  const { user, loading: authLoading } = useAuth();

  const { data: myLands, isLoading: landsLoading } = useQuery({
    queryKey: ['my-lands', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lands')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: myPayments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['my-payments', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Unlock purchases
  const { data: myPurchases, isLoading: purchasesLoading } = useQuery({
    queryKey: ['my-unlock-purchases', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unlock_purchases' as any)
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  // Unlocked lands
  const { data: unlockedLands, isLoading: unlockedLoading } = useQuery({
    queryKey: ['my-unlocked-lands', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_unlocks')
        .select('*, lands(*)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth?redirect=/dashboard" />;

  // Calculate totals — use contact_unlocks count as the real used count (more reliable)
  const realUsedCount = unlockedLands?.length || 0;
  const totalAvailable = myPurchases?.filter((p: any) => p.status === 'active').reduce((s: number, p: any) => s + (p.total_unlocks || 0), 0) || 0;
  const totalUsed = Math.max(
    realUsedCount,
    myPurchases?.filter((p: any) => p.status === 'active').reduce((s: number, p: any) => s + (p.used_unlocks || 0), 0) || 0
  );
  const isExhausted = totalAvailable > 0 && totalUsed >= totalAvailable;

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">
          {lang === 'bn' ? 'আমার ড্যাশবোর্ড' : 'My Dashboard'}
        </h1>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="listings" className="gap-2">
              <MapPin className="h-4 w-4" />
              {lang === 'bn' ? 'আমার বিজ্ঞাপন' : 'My Listings'}
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="h-4 w-4" />
              {lang === 'bn' ? 'পেমেন্ট' : 'Payments'}
            </TabsTrigger>
            <TabsTrigger value="unlocks" className="gap-2">
              <Unlock className="h-4 w-4" />
              {lang === 'bn' ? 'আনলক তথ্য' : 'Unlocked'}
            </TabsTrigger>
          </TabsList>

          {/* Listings Tab */}
          <TabsContent value="listings">
            {landsLoading ? (
              <div className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /></div>
            ) : myLands && myLands.length > 0 ? (
              <div className="space-y-4">
                {myLands.map((land: any) => {
                  const st = statusConfig[land.status] || statusConfig.pending;
                  const Icon = st.icon;
                  return (
                    <Card key={land.id} className="border-none shadow-sm">
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="w-full sm:w-24 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {land.images?.[0] ? (
                              <img src={land.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <MapPin className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-foreground truncate">
                                {lang === 'bn' ? land.title_bn : land.title_en}
                              </h3>
                              <Badge className={`${st.color} border-0 shrink-0 gap-1`}>
                                <Icon className="h-3 w-3" />
                                {lang === 'bn' ? st.label_bn : st.label_en}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {lang === 'bn' ? land.location_bn : land.location_en}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="font-bold text-primary">৳{land.price?.toLocaleString()}</span>
                              <span className="text-muted-foreground">{land.area_size} {lang === 'bn' ? 'শতক' : 'decimal'}</span>
                              <span className="text-muted-foreground text-xs">
                                {new Date(land.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-none shadow-sm">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <MapPin className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>{lang === 'bn' ? 'আপনার কোনো বিজ্ঞাপন নেই' : 'You have no listings yet'}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            {paymentsLoading ? (
              <div className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /></div>
            ) : myPayments && myPayments.length > 0 ? (
              <div className="space-y-3">
                {myPayments.map((p: any) => {
                  const ps = paymentStatusConfig[p.status] || paymentStatusConfig.pending;
                  return (
                    <Card key={p.id} className="border-none shadow-sm">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{p.payment_type}</p>
                          <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                          {p.transaction_id && (
                            <p className="text-xs text-muted-foreground mt-0.5">TxID: {p.transaction_id}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">৳{p.amount?.toLocaleString()}</p>
                          <Badge className={`${ps.color} border-0 mt-1`}>
                            {lang === 'bn' ? ps.label_bn : ps.label_en}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-none shadow-sm">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>{lang === 'bn' ? 'কোনো পেমেন্ট নেই' : 'No payments yet'}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Unlocks Tab */}
          <TabsContent value="unlocks">
            {purchasesLoading || unlockedLoading ? (
              <div className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /></div>
            ) : (
              <div className="space-y-6">
                {/* Summary card */}
                {totalAvailable > 0 && (
                  <Card className="border-none shadow-sm border-l-4 border-l-primary">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground">
                          {lang === 'bn' ? 'আনলক সারসংক্ষেপ' : 'Unlock Summary'}
                        </h3>
                        <Badge className={`${isExhausted ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'} border-0`}>
                          {Math.max(0, totalAvailable - totalUsed)} {lang === 'bn' ? 'টি বাকি' : 'remaining'}
                        </Badge>
                      </div>
                      <Progress value={Math.min((totalUsed / totalAvailable) * 100, 100)} className="h-3 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        {totalUsed}/{totalAvailable} {lang === 'bn' ? 'ব্যবহৃত' : 'used'}
                      </p>
                      {isExhausted && (
                        <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          <p className="text-sm text-destructive font-medium">
                            {lang === 'bn'
                              ? 'আপনার সব আনলক শেষ হয়েছে। আরো জমির মালিকের তথ্য দেখতে আবার প্যাকেজ ক্রয় করুন।'
                              : 'All unlocks used. Purchase a new package to unlock more owner contacts.'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Purchase history */}
                {myPurchases && myPurchases.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      {lang === 'bn' ? 'প্যাকেজ ক্রয়ের ইতিহাস' : 'Purchase History'}
                    </h3>
                    <div className="space-y-3">
                      {myPurchases.map((purchase: any) => {
                        const us = unlockStatusConfig[purchase.status] || unlockStatusConfig.pending;
                        const UsIcon = us.icon;
                        return (
                          <Card key={purchase.id} className="border-none shadow-sm">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-foreground">
                                    {lang === 'bn' ? 'মালিকের তথ্য প্যাকেজ' : 'Owner Info Package'}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {new Date(purchase.created_at).toLocaleDateString()}
                                  </p>
                                  {purchase.status === 'active' && (
                                    <p className="text-xs text-primary mt-1">
                                      {purchase.used_unlocks}/{purchase.total_unlocks} {lang === 'bn' ? 'ব্যবহৃত' : 'used'}
                                    </p>
                                  )}
                                </div>
                                <Badge className={`${us.color} border-0 gap-1`}>
                                  <UsIcon className="h-3 w-3" />
                                  {lang === 'bn' ? us.label_bn : us.label_en}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Unlocked lands */}
                {unlockedLands && unlockedLands.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      {lang === 'bn' ? 'আনলক করা জমির তালিকা' : 'Unlocked Land Contacts'}
                    </h3>
                    <div className="space-y-3">
                      {unlockedLands.map((item: any) => {
                        const land = item.lands;
                        if (!land) return null;
                        return (
                          <Card key={item.id} className="border-none shadow-sm">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-foreground mb-2">
                                {lang === 'bn' ? land.title_bn : land.title_en}
                              </h4>
                              <p className="text-xs text-muted-foreground mb-3">
                                {lang === 'bn' ? land.location_bn : land.location_en}
                              </p>
                              <div className="grid gap-2">
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                  <User className="h-4 w-4 text-primary" />
                                  <span className="text-sm text-foreground">{land.owner_name}</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                  <Phone className="h-4 w-4 text-primary" />
                                  <span className="text-sm text-foreground">{land.owner_phone}</span>
                                </div>
                                {land.owner_address && (
                                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-foreground">{land.owner_address}</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-2">
                                {lang === 'bn' ? 'আনলক তারিখ:' : 'Unlocked:'} {new Date(item.created_at).toLocaleDateString()}
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ) : !myPurchases?.length ? (
                  <Card className="border-none shadow-sm">
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <Unlock className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p>{lang === 'bn' ? 'কোনো আনলক তথ্য নেই' : 'No unlocked info yet'}</p>
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
