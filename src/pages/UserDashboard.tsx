import { Navigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, CreditCard, Loader2, Clock, CheckCircle, XCircle } from 'lucide-react';
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth?redirect=/dashboard" />;

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">
          {lang === 'bn' ? 'আমার ড্যাশবোর্ড' : 'My Dashboard'}
        </h1>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="listings" className="gap-2">
              <MapPin className="h-4 w-4" />
              {lang === 'bn' ? 'আমার বিজ্ঞাপন' : 'My Listings'}
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="h-4 w-4" />
              {lang === 'bn' ? 'পেমেন্ট' : 'Payments'}
            </TabsTrigger>
          </TabsList>

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
                          {/* Thumbnail */}
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
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
