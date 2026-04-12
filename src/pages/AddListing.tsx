import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { divisions } from '@/data/districts';
import { toast } from 'sonner';
import { Check, Upload, X, Shield, Star, Loader2, ImagePlus } from 'lucide-react';
import Footer from '@/components/Footer';

interface FormData {
  land_type: string;
  ownership_type: string;
  total_size: string;
  expected_price: string;
  description_bn: string;
  description_en: string;
  division: string;
  district: string;
  road_width: string;
  address_bn: string;
  address_en: string;
  images: string[];
  title_bn: string;
  title_en: string;
  package_id: string;
  owner_name: string;
  owner_phone: string;
  sender_number: string;
  sender_transaction_id: string;
  payment_method_id: string;
}

const initialFormData: FormData = {
  land_type: 'residential',
  ownership_type: 'freehold',
  total_size: '',
  expected_price: '',
  description_bn: '',
  description_en: '',
  division: '',
  district: '',
  road_width: '',
  address_bn: '',
  address_en: '',
  images: [],
  title_bn: '',
  title_en: '',
  package_id: '',
  owner_name: '',
  owner_phone: '',
  sender_number: '',
  sender_transaction_id: '',
  payment_method_id: '',
};

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const steps = [
  { num: 1, key: 'stepBasicInfo' },
  { num: 2, key: 'stepLocation' },
  { num: 3, key: 'stepMedia' },
  { num: 4, key: 'stepPayment' },
] as const;

