import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, MapPin, DollarSign, Users } from 'lucide-react';

const emptyLand = {
  title_bn: '', title_en: '', description_bn: '', description_en: '',
  price: 0, area_size: 0, location_bn: '', location_en: '',
  road_width: 0, owner_name: '', owner_phone: '', owner_address: '',
  images: [] as string[], is_featured: false, status: 'active',
};

const Admin = () => {
  const { t, lang } = useI18n();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [landForm, setLandForm] = useState(emptyLand);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const { data: lands } = useQuery({
    queryKey: ['admin-lands'],
    queryFn: async () => {
      const { data, error } = await supabase.from('lands').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [landsRes, paymentsRes] = await Promise.all([
        supabase.from('lands').select('id', { count: 'exact', head: true }),
        supabase.from('payments').select('id', { count: 'exact', head: true }),
      ]);
      return { totalLands: landsRes.count || 0, totalPayments: paymentsRes.count || 0 };
    },
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
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success(t('success'));
    },
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

  if (!authLoading && (!user || !isAdmin)) return <Navigate to="/" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">{t('dashboard')}</h1>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <MapPin className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{t('totalLands')}</p>
              <p className="text-2xl font-bold text-foreground">{stats?.totalLands || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <DollarSign className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">{t('totalPayments')}</p>
              <p className="text-2xl font-bold text-foreground">{stats?.totalPayments || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{t('totalUsers')}</p>
              <p className="text-2xl font-bold text-foreground">-</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lands">
        <TabsList>
          <TabsTrigger value="lands">{t('manageLands')}</TabsTrigger>
          <TabsTrigger value="payments">{t('payments')}</TabsTrigger>
        </TabsList>

        <TabsContent value="lands">
          <div className="mb-4 flex justify-end">
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
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>{t('titleBn')}</Label>
                      <Input value={landForm.title_bn} onChange={(e) => setLandForm({ ...landForm, title_bn: e.target.value })} />
                    </div>
                    <div>
                      <Label>{t('titleEn')}</Label>
                      <Input value={landForm.title_en} onChange={(e) => setLandForm({ ...landForm, title_en: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>{t('descriptionBn')}</Label>
                      <Textarea value={landForm.description_bn} onChange={(e) => setLandForm({ ...landForm, description_bn: e.target.value })} />
                    </div>
                    <div>
                      <Label>{t('descriptionEn')}</Label>
                      <Textarea value={landForm.description_en} onChange={(e) => setLandForm({ ...landForm, description_en: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label>{t('price')} ({t('taka')})</Label>
                      <Input type="number" value={landForm.price} onChange={(e) => setLandForm({ ...landForm, price: Number(e.target.value) })} />
                    </div>
                    <div>
                      <Label>{t('area')} ({t('decimal')})</Label>
                      <Input type="number" value={landForm.area_size} onChange={(e) => setLandForm({ ...landForm, area_size: Number(e.target.value) })} />
                    </div>
                    <div>
                      <Label>{t('roadWidth')} ({t('feet')})</Label>
                      <Input type="number" value={landForm.road_width} onChange={(e) => setLandForm({ ...landForm, road_width: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>{t('location')} (বাংলা)</Label>
                      <Input value={landForm.location_bn} onChange={(e) => setLandForm({ ...landForm, location_bn: e.target.value })} />
                    </div>
                    <div>
                      <Label>{t('location')} (English)</Label>
                      <Input value={landForm.location_en} onChange={(e) => setLandForm({ ...landForm, location_en: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label>{t('ownerName')}</Label>
                      <Input value={landForm.owner_name} onChange={(e) => setLandForm({ ...landForm, owner_name: e.target.value })} />
                    </div>
                    <div>
                      <Label>{t('ownerPhone')}</Label>
                      <Input value={landForm.owner_phone} onChange={(e) => setLandForm({ ...landForm, owner_phone: e.target.value })} />
                    </div>
                    <div>
                      <Label>{t('ownerAddress')}</Label>
                      <Input value={landForm.owner_address} onChange={(e) => setLandForm({ ...landForm, owner_address: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>{t('images')} (URL)</Label>
                    <div className="flex gap-2">
                      <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
                      <Button type="button" variant="outline" onClick={addImage}>+</Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {landForm.images.map((img, i) => (
                        <div key={i} className="relative h-16 w-20 overflow-hidden rounded border">
                          <img src={img} alt="" className="h-full w-full object-cover" />
                          <button onClick={() => removeImage(i)} className="absolute right-0 top-0 rounded-bl bg-destructive px-1 text-xs text-destructive-foreground">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={landForm.is_featured} onCheckedChange={(c) => setLandForm({ ...landForm, is_featured: c })} />
                    <Label>{t('featured')}</Label>
                  </div>
                  <Button onClick={() => saveLand.mutate()} disabled={saveLand.isPending}>
                    {saveLand.isPending ? t('loading') : t('save')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('title')}</TableHead>
                  <TableHead>{t('location')}</TableHead>
                  <TableHead>{t('price')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lands?.map((land: any) => (
                  <TableRow key={land.id}>
                    <TableCell className="font-medium">{lang === 'bn' ? land.title_bn : land.title_en}</TableCell>
                    <TableCell>{lang === 'bn' ? land.location_bn : land.location_en}</TableCell>
                    <TableCell>{t('taka')} {land.price.toLocaleString()}</TableCell>
                    <TableCell>{land.status}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setLandForm(land);
                          setEditingId(land.id);
                          setDialogOpen(true);
                        }}>
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
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PaymentsTab = () => {
  const { t } = useI18n();
  const { data: payments } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>{t('price')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments?.map((p: any) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono text-xs">{p.id.slice(0, 8)}</TableCell>
              <TableCell>{p.payment_type}</TableCell>
              <TableCell>{t('taka')} {p.amount?.toLocaleString()}</TableCell>
              <TableCell>{p.status}</TableCell>
              <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Admin;
