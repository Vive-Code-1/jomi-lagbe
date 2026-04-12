import { useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  LayoutDashboard, MapPin, CreditCard, Package, Users, LogOut,
  Plus, Pencil, Trash2, DollarSign, TrendingUp, Eye, Search, Menu, X,
  ChevronRight, Star, Globe, UserCircle, MessageSquare, Camera, Lock, Wallet
} from 'lucide-react';

type Section = 'dashboard' | 'listings' | 'payments' | 'packages' | 'users' | 'reviews' | 'profile' | 'payment-methods' | 'contacts';

const emptyLand = {
  title_bn: '', title_en: '', description_bn: '', description_en: '',
  price: 0, area_size: 0, location_bn: '', location_en: '',
  road_width: 0, owner_name: '', owner_phone: '', owner_address: '',
  images: [] as string[], is_featured: false, status: 'active',
};

const emptyPackage = {
  name_bn: '', name_en: '', price: 0, duration: 7, is_featured: false,
};

const emptyReview = {
  reviewer_name: '', rating: 5, comment: '', status: 'published',
};

const Admin = () => {
  const { t, lang, setLang } = useI18n();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: sidebarProfile } = useQuery({
    queryKey: ['sidebar-profile', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('full_name, avatar_url').eq('user_id', user!.id).maybeSingle();
      return data;
    },
  });

  if (!authLoading && (!user || !isAdmin)) return <Navigate to="/" />;

  const menuItems = [
    { id: 'dashboard' as Section, icon: LayoutDashboard, label: lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard', desc: lang === 'bn' ? 'সামগ্রিক পরিসংখ্যান' : 'Overview & stats' },
    { id: 'listings' as Section, icon: MapPin, label: lang === 'bn' ? 'লিস্টিং' : 'Listings', desc: lang === 'bn' ? 'জমি ম্যানেজ করুন' : 'Manage properties' },
    { id: 'payments' as Section, icon: CreditCard, label: lang === 'bn' ? 'পেমেন্ট' : 'Payments', desc: lang === 'bn' ? 'লেনদেনের ইতিহাস' : 'Transaction history' },
    { id: 'packages' as Section, icon: Package, label: lang === 'bn' ? 'এড প্যাকেজ' : 'Ad Packages', desc: lang === 'bn' ? 'প্যাকেজ ম্যানেজ করুন' : 'Manage packages' },
    { id: 'users' as Section, icon: Users, label: lang === 'bn' ? 'ইউজার' : 'Users', desc: lang === 'bn' ? 'ইউজার ম্যানেজমেন্ট' : 'User management' },
    { id: 'reviews' as Section, icon: MessageSquare, label: lang === 'bn' ? 'রিভিউ' : 'Reviews', desc: lang === 'bn' ? 'রিভিউ ম্যানেজমেন্ট' : 'Manage reviews' },
    { id: 'payment-methods' as Section, icon: Wallet, label: lang === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Methods', desc: lang === 'bn' ? 'বিকাশ/নগদ সেটিং' : 'bKash/Nagad settings' },
    { id: 'contacts' as Section, icon: MessageSquare, label: lang === 'bn' ? 'যোগাযোগ বার্তা' : 'Contact Messages', desc: lang === 'bn' ? 'ফর্ম থেকে প্রাপ্ত বার্তা' : 'Messages from contact form' },
    { id: 'profile' as Section, icon: UserCircle, label: lang === 'bn' ? 'প্রোফাইল' : 'Profile', desc: lang === 'bn' ? 'প্রোফাইল ও সিকিউরিটি' : 'Profile & security' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-white transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <div>
            <h1 className="font-serif text-xl font-bold text-white">জমি লাগবে</h1>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Admin Portal</p>
          </div>
          <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); setSidebarOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                section === item.id
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
              {section === item.id && <ChevronRight className="ml-auto h-4 w-4" />}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 px-3 py-4 space-y-2">
          {/* Admin profile in sidebar */}
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
              {sidebarProfile?.avatar_url ? (
                <img src={sidebarProfile.avatar_url} alt="Admin" className="h-full w-full object-cover" />
              ) : (
                <UserCircle className="h-5 w-5 text-white/70" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{sidebarProfile?.full_name || user?.email?.split('@')[0] || 'Admin'}</p>
              <p className="text-[11px] text-white/40 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/50 hover:bg-white/10 hover:text-white transition-all">
            <Eye className="h-[18px] w-[18px]" />
            {lang === 'bn' ? 'সাইট দেখুন' : 'View Site'}
          </button>
          <button onClick={() => signOut()} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-300/80 hover:bg-red-500/10 hover:text-red-300 transition-all">
            <LogOut className="h-[18px] w-[18px]" />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 border-b border-border bg-card px-6 py-4">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">
              {menuItems.find(m => m.id === section)?.label}
            </h2>
            <p className="text-xs text-muted-foreground">{menuItems.find(m => m.id === section)?.desc}</p>
          </div>
          {/* Language switcher */}
          <Button variant="outline" size="sm" onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')} className="gap-1.5">
            <Globe className="h-4 w-4" />
            {lang === 'bn' ? 'EN' : 'বাং'}
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {section === 'dashboard' && <DashboardSection />}
          {section === 'listings' && <ListingsSection />}
          {section === 'payments' && <PaymentsSection />}
          {section === 'packages' && <PackagesSection />}
          {section === 'users' && <UsersSection />}
          {section === 'reviews' && <ReviewsSection />}
          {section === 'payment-methods' && <PaymentMethodsSection />}
          {section === 'contacts' && <ContactMessagesSection />}
          {section === 'profile' && <ProfileSection />}
        </main>
      </div>
    </div>
  );
};

/* ─── Dashboard ─── */
const DashboardSection = () => {
  const { lang } = useI18n();
  const { user, isAdmin } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const [landsRes, paymentsRes, profilesRes, earningsRes] = await Promise.all([
        supabase.from('lands').select('id', { count: 'exact', head: true }),
        supabase.from('payments').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('payments').select('amount').eq('status', 'completed'),
      ]);
      const totalEarnings = earningsRes.data?.reduce((s, p) => s + (p.amount || 0), 0) || 0;
      return { totalLands: landsRes.count || 0, totalPayments: paymentsRes.count || 0, totalUsers: profilesRes.count || 0, totalEarnings };
    },
  });

  const { data: recentLands } = useQuery({
    queryKey: ['admin-recent-lands'],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data } = await supabase.from('lands').select('*').order('created_at', { ascending: false }).limit(5);
      return data || [];
    },
  });

  const statCards = [
    { label: lang === 'bn' ? 'মোট লিস্টিং' : 'Total Listings', value: stats?.totalLands || 0, icon: MapPin, color: 'text-primary' },
    { label: lang === 'bn' ? 'সক্রিয় বিজ্ঞাপন' : 'Active Ads', value: stats?.totalPayments || 0, icon: TrendingUp, color: 'text-accent' },
    { label: lang === 'bn' ? 'মোট আয়' : 'Total Earnings', value: `৳${(stats?.totalEarnings || 0).toLocaleString()}`, icon: DollarSign, color: 'text-secondary' },
    { label: lang === 'bn' ? 'মোট ইউজার' : 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-primary' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <Card key={i} className="border-none bg-card shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none bg-card shadow-sm">
        <CardContent className="p-0">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">{lang === 'bn' ? 'সাম্প্রতিক লিস্টিং' : 'Recent Listings'}</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{lang === 'bn' ? 'শিরোনাম' : 'Title'}</TableHead>
                <TableHead>{lang === 'bn' ? 'লোকেশন' : 'Location'}</TableHead>
                <TableHead>{lang === 'bn' ? 'দাম' : 'Price'}</TableHead>
                <TableHead>{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLands && recentLands.length > 0 ? recentLands.map((land: any) => (
                <TableRow key={land.id}>
                  <TableCell className="font-medium">{lang === 'bn' ? land.title_bn : land.title_en}</TableCell>
                  <TableCell className="text-muted-foreground">{lang === 'bn' ? land.location_bn : land.location_en}</TableCell>
                  <TableCell>৳{land.price?.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${land.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {land.status}
                    </span>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    {lang === 'bn' ? 'কোনো লিস্টিং পাওয়া যায়নি' : 'No listings found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

/* ─── Listings ─── */
const ListingsSection = () => {
  const { t, lang } = useI18n();
  const queryClient = useQueryClient();
  const [landForm, setLandForm] = useState(emptyLand);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [search, setSearch] = useState('');
  const { user, isAdmin } = useAuth();

  const { data: lands } = useQuery({
    queryKey: ['admin-lands'],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from('lands').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = lands?.filter((l: any) => {
    const q = search.toLowerCase();
    return !q || l.title_bn?.toLowerCase().includes(q) || l.title_en?.toLowerCase().includes(q) || l.location_bn?.toLowerCase().includes(q) || l.location_en?.toLowerCase().includes(q);
  });

  const saveLand = useMutation({
    mutationFn: async () => {
      if (!landForm.title_bn.trim() || !landForm.title_en.trim()) {
        throw new Error(lang === 'bn' ? 'বাংলা ও ইংরেজি শিরোনাম দিন' : 'Title (BN & EN) is required');
      }
      if (editingId) {
        const { error } = await supabase.from('lands').update(landForm).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('lands').insert({
          ...landForm,
          user_id: user?.id,
          land_type: 'residential',
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lands'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setDialogOpen(false); setLandForm(emptyLand); setEditingId(null);
      toast.success(lang === 'bn' ? 'সফলভাবে সেভ হয়েছে' : 'Saved successfully');
    },
    onError: (err: any) => toast.error(lang === 'bn' ? `ত্রুটি: ${err.message}` : `Error: ${err.message}`),
  });

  const deleteLand = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('lands').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-lands'] }); toast.success(t('success')); },
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase.from('lands').update({ is_featured: featured }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-lands'] }),
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('lands').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-lands'] }),
  });

  const addImage = () => {
    if (imageUrl.trim()) { setLandForm({ ...landForm, images: [...landForm.images, imageUrl.trim()] }); setImageUrl(''); }
  };
  const removeImage = (idx: number) => { setLandForm({ ...landForm, images: landForm.images.filter((_, i) => i !== idx) }); };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={lang === 'bn' ? 'লিস্টিং খুঁজুন...' : 'Search listings...'} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setLandForm(emptyLand); setEditingId(null); }}>
              <Plus className="mr-1 h-4 w-4" /> {t('addLand')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader><DialogTitle>{editingId ? t('editLand') : t('addLand')}</DialogTitle></DialogHeader>
            <LandForm form={landForm} setForm={setLandForm} imageUrl={imageUrl} setImageUrl={setImageUrl} addImage={addImage} removeImage={removeImage} onSave={() => saveLand.mutate()} saving={saveLand.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none bg-card shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('title')}</TableHead>
                <TableHead>{t('location')}</TableHead>
                <TableHead>{t('price')}</TableHead>
                <TableHead>{t('featured')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered && filtered.length > 0 ? filtered.map((land: any) => (
                <TableRow key={land.id}>
                  <TableCell className="font-medium">{lang === 'bn' ? land.title_bn : land.title_en}</TableCell>
                  <TableCell className="text-muted-foreground">{lang === 'bn' ? land.location_bn : land.location_en}</TableCell>
                  <TableCell>৳{land.price?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Switch checked={land.is_featured} onCheckedChange={(c) => toggleFeatured.mutate({ id: land.id, featured: c })} />
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleStatus.mutate({ id: land.id, status: land.status === 'active' ? 'pending' : land.status === 'pending' ? 'rejected' : 'active' })} className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer ${
                      land.status === 'active' ? 'bg-green-100 text-green-800' : 
                      land.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      land.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {land.status === 'active' ? (lang === 'bn' ? 'ভেরিফাইড' : 'Verified') : 
                       land.status === 'pending' ? (lang === 'bn' ? 'পেন্ডিং' : 'Pending') :
                       land.status === 'rejected' ? (lang === 'bn' ? 'প্রত্যাখ্যাত' : 'Rejected') : land.status}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setLandForm(land); setEditingId(land.id); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteLand.mutate(land.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">{lang === 'bn' ? 'কোনো লিস্টিং পাওয়া যায়নি' : 'No listings found'}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

/* ─── Land Form ─── */
const LandForm = ({ form, setForm, imageUrl, setImageUrl, addImage, removeImage, onSave, saving }: any) => {
  const { t } = useI18n();
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>{t('titleBn')}</Label><Input value={form.title_bn} onChange={(e) => setForm({ ...form, title_bn: e.target.value })} /></div>
        <div><Label>{t('titleEn')}</Label><Input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>{t('descriptionBn')}</Label><Textarea value={form.description_bn} onChange={(e) => setForm({ ...form, description_bn: e.target.value })} /></div>
        <div><Label>{t('descriptionEn')}</Label><Textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label>{t('price')} (৳)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
        <div><Label>{t('area')} ({t('decimal')})</Label><Input type="number" value={form.area_size} onChange={(e) => setForm({ ...form, area_size: Number(e.target.value) })} /></div>
        <div><Label>{t('roadWidth')} ({t('feet')})</Label><Input type="number" value={form.road_width} onChange={(e) => setForm({ ...form, road_width: Number(e.target.value) })} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>{t('location')} (বাংলা)</Label><Input value={form.location_bn} onChange={(e) => setForm({ ...form, location_bn: e.target.value })} /></div>
        <div><Label>{t('location')} (English)</Label><Input value={form.location_en} onChange={(e) => setForm({ ...form, location_en: e.target.value })} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label>{t('ownerName')}</Label><Input value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} /></div>
        <div><Label>{t('ownerPhone')}</Label><Input value={form.owner_phone} onChange={(e) => setForm({ ...form, owner_phone: e.target.value })} /></div>
        <div><Label>{t('ownerAddress')}</Label><Input value={form.owner_address} onChange={(e) => setForm({ ...form, owner_address: e.target.value })} /></div>
      </div>
      <div>
        <Label>{t('images')} (URL)</Label>
        <div className="flex gap-2">
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          <Button type="button" variant="outline" onClick={addImage}>+</Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {form.images?.map((img: string, i: number) => (
            <div key={i} className="relative h-16 w-20 overflow-hidden rounded-lg border border-border">
              <img src={img} alt="" className="h-full w-full object-cover" />
              <button onClick={() => removeImage(i)} className="absolute right-0 top-0 rounded-bl bg-destructive px-1 text-xs text-destructive-foreground">×</button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={form.is_featured} onCheckedChange={(c) => setForm({ ...form, is_featured: c })} />
        <Label>{t('featured')}</Label>
      </div>
      <Button onClick={onSave} disabled={saving}>{saving ? t('loading') : t('save')}</Button>
    </div>
  );
};

/* ─── Payments ─── */
const PaymentsSection = () => {
  const { lang } = useI18n();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: payments } = useQuery({
    queryKey: ['admin-payments'],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('payments').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success(lang === 'bn' ? 'স্ট্যাটাস আপডেট হয়েছে' : 'Status updated');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const filtered = payments?.filter((p: any) => filter === 'all' || p.status === filter);

  const statusOptions = ['pending', 'completed', 'failed'];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['all', 'pending', 'completed', 'failed'].map(s => (
          <Button key={s} variant={filter === s ? 'default' : 'outline'} size="sm" onClick={() => setFilter(s)}>
            {s === 'all' ? (lang === 'bn' ? 'সব' : 'All') : s}
          </Button>
        ))}
      </div>
      <Card className="border-none bg-card shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>{lang === 'bn' ? 'পরিমাণ' : 'Amount'}</TableHead>
                <TableHead>{lang === 'bn' ? 'প্রেরকের নাম্বার' : 'Sender'}</TableHead>
                <TableHead>{lang === 'bn' ? 'TxID' : 'TxID'}</TableHead>
                <TableHead>{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                <TableHead>{lang === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered && filtered.length > 0 ? filtered.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.id.slice(0, 8)}</TableCell>
                  <TableCell>{p.payment_type}</TableCell>
                  <TableCell className="font-medium">৳{p.amount?.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{(p as any).sender_number || '-'}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{(p as any).sender_transaction_id || '-'}</TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === 'completed' ? 'bg-primary/10 text-primary' :
                      p.status === 'pending' ? 'bg-accent/20 text-accent-foreground' :
                      'bg-destructive/10 text-destructive'
                    }`}>{p.status}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <select
                      value={p.status}
                      onChange={(e) => updateStatus.mutate({ id: p.id, status: e.target.value })}
                      className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
                    >
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">{lang === 'bn' ? 'কোনো পেমেন্ট পাওয়া যায়নি' : 'No payments found'}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

/* ─── Packages ─── */
const PackagesSection = () => {
  const { t, lang } = useI18n();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyPackage);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  const { data: packages } = useQuery({
    queryKey: ['admin-packages'],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from('ad_packages').select('*').order('price');
      if (error) throw error;
      return data;
    },
  });

  const savePackage = useMutation({
    mutationFn: async () => {
      if (!form.name_bn.trim() || !form.name_en.trim()) {
        throw new Error(lang === 'bn' ? 'বাংলা ও ইংরেজি নাম দিন' : 'Name (BN & EN) is required');
      }
      if (editingId) {
        const { error } = await supabase.from('ad_packages').update(form).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('ad_packages').insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
      setDialogOpen(false); setForm(emptyPackage); setEditingId(null);
      toast.success(lang === 'bn' ? 'সফলভাবে সেভ হয়েছে' : 'Saved successfully');
    },
    onError: (err: any) => toast.error(lang === 'bn' ? `ত্রুটি: ${err.message}` : `Error: ${err.message}`),
  });

  const deletePackage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('ad_packages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-packages'] }); toast.success(t('success')); },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setForm(emptyPackage); setEditingId(null); }}>
              <Plus className="mr-1 h-4 w-4" /> {lang === 'bn' ? 'প্যাকেজ যোগ' : 'Add Package'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? (lang === 'bn' ? 'প্যাকেজ এডিট' : 'Edit Package') : (lang === 'bn' ? 'নতুন প্যাকেজ' : 'New Package')}</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>{lang === 'bn' ? 'নাম (বাংলা)' : 'Name (BN)'}</Label><Input value={form.name_bn} onChange={(e) => setForm({ ...form, name_bn: e.target.value })} /></div>
                <div><Label>{lang === 'bn' ? 'নাম (ইংরেজি)' : 'Name (EN)'}</Label><Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>{t('price')} (৳)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
                <div><Label>{t('duration')}</Label><Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_featured} onCheckedChange={(c) => setForm({ ...form, is_featured: c })} />
                <Label>{t('featured')}</Label>
              </div>
              <Button onClick={() => savePackage.mutate()} disabled={savePackage.isPending}>{savePackage.isPending ? t('loading') : t('save')}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {packages?.map((pkg: any) => (
          <Card key={pkg.id} className={`relative border-none shadow-sm ${pkg.is_featured ? 'ring-2 ring-accent' : 'bg-card'}`}>
            {pkg.is_featured && (
              <div className="absolute -top-2 right-4 flex items-center gap-1 rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-accent-foreground">
                <Star className="h-3 w-3" /> Featured
              </div>
            )}
            <CardContent className="p-5 space-y-3">
              <h3 className="text-lg font-bold text-foreground">{lang === 'bn' ? pkg.name_bn : pkg.name_en}</h3>
              <p className="text-3xl font-bold text-primary">৳{pkg.price.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{pkg.duration} {t('days')}</p>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => { setForm(pkg); setEditingId(pkg.id); setDialogOpen(true); }}>
                  <Pencil className="mr-1 h-3 w-3" /> {lang === 'bn' ? 'এডিট' : 'Edit'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => deletePackage.mutate(pkg.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-1 h-3 w-3" /> {lang === 'bn' ? 'মুছুন' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* ─── Users ─── */
const UsersSection = () => {
  const { lang } = useI18n();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const { data: profiles } = useQuery({
    queryKey: ['admin-profiles'],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: roles } = useQuery({
    queryKey: ['admin-roles'],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from('user_roles').select('*');
      if (error) throw error;
      return data;
    },
  });

  const toggleAdmin = useMutation({
    mutationFn: async ({ userId, currentlyAdmin }: { userId: string; currentlyAdmin: boolean }) => {
      if (currentlyAdmin) {
        const { error } = await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', 'admin');
        if (error) throw error;
      } else {
        const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      toast.success(lang === 'bn' ? 'রোল আপডেট হয়েছে' : 'Role updated');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const isUserAdmin = (userId: string) => roles?.some((r: any) => r.user_id === userId && r.role === 'admin');

  return (
    <Card className="border-none bg-card shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{lang === 'bn' ? 'নাম' : 'Name'}</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>{lang === 'bn' ? 'যোগদান' : 'Joined'}</TableHead>
              <TableHead>{lang === 'bn' ? 'অ্যাডমিন' : 'Admin'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles && profiles.length > 0 ? profiles.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.full_name || '-'}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{p.user_id.slice(0, 8)}...</TableCell>
                <TableCell className="text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Switch checked={!!isUserAdmin(p.user_id)} onCheckedChange={() => toggleAdmin.mutate({ userId: p.user_id, currentlyAdmin: !!isUserAdmin(p.user_id) })} />
                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">{lang === 'bn' ? 'কোনো ইউজার পাওয়া যায়নি' : 'No users found'}</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

/* ─── Reviews ─── */
const ReviewsSection = () => {
  const { lang } = useI18n();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [editForm, setEditForm] = useState(emptyReview);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: reviews } = useQuery({
    queryKey: ['admin-reviews'],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveReview = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const { error } = await supabase.from('reviews').update({
          reviewer_name: editForm.reviewer_name,
          rating: editForm.rating,
          comment: editForm.comment,
          status: editForm.status,
        }).eq('id', editingId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      setDialogOpen(false); setEditForm(emptyReview); setEditingId(null);
      toast.success(lang === 'bn' ? 'রিভিউ আপডেট হয়েছে' : 'Review updated');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteReview = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success(lang === 'bn' ? 'রিভিউ মুছে ফেলা হয়েছে' : 'Review deleted');
    },
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
    ));
  };

  return (
    <div className="space-y-4">
      <Card className="border-none bg-card shadow-sm">
        <CardContent className="p-0">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{lang === 'bn' ? 'সব রিভিউ' : 'All Reviews'}</h3>
            <span className="text-sm text-muted-foreground">{reviews?.length || 0} {lang === 'bn' ? 'টি রিভিউ' : 'reviews'}</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{lang === 'bn' ? 'নাম' : 'Reviewer'}</TableHead>
                <TableHead>{lang === 'bn' ? 'রেটিং' : 'Rating'}</TableHead>
                <TableHead>{lang === 'bn' ? 'কমেন্ট' : 'Comment'}</TableHead>
                <TableHead>{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                <TableHead>{lang === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews && reviews.length > 0 ? reviews.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.reviewer_name || '-'}</TableCell>
                  <TableCell><div className="flex gap-0.5">{renderStars(r.rating)}</div></TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{r.comment || '-'}</TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      r.status === 'published' ? 'bg-primary/10 text-primary' : 'bg-accent/20 text-accent-foreground'
                    }`}>{r.status}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => {
                        setEditForm({ reviewer_name: r.reviewer_name, rating: r.rating, comment: r.comment || '', status: r.status });
                        setEditingId(r.id);
                        setDialogOpen(true);
                      }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteReview.mutate(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">{lang === 'bn' ? 'কোনো রিভিউ পাওয়া যায়নি' : 'No reviews found'}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{lang === 'bn' ? 'রিভিউ এডিট' : 'Edit Review'}</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div><Label>{lang === 'bn' ? 'নাম' : 'Reviewer Name'}</Label><Input value={editForm.reviewer_name} onChange={(e) => setEditForm({ ...editForm, reviewer_name: e.target.value })} /></div>
            <div>
              <Label>{lang === 'bn' ? 'রেটিং' : 'Rating'}</Label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setEditForm({ ...editForm, rating: n })}>
                    <Star className={`h-6 w-6 cursor-pointer ${n <= editForm.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div><Label>{lang === 'bn' ? 'কমেন্ট' : 'Comment'}</Label><Textarea value={editForm.comment} onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })} /></div>
            <div>
              <Label>{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</Label>
              <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground">
                <option value="published">{lang === 'bn' ? 'প্রকাশিত' : 'Published'}</option>
                <option value="pending">{lang === 'bn' ? 'পেন্ডিং' : 'Pending'}</option>
                <option value="hidden">{lang === 'bn' ? 'লুকানো' : 'Hidden'}</option>
              </select>
            </div>
            <Button onClick={() => saveReview.mutate()} disabled={saveReview.isPending}>
              {saveReview.isPending ? (lang === 'bn' ? 'সেভ হচ্ছে...' : 'Saving...') : (lang === 'bn' ? 'সেভ করুন' : 'Save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ─── Payment Methods ─── */
const PaymentMethodsSection = () => {
  const { lang } = useI18n();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ method_name: '', account_number: '', payment_type: 'send_money', is_active: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: methods } = useQuery({
    queryKey: ['admin-payment-methods'],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from('payment_methods' as any).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const saveMethod = useMutation({
    mutationFn: async () => {
      if (!form.method_name.trim() || !form.account_number.trim()) {
        throw new Error(lang === 'bn' ? 'নাম ও নাম্বার দিন' : 'Name and number required');
      }
      if (editingId) {
        const { error } = await supabase.from('payment_methods' as any).update(form as any).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('payment_methods' as any).insert(form as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payment-methods'] });
      setDialogOpen(false);
      setForm({ method_name: '', account_number: '', payment_type: 'send_money', is_active: true });
      setEditingId(null);
      toast.success(lang === 'bn' ? 'সেভ হয়েছে' : 'Saved');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMethod = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('payment_methods' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payment-methods'] });
      toast.success(lang === 'bn' ? 'মুছে ফেলা হয়েছে' : 'Deleted');
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from('payment_methods' as any).update({ is_active: active } as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-payment-methods'] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setForm({ method_name: '', account_number: '', payment_type: 'send_money', is_active: true }); setEditingId(null); }}>
              <Plus className="mr-1 h-4 w-4" /> {lang === 'bn' ? 'মেথড যোগ করুন' : 'Add Method'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? (lang === 'bn' ? 'মেথড এডিট' : 'Edit Method') : (lang === 'bn' ? 'নতুন পেমেন্ট মেথড' : 'New Payment Method')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label>{lang === 'bn' ? 'মেথডের নাম' : 'Method Name'}</Label>
                <Input value={form.method_name} onChange={(e) => setForm({ ...form, method_name: e.target.value })} placeholder="বিকাশ, নগদ, রকেট..." />
              </div>
              <div>
                <Label>{lang === 'bn' ? 'একাউন্ট নাম্বার' : 'Account Number'}</Label>
                <Input value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} placeholder="01XXXXXXXXX" />
              </div>
              <div>
                <Label>{lang === 'bn' ? 'পেমেন্ট টাইপ' : 'Payment Type'}</Label>
                <select
                  value={form.payment_type}
                  onChange={(e) => setForm({ ...form, payment_type: e.target.value })}
                  className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="send_money">{lang === 'bn' ? 'সেন্ড মানি' : 'Send Money'}</option>
                  <option value="cash_out">{lang === 'bn' ? 'ক্যাশ আউট' : 'Cash Out'}</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={(c) => setForm({ ...form, is_active: c })} />
                <Label>{lang === 'bn' ? 'সক্রিয়' : 'Active'}</Label>
              </div>
              <Button onClick={() => saveMethod.mutate()} disabled={saveMethod.isPending}>
                {saveMethod.isPending ? '...' : (lang === 'bn' ? 'সেভ করুন' : 'Save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {methods?.map((m: any) => (
          <Card key={m.id} className={`border-none shadow-sm ${!m.is_active ? 'opacity-50' : ''}`}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">{m.method_name}</h3>
                <Switch checked={m.is_active} onCheckedChange={(c) => toggleActive.mutate({ id: m.id, active: c })} />
              </div>
              <p className="text-2xl font-mono font-bold text-primary">{m.account_number}</p>
              <p className="text-sm text-muted-foreground">
                {m.payment_type === 'send_money' ? (lang === 'bn' ? 'সেন্ড মানি' : 'Send Money') : (lang === 'bn' ? 'ক্যাশ আউট' : 'Cash Out')}
              </p>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setForm({ method_name: m.method_name, account_number: m.account_number, payment_type: m.payment_type, is_active: m.is_active });
                  setEditingId(m.id);
                  setDialogOpen(true);
                }}>
                  <Pencil className="mr-1 h-3 w-3" /> {lang === 'bn' ? 'এডিট' : 'Edit'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => deleteMethod.mutate(m.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-1 h-3 w-3" /> {lang === 'bn' ? 'মুছুন' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!methods || methods.length === 0) && (
          <p className="col-span-full text-center py-8 text-muted-foreground">
            {lang === 'bn' ? 'কোনো পেমেন্ট মেথড নেই' : 'No payment methods yet'}
          </p>
        )}
      </div>
    </div>
  );
};

/* ─── Profile ─── */
const ProfileSection = () => {
  const { lang } = useI18n();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newName, setNewName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['admin-profile', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user!.id).maybeSingle();
      if (error) throw error;
      if (data) setNewName(data.full_name || '');
      return data;
    },
  });

  const updateName = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('profiles').update({ full_name: newName }).eq('user_id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
      queryClient.invalidateQueries({ queryKey: ['sidebar-profile'] });
      toast.success(lang === 'bn' ? 'নাম আপডেট হয়েছে' : 'Name updated');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const changePassword = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) throw new Error(lang === 'bn' ? 'পাসওয়ার্ড মিলছে না' : 'Passwords do not match');
      if (newPassword.length < 6) throw new Error(lang === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে' : 'Password must be at least 6 characters');
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
    onSuccess: () => {
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      toast.success(lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন হয়েছে' : 'Password changed');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadErr } = await supabase.storage.from('land-images').upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from('land-images').getPublicUrl(path);
      const avatarUrl = urlData.publicUrl + '?t=' + Date.now();
      const { error: updateErr } = await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('user_id', user.id);
      if (updateErr) throw updateErr;
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
      queryClient.invalidateQueries({ queryKey: ['sidebar-profile'] });
      toast.success(lang === 'bn' ? 'ছবি আপলোড হয়েছে' : 'Avatar uploaded');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const avatarUrl = profile?.avatar_url;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Avatar */}
      <Card className="border-none bg-card shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">{lang === 'bn' ? 'প্রোফাইল ছবি' : 'Profile Picture'}</h3>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <UserCircle className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1.5 text-primary-foreground hover:bg-primary/90 transition-colors"
                disabled={uploading}
              >
                <Camera className="h-4 w-4" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            <div>
              <p className="font-medium text-foreground">{profile?.full_name || user?.email}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {uploading && <p className="text-xs text-primary mt-1">{lang === 'bn' ? 'আপলোড হচ্ছে...' : 'Uploading...'}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Name */}
      <Card className="border-none bg-card shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">{lang === 'bn' ? 'নাম পরিবর্তন' : 'Update Name'}</h3>
          <div className="flex gap-3">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={lang === 'bn' ? 'আপনার নাম' : 'Your name'} className="max-w-sm" />
            <Button onClick={() => updateName.mutate()} disabled={updateName.isPending}>
              {updateName.isPending ? '...' : (lang === 'bn' ? 'সেভ' : 'Save')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card className="border-none bg-card shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}
          </h3>
          <div className="space-y-3 max-w-sm">
            <div>
              <Label>{lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div>
              <Label>{lang === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <Button onClick={() => changePassword.mutate()} disabled={changePassword.isPending}>
              {changePassword.isPending ? '...' : (lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Password')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/* ─── Contact Messages ─── */
const ContactMessagesSection = () => {
  const { lang } = useI18n();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-contact-messages'],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from('contact_messages' as any).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const toggleRead = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase.from('contact_messages' as any).update({ is_read } as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-contact-messages'] }),
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contact_messages' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contact-messages'] });
      toast.success(lang === 'bn' ? 'বার্তা মুছে ফেলা হয়েছে' : 'Message deleted');
    },
  });

  const unreadCount = messages?.filter((m: any) => !m.is_read).length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {lang === 'bn' ? `${unreadCount}টি অপঠিত বার্তা` : `${unreadCount} unread messages`}
        </p>
      </div>
      <Card className="border-none bg-card shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{lang === 'bn' ? 'নাম' : 'Name'}</TableHead>
                <TableHead>{lang === 'bn' ? 'ইমেইল' : 'Email'}</TableHead>
                <TableHead>{lang === 'bn' ? 'বিষয়' : 'Subject'}</TableHead>
                <TableHead>{lang === 'bn' ? 'বার্তা' : 'Message'}</TableHead>
                <TableHead>{lang === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
                <TableHead>{lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">{lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</TableCell></TableRow>
              ) : messages && messages.length > 0 ? messages.map((msg: any) => (
                <TableRow key={msg.id} className={msg.is_read ? '' : 'bg-primary/5'}>
                  <TableCell className="font-medium">{msg.name}</TableCell>
                  <TableCell className="text-muted-foreground">{msg.email}</TableCell>
                  <TableCell className="text-muted-foreground">{msg.subject || '-'}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{msg.message}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{new Date(msg.created_at).toLocaleDateString('bn-BD')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleRead.mutate({ id: msg.id, is_read: !msg.is_read })}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteMessage.mutate(msg.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">{lang === 'bn' ? 'কোনো বার্তা পাওয়া যায়নি' : 'No messages found'}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