const AddListing = () => {
  const { t, lang } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  // Show login prompt instead of redirecting
  if (!authLoading && !user) {
    return (
      <div className="pt-24 pb-12 min-h-screen bg-muted/30">
        <div className="max-w-lg mx-auto px-4">
          <Card className="text-center">
            <CardContent className="py-12 space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {lang === 'bn' ? 'বিজ্ঞাপন দিতে লগইন করুন' : 'Login to Add Listing'}
              </h2>
              <p className="text-muted-foreground">
                {lang === 'bn'
                  ? 'জমি বিক্রির বিজ্ঞাপন দিতে আপনাকে প্রথমে লগইন বা রেজিস্ট্রেশন করতে হবে।'
                  : 'You need to login or create an account to post a land listing.'}
              </p>
              <div className="flex flex-col gap-3">
                <Button size="lg" onClick={() => navigate('/auth?redirect=/add-listing')} className="w-full">
                  {lang === 'bn' ? 'লগইন করুন' : 'Login'}
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/auth?redirect=/add-listing&mode=register')} className="w-full">
                  {lang === 'bn' ? 'নতুন একাউন্ট তৈরি করুন' : 'Create Account'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const { data: packages } = useQuery({
    queryKey: ['ad_packages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ad_packages').select('*').order('price', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: paymentMethods } = useQuery({
    queryKey: ['payment_methods'],
    queryFn: async () => {
      const { data, error } = await supabase.from('payment_methods' as any).select('*').eq('is_active', true);
      if (error) throw error;
      return data as any[];
    },
  });

  const selectedDivision = divisions.find(
    d => (lang === 'bn' ? d.name_bn : d.name_en) === formData.division
  );

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !user) return;
    const fileArray = Array.from(files);
    
    if (formData.images.length + fileArray.length > MAX_IMAGES) {
      toast.error(lang === 'bn' ? `সর্বোচ্চ ${MAX_IMAGES}টি ছবি আপলোড করা যাবে` : `Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(lang === 'bn' ? `${file.name} — ফাইল সাইজ ৫MB এর বেশি` : `${file.name} exceeds 5MB limit`);
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(lang === 'bn' ? `${file.name} — শুধু ছবি ফাইল গ্রহণযোগ্য` : `${file.name} is not an image`);
        return;
      }
    }

    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of fileArray) {
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from('land-images').upload(path, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('land-images').getPublicUrl(path);
        newUrls.push(urlData.publicUrl);
      }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] }));
      toast.success(lang === 'bn' ? 'ছবি আপলোড সফল' : 'Images uploaded successfully');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index: number) => {
    const url = formData.images[index];
    // Try to delete from storage
    try {
      const pathMatch = url.split('/land-images/')[1];
      if (pathMatch) {
        await supabase.storage.from('land-images').remove([decodeURIComponent(pathMatch)]);
      }
    } catch {}
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.land_type && formData.total_size && formData.expected_price && formData.owner_name && formData.owner_phone);
      case 2:
        return !!(formData.division && formData.district);
      case 3:
        return !!(formData.title_bn && formData.title_en);
      case 4:
        return !!formData.package_id;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error(t('fillRequired'));
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!validateStep(4)) {
      toast.error(t('fillRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const selectedPkg = packages?.find(p => p.id === formData.package_id);
      const locationBn = `${formData.address_bn}, ${formData.district}`;
      const locationEn = `${formData.address_en}, ${formData.district}`;

      const { data: landData, error: landError } = await supabase.from('lands').insert({
        title_bn: formData.title_bn,
        title_en: formData.title_en,
        description_bn: formData.description_bn,
        description_en: formData.description_en,
        land_type: formData.land_type,
        area_size: parseFloat(formData.total_size) || 0,
        price: parseFloat(formData.expected_price) || 0,
        road_width: parseFloat(formData.road_width) || 0,
        location_bn: locationBn,
        location_en: locationEn,
        owner_name: formData.owner_name,
        owner_phone: formData.owner_phone,
        images: formData.images.filter(url => url.trim() !== ''),
        is_featured: selectedPkg?.is_featured || false,
        status: 'pending',
        user_id: user.id,
      }).select().single();

      if (landError) throw landError;

      if (selectedPkg && landData) {
        const { error: paymentError } = await supabase.from('payments').insert({
          user_id: user.id,
          payment_type: 'ad_package',
          amount: selectedPkg.price,
          land_id: landData.id,
          package_id: selectedPkg.id,
          status: 'pending',
          sender_number: formData.sender_number || null,
          sender_transaction_id: formData.sender_transaction_id || null,
          payment_method_id: formData.payment_method_id || null,
        } as any);
        if (paymentError) throw paymentError;
      }

      toast.success(t('listingSuccess'));
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || t('error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const landTypes = [
    { value: 'residential', label: t('residential') },
    { value: 'commercial', label: t('commercial') },
    { value: 'agricultural', label: t('agricultural') },
    { value: 'industrial', label: t('industrial') },
  ];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary font-headline mb-2">
            {t('addListingTitle')}
          </h1>
          <p className="text-on-surface-variant">{t('addListingSubtitle')}</p>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-center mb-10 gap-0">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    currentStep > step.num
                      ? 'bg-primary text-primary-foreground'
                      : currentStep === step.num
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {currentStep > step.num ? <Check className="h-5 w-5" /> : step.num}
                </div>
                <span className={`text-xs mt-1.5 whitespace-nowrap ${
                  currentStep >= step.num ? 'text-primary font-semibold' : 'text-on-surface-variant'
                }`}>
                  {t(step.key)}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 sm:w-24 h-0.5 mx-2 mt-[-1rem] ${
                  currentStep > step.num ? 'bg-primary' : 'bg-surface-container-high'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="lg:col-span-2">
            <Card className="shadow-md border-0 bg-surface-container-lowest">
              <CardContent className="p-6 sm:p-8">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-primary mb-4">{t('stepBasicInfo')}</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{t('landType')}</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {landTypes.map(lt => (
                          <button
                            key={lt.value}
                            type="button"
                            onClick={() => updateField('land_type', lt.value)}
                            className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                              formData.land_type === lt.value
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                          >
                            {lt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{t('ownershipType')}</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[{ value: 'freehold', label: t('freehold') }, { value: 'leasehold', label: t('leasehold') }].map(ot => (
                          <button
                            key={ot.value}
                            type="button"
                            onClick={() => updateField('ownership_type', ot.value)}
                            className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                              formData.ownership_type === ot.value
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                          >
                            {ot.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{t('totalSize')}</label>
                        <Input
                          type="number"
                          value={formData.total_size}
                          onChange={e => updateField('total_size', e.target.value)}
                          placeholder="e.g. 10"
                          className="bg-surface-container border-outline-variant/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{t('expectedPrice')}</label>
                        <Input
                          type="number"
                          value={formData.expected_price}
                          onChange={e => updateField('expected_price', e.target.value)}
                          placeholder="e.g. 500000"
                          className="bg-surface-container border-outline-variant/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{t('ownerName')}</label>
                        <Input
                          value={formData.owner_name}
                          onChange={e => updateField('owner_name', e.target.value)}
                          className="bg-surface-container border-outline-variant/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{t('ownerPhone')}</label>
                        <Input
                          value={formData.owner_phone}
                          onChange={e => updateField('owner_phone', e.target.value)}
                          className="bg-surface-container border-outline-variant/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{t('descriptionBn')}</label>
                      <Textarea
                        value={formData.description_bn}
                        onChange={e => updateField('description_bn', e.target.value)}
                        rows={3}
                        className="bg-surface-container border-outline-variant/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{t('descriptionEn')}</label>
                      <Textarea
                        value={formData.description_en}
                        onChange={e => updateField('description_en', e.target.value)}
                        rows={3}
                        className="bg-surface-container border-outline-variant/20"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Location */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-primary mb-4">{t('stepLocation')}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{t('division')}</label>
                        <select
                          value={formData.division}
                          onChange={e => {
                            updateField('division', e.target.value);
                            updateField('district', '');
                          }}
                          className="w-full h-10 rounded-md border border-outline-variant/20 bg-surface-container px-3 text-sm"
                        >
                          <option value="">{lang === 'bn' ? 'বিভাগ নির্বাচন করুন' : 'Select Division'}</option>
                          {divisions.map(d => (
                            <option key={d.name_en} value={lang === 'bn' ? d.name_bn : d.name_en}>
                              {lang === 'bn' ? d.name_bn : d.name_en}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{t('district')}</label>
                        <select
                          value={formData.district}
                          onChange={e => updateField('district', e.target.value)}
                          className="w-full h-10 rounded-md border border-outline-variant/20 bg-surface-container px-3 text-sm"
                          disabled={!selectedDivision}
                        >
                          <option value="">{lang === 'bn' ? 'জেলা নির্বাচন করুন' : 'Select District'}</option>
                          {selectedDivision?.districts.map(d => (
                            <option key={d.name_en} value={lang === 'bn' ? d.name_bn : d.name_en}>
                              {lang === 'bn' ? d.name_bn : d.name_en}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{t('roadWidth')} ({t('feet')})</label>
                      <Input
                        type="number"
                        value={formData.road_width}
                        onChange={e => updateField('road_width', e.target.value)}
                        placeholder="e.g. 20"
                        className="bg-surface-container border-outline-variant/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{t('detailAddressBn')}</label>
                      <Textarea
                        value={formData.address_bn}
                        onChange={e => updateField('address_bn', e.target.value)}
                        rows={2}
                        className="bg-surface-container border-outline-variant/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{t('detailAddressEn')}</label>
                      <Textarea
                        value={formData.address_en}
                        onChange={e => updateField('address_en', e.target.value)}
                        rows={2}
                        className="bg-surface-container border-outline-variant/20"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Media & Title */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-primary mb-4">{t('stepMedia')}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{t('titleBn')}</label>
                        <Input
                          value={formData.title_bn}
                          onChange={e => updateField('title_bn', e.target.value)}
                          className="bg-surface-container border-outline-variant/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{t('titleEn')}</label>
                        <Input
                          value={formData.title_en}
                          onChange={e => updateField('title_en', e.target.value)}
                          className="bg-surface-container border-outline-variant/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-2">
                        {lang === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Images'} ({formData.images.length}/{MAX_IMAGES})
                      </label>

                      {/* Image Previews */}
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                          {formData.images.map((url, i) => (
                            <div key={i} className="relative group aspect-video rounded-lg overflow-hidden bg-surface-container">
                              <img src={url} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute top-1.5 right-1.5 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload Area */}
                      {formData.images.length < MAX_IMAGES && (
                        <label
                          className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-primary/30 bg-surface-container hover:bg-surface-container-high cursor-pointer transition-colors"
                          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                          onDrop={e => { e.preventDefault(); e.stopPropagation(); handleFileUpload(e.dataTransfer.files); }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={e => handleFileUpload(e.target.files)}
                            disabled={uploading}
                          />
                          {uploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                          ) : (
                            <ImagePlus className="h-8 w-8 text-primary/50 mb-2" />
                          )}
                          <span className="text-sm text-on-surface-variant">
                            {uploading
                              ? (lang === 'bn' ? 'আপলোড হচ্ছে...' : 'Uploading...')
                              : (lang === 'bn' ? 'ক্লিক করুন বা ড্র্যাগ করুন' : 'Click or drag images here')}
                          </span>
                          <span className="text-xs text-on-surface-variant/60 mt-1">
                            {lang === 'bn' ? 'সর্বোচ্চ ৫টি ছবি, প্রতিটি ৫MB' : 'Max 5 images, 5MB each'}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {currentStep === 4 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-primary mb-4">{t('selectPackage')}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {packages?.map(pkg => {
                        const isSelected = formData.package_id === pkg.id;
                        const features = pkg.is_featured
                          ? [
                              lang === 'bn' ? `${pkg.duration} দিনের জন্য বৈধ` : `Valid for ${pkg.duration} days`,
                              lang === 'bn' ? 'সর্বোচ্চ ৫টি ছবি' : 'Up to 5 photos',
                              lang === 'bn' ? 'হোমপেজে ফিচার্ড' : 'Featured on Home Page',
                              lang === 'bn' ? 'প্রিমিয়াম ব্যাজ' : 'Premium badge',
                            ]
                          : [
                              lang === 'bn' ? `${pkg.duration} দিনের জন্য বৈধ` : `Valid for ${pkg.duration} days`,
                              lang === 'bn' ? 'সর্বোচ্চ ৫টি ছবি' : 'Up to 5 photos',
                              lang === 'bn' ? 'সাধারণ তালিকা' : 'Standard listing',
                            ];

                        return (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => updateField('package_id', pkg.id)}
                            className={`relative p-5 rounded-xl text-left transition-all border-2 ${
                              isSelected
                                ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20'
                                : 'border-outline-variant/20 bg-surface-container hover:border-primary/40'
                            }`}
                          >
                            {pkg.is_featured && (
                              <span className="absolute -top-3 right-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                {lang === 'bn' ? 'সেরা মূল্য' : 'BEST VALUE'}
                              </span>
                            )}
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-bold text-primary text-lg">
                                {lang === 'bn' ? pkg.name_bn : pkg.name_en}
                              </h3>
                              {pkg.is_featured && <Star className="h-5 w-5 text-accent fill-accent" />}
                            </div>
                            <p className="text-3xl font-bold text-on-surface mb-3">৳{pkg.price.toLocaleString()}</p>

                            <ul className="space-y-2 mb-3">
                              {features.map((f, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-on-surface-variant">
                                  <Check className="h-4 w-4 text-primary shrink-0" />
                                  {f}
                                </li>
                              ))}
                            </ul>

                            {isSelected && (
                              <div className="mt-3 flex items-center gap-1 text-primary text-sm font-bold">
                                <Check className="h-4 w-4" /> {lang === 'bn' ? 'নির্বাচিত' : 'Selected'}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Summary */}
                    {formData.package_id && (() => {
                      const selectedPkg = packages?.find(p => p.id === formData.package_id);
                      return (
                        <div className="mt-6 p-5 rounded-xl bg-surface-container border border-outline-variant/20">
                          <h3 className="font-bold text-primary mb-3">{t('listingSummary')}</h3>
                          <div className="space-y-2 text-sm text-on-surface-variant">
                            <div className="flex justify-between">
                              <span>{t('landType')}</span>
                              <span className="font-medium text-on-surface">{formData.land_type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('totalSize')}</span>
                              <span className="font-medium text-on-surface">{formData.total_size} {t('decimal')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('expectedPrice')}</span>
                              <span className="font-medium text-on-surface">৳{Number(formData.expected_price).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('location')}</span>
                              <span className="font-medium text-on-surface">{formData.district}</span>
                            </div>
                            <div className="border-t border-outline-variant/20 pt-3 mt-3">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-on-surface">{lang === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                                <span className="text-2xl font-bold text-primary">৳{selectedPkg?.price.toLocaleString()}</span>
                              </div>
                              <p className="text-xs text-on-surface-variant mt-1">
                                {lang === 'bn' ? 'পেমেন্ট করার পর আপনার বিজ্ঞাপন প্রকাশিত হবে' : 'Your listing will be published after payment'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {currentStep > 1 ? (
                    <Button variant="outline" onClick={handlePrev} className="border-primary text-primary">
                      {t('previous')}
                    </Button>
                  ) : <div />}

                  {currentStep < 4 ? (
                    <Button onClick={handleNext} className="bg-primary text-primary-foreground px-8">
                      {t('next')}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting || !formData.package_id}
                      className="bg-primary text-primary-foreground px-8"
                    >
                      {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      {t('submitListing')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bento Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="p-6 rounded-xl bg-surface-container-low">
                <Shield className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold text-primary mb-1">
                  {lang === 'bn' ? 'সত্যতা যাচাই' : 'Authenticity Verified'}
                </h3>
                <p className="text-sm text-on-surface-variant">
                  {lang === 'bn' ? 'প্রতিটি বিজ্ঞাপন আমাদের টিম দ্বারা যাচাই করা হয়।' : 'Every listing is verified by our team.'}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-surface-container-low">
                <Star className="h-8 w-8 text-accent mb-3" />
                <h3 className="font-bold text-primary mb-1">
                  {lang === 'bn' ? 'প্রিমিয়াম রিচ' : 'Premium Reach'}
                </h3>
                <p className="text-sm text-on-surface-variant">
                  {lang === 'bn' ? 'ফিচার্ড প্যাকেজে আপনার বিজ্ঞাপন সবার আগে দেখাবে।' : 'Featured packages show your ad at the top.'}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar: Ad Pricing */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <Card className="border-0 shadow-md bg-surface-container-lowest">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-primary mb-4">{t('adPricing')}</h3>
                  <div className="space-y-4">
                    {packages?.map(pkg => {
                      const features = pkg.is_featured
                        ? [
                            lang === 'bn' ? `${pkg.duration} দিন` : `${pkg.duration} days`,
                            lang === 'bn' ? 'হোমপেজে ফিচার্ড' : 'Featured',
                            lang === 'bn' ? 'প্রিমিয়াম ব্যাজ' : 'Premium badge',
                          ]
                        : [
                            lang === 'bn' ? `${pkg.duration} দিন` : `${pkg.duration} days`,
                            lang === 'bn' ? 'সাধারণ তালিকা' : 'Standard',
                          ];
                      return (
                        <div
                          key={pkg.id}
                          className={`p-4 rounded-lg transition-all ${
                            pkg.is_featured
                              ? 'bg-accent/10 border border-accent/30'
                              : 'bg-surface-container'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-on-surface">
                              {lang === 'bn' ? pkg.name_bn : pkg.name_en}
                            </span>
                            {pkg.is_featured && (
                              <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-bold">
                                {lang === 'bn' ? 'সেরা' : 'BEST'}
                              </span>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-primary">৳{pkg.price.toLocaleString()}</p>
                          <ul className="mt-2 space-y-1">
                            {features.map((f, i) => (
                              <li key={i} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                                <Check className="h-3 w-3 text-primary" /> {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddListing;
