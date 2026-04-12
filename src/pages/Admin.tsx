import { useState } from 'react';
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
  LayoutDashboard, MapPin, CreditCard, Package, Users, Settings, LogOut,
  Plus, Pencil, Trash2, DollarSign, TrendingUp, Eye, Search, Menu, X,
  ChevronRight, Star
} from 'lucide-react';

type Section = 'dashboard' | 'listings' | 'payments' | 'packages' | 'users';

const emptyLand = {
  title_bn: '', title_en: '', description_bn: '', description_en: '',
  price: 0, area_size: 0, location_bn: '', location_en: '',
  road_width: 0, owner_name: '', owner_phone: '', owner_address: '',
  images: [] as string[], is_featured: false, status: 'active',
};

const emptyPackage = {
  name_bn: '', name_en: '', price: 0, duration: 7, is_featured: false,
};

const Admin = () => {
  const { t, lang } = useI18n();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!authLoading && (!user || !isAdmin)) return <Navigate to="/" />;

  const menuItems = [
    { id: 'dashboard' as Section, icon: LayoutDashboard, label: lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard', desc: lang === 'bn' ? 'সামগ্রিক পরিসংখ্যান' : 'Overview & stats' },
    { id: 'listings' as Section, icon: MapPin, label: lang === 'bn' ? 'লিস্টিং' : 'My Listings', desc: lang === 'bn' ? 'জমি ম্যানেজ করুন' : 'Manage properties' },
    { id: 'payments' as Section, icon: CreditCard, label: lang === 'bn' ? 'পেমেন্ট' : 'Payments', desc: lang === 'bn' ? 'লেনদেনের ইতিহাস' : 'Transaction history' },
    { id: 'packages' as Section, icon: Package, label: lang === 'bn' ? 'এড প্যাকেজ' : 'Ad Packages', desc: lang === 'bn' ? 'প্যাকেজ ম্যানেজ করুন' : 'Manage packages' },
    { id: 'users' as Section, icon: Users, label: lang === 'bn' ? 'ইউজার' : 'Users', desc: lang === 'bn' ? 'ইউজার ম্যানেজমেন্ট' : 'User management' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
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

        <nav className="flex-1 px-3 py-4 space-y-1">
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

        <div className="border-t border-white/10 px-3 py-4 space-y-1">
          <button
            onClick={() => navigate('/')}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/50 hover:bg-white/10 hover:text-white transition-all"
          >
            <Eye className="h-[18px] w-[18px]" />
            {lang === 'bn' ? 'সাইট দেখুন' : 'View Site'}
          </button>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-300/80 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
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
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {menuItems.find(m => m.id === section)?.label}
            </h2>
            <p className="text-xs text-muted-foreground">{menuItems.find(m => m.id === section)?.desc}</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {section === 'dashboard' && <DashboardSection />}
          {section === 'listings' && <ListingsSection />}
          {section === 'payments' && <PaymentsSection />}
          {section === 'packages' && <PackagesSection />}
          {section === 'users' && <UsersSection />}
        </main>
      </div>
    </div>
  );
};

/* ─── Dashboard ─── */
const DashboardSection = () => {
  const { lang } = useI18n();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [landsRes, paymentsRes, profilesRes, earningsRes] = await Promise.all([
        supabase.from('lands').select('id', { count: 'exact', head: true }),
        supabase.from('payments').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('payments').select('amount').eq('status', 'completed'),
      ]);
      const totalEarnings = earningsRes.data?.reduce((s, p) => s + (p.amount || 0), 0) || 0;
      return {
        totalLands: landsRes.count || 0,
        totalPayments: paymentsRes.count || 0,
        totalUsers: profilesRes.count || 0,
        totalEarnings,
      };
    },
  });

  const { data: recentLands } = useQuery({
    queryKey: ['admin-recent-lands'],
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

  const { data: lands } = useQuery({
    queryKey: ['admin-lands'],
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
      if (editingId) {
        const { error } = await supabase.from('lands').update(landForm).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('lands').insert(landForm);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lands'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setDialogOpen(false);
      setLandForm(emptyLand);
      setEditingId(null);
      toast.success(t('success'));
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteLand = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('lands').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lands'] });
      toast.success(t('success'));
    },
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
    if (imageUrl.trim()) {
      setLandForm({ ...landForm, images: [...landForm.images, imageUrl.trim()] });
      setImageUrl('');
    }
  };

  const removeImage = (idx: number) => {
    setLandForm({ ...landForm, images: landForm.images.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={lang === 'bn' ? 'লিস্টিং খুঁজুন...' : 'Search listings...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setLandForm(emptyLand); setEditingId(null); }}>
              <Plus className="mr-1 h-4 w-4" /> {t('addLand')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? t('editLand') : t('addLand')}</DialogTitle>
            </DialogHeader>
            <LandForm
              form={landForm} setForm={setLandForm}
              imageUrl={imageUrl} setImageUrl={setImageUrl}
              addImage={addImage} removeImage={removeImage}
              onSave={() => saveLand.mutate()} saving={saveLand.isPending}
            />
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
              {filtered?.map((land: any) => (
                <TableRow key={land.id}>
                  <TableCell className="font-medium">{lang === 'bn' ? land.title_bn : land.title_en}</TableCell>
                  <TableCell className="text-muted-foreground">{lang === 'bn' ? land.location_bn : land.location_en}</TableCell>
                  <TableCell>৳{land.price?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Switch
                      checked={land.is_featured}
                      onCheckedChange={(c) => toggleFeatured.mutate({ id: land.id, featured: c })}
                    />
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleStatus.mutate({ id: land.id, status: land.status === 'active' ? 'inactive' : 'active' })}
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer ${land.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
                    >
                      {land.status}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setLandForm(land); setEditingId(land.id); setDialogOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteLand.mutate(land.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

/* ─── Land Form (shared) ─── */
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
      <Button onClick={onSave} disabled={saving}>
        {saving ? t('loading') : t('save')}
      </Button>
    </div>
  );
};

/* ─── Payments ─── */
const PaymentsSection = () => {
  const { lang } = useI18n();
  const [filter, setFilter] = useState('all');

  const { data: payments } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = payments?.filter((p: any) => filter === 'all' || p.status === filter);

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
                <TableHead>{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                <TableHead>{lang === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered?.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.id.slice(0, 8)}</TableCell>
                  <TableCell>{p.payment_type}</TableCell>
                  <TableCell className="font-medium">৳{p.amount?.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === 'completed' ? 'bg-primary/10 text-primary' :
                      p.status === 'pending' ? 'bg-accent/20 text-accent-foreground' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

/* ─── Ad Packages ─── */
const PackagesSection = () => {
  const { t, lang } = useI18n();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyPackage);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: packages } = useQuery({
    queryKey: ['admin-packages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ad_packages').select('*').order('price');
      if (error) throw error;
      return data;
    },
  });

  const savePackage = useMutation({
    mutationFn: async () => {
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
      setDialogOpen(false);
      setForm(emptyPackage);
      setEditingId(null);
      toast.success(t('success'));
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deletePackage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('ad_packages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
      toast.success(t('success'));
    },
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
            <DialogHeader>
              <DialogTitle>{editingId ? (lang === 'bn' ? 'প্যাকেজ এডিট' : 'Edit Package') : (lang === 'bn' ? 'নতুন প্যাকেজ' : 'New Package')}</DialogTitle>
            </DialogHeader>
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
              <Button onClick={() => savePackage.mutate()} disabled={savePackage.isPending}>
                {savePackage.isPending ? t('loading') : t('save')}
              </Button>
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
  const queryClient = useQueryClient();

  const { data: profiles } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: roles } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_roles').select('*');
      if (error) throw error;
      return data;
    },
  });

  const toggleAdmin = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      if (isAdmin) {
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
            {profiles?.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.full_name || '-'}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{p.user_id.slice(0, 8)}...</TableCell>
                <TableCell className="text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Switch
                    checked={isUserAdmin(p.user_id)}
                    onCheckedChange={() => toggleAdmin.mutate({ userId: p.user_id, isAdmin: !!isUserAdmin(p.user_id) })}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Admin;
