import { useI18n } from '@/lib/i18n';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const { lang } = useI18n();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const { error } = await supabase.from('contact_messages' as any).insert({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: subject || null,
      message: formData.get('message') as string,
    } as any);
    setLoading(false);
    if (error) {
      toast({ title: lang === 'bn' ? 'ত্রুটি হয়েছে!' : 'Error!', description: error.message, variant: 'destructive' });
    } else {
      toast({
        title: lang === 'bn' ? 'বার্তা পাঠানো হয়েছে!' : 'Message sent!',
        description: lang === 'bn' ? 'আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।' : 'We will contact you shortly.',
      });
      form.reset();
      setSubject('');
    }
  };

  const faqs = [
    {
      q: lang === 'bn' ? 'কিভাবে একটি জমি লিস্টিং করা যায়?' : 'How to list a property?',
      a: lang === 'bn'
        ? "আপনি 'Add Listing' বাটনে ক্লিক করে জমির ছবি, সঠিক লোকেশন এবং প্রয়োজনীয় কাগজপত্রের স্ক্যান কপি আপলোড করে আবেদন করতে পারেন। আমাদের টিম তথ্যগুলো যাচাই করে ৪৮ ঘণ্টার মধ্যে লিস্টিংটি পাবলিশ করবে।"
        : "Click the 'Add Listing' button and upload property photos, exact location, and scanned copies of required documents. Our team will verify and publish the listing within 48 hours.",
    },
    {
      q: lang === 'bn' ? 'পেমেন্ট করার পদ্ধতি কি?' : 'What are the payment methods?',
      a: lang === 'bn'
        ? 'আমরা বিকাশ, নগদ এবং সকল প্রধান ব্যাংক কার্ড গ্রহণ করি। বুকিং এর জন্য আপনি অনলাইনে পেমেন্ট করতে পারেন। তবে মূল কেনা-বেচা রেজিস্ট্রি অফিসে সরাসরি সম্পাদিত হয়।'
        : 'We accept bKash, Nagad, and all major bank cards. You can pay online for bookings. However, the main transaction is completed directly at the registry office.',
    },
    {
      q: lang === 'bn' ? 'লিস্টিং করার জন্য কি কোনো ফি দিতে হয়?' : 'Is there a fee for listing?',
      a: lang === 'bn'
        ? 'বেসিক লিস্টিং সম্পূর্ণ ফ্রি। তবে ফিচার্ড লিস্টিং বা প্রিমিয়াম প্যাকেজের জন্য নির্দিষ্ট ফি প্রযোজ্য। বিস্তারিত জানতে আমাদের এড প্যাকেজ পেজ দেখুন।'
        : 'Basic listing is completely free. However, specific fees apply for featured listings or premium packages. Visit our Ad Packages page for details.',
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-background">
      {/* Contact Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 max-w-screen-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left - Contact Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              {lang === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed mb-10">
              {lang === 'bn'
                ? 'আমাদের সাথে যোগাযোগ করতে নিচের তথ্যগুলো ব্যবহার করুন অথবা সরাসরি ফর্মটি পূরণ করুন।'
                : 'Use the information below to contact us or fill out the form directly.'}
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    {lang === 'bn' ? 'ফোন' : 'Phone'}
                  </h3>
                  <p className="text-muted-foreground">01791208768</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    {lang === 'bn' ? 'ইমেইল' : 'Email'}
                  </h3>
                  <p className="text-muted-foreground">support@webogrowth.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    {lang === 'bn' ? 'ঠিকানা' : 'Address'}
                  </h3>
                  <p className="text-muted-foreground">
                    {lang === 'bn'
                      ? 'লেভেল ১২, শান্তা টাওয়ার, বনানী, ঢাকা ১২১৩'
                      : 'Level 12, Shanta Tower, Banani, Dhaka 1213'}
                  </p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-border">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80"
                alt="Map location"
                className="w-full h-[200px] object-cover"
              />
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="bg-card border border-border rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-foreground font-medium mb-2 block">
                  {lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                </Label>
                <Input
                  name="name"
                  placeholder={lang === 'bn' ? 'উদা: আব্দুল করিম' : 'e.g. Abdul Karim'}
                  required
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="text-foreground font-medium mb-2 block">
                  {lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
                </Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="karim@email.com"
                  required
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="text-foreground font-medium mb-2 block">
                  {lang === 'bn' ? 'বিষয়' : 'Subject'}
                </Label>
                <Select name="subject">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={lang === 'bn' ? 'বিষয় নির্বাচন করুন' : 'Select a subject'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">{lang === 'bn' ? 'জমি কেনার বিষয়ে তথ্য' : 'Land buying information'}</SelectItem>
                    <SelectItem value="sell">{lang === 'bn' ? 'জমি বিক্রি করতে চাই' : 'Want to sell land'}</SelectItem>
                    <SelectItem value="legal">{lang === 'bn' ? 'আইনি পরামর্শ' : 'Legal consultation'}</SelectItem>
                    <SelectItem value="other">{lang === 'bn' ? 'অন্যান্য' : 'Other'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-foreground font-medium mb-2 block">
                  {lang === 'bn' ? 'বার্তা' : 'Message'}
                </Label>
                <Textarea
                  name="message"
                  placeholder={lang === 'bn' ? 'আপনার প্রশ্নটি বিস্তারিত লিখুন...' : 'Write your question in detail...'}
                  required
                  rows={5}
                  className="rounded-xl"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground rounded-xl font-bold py-3 text-base"
              >
                {loading
                  ? (lang === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...')
                  : (lang === 'bn' ? 'বার্তা পাঠান' : 'Send Message')}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 max-w-screen-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">
            {lang === 'bn' ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            {lang === 'bn'
              ? 'পেমেন্ট এবং লিস্টিং সংক্রান্ত কিছু উত্তর যা আপনার উপকারে আসতে পারে'
              : 'Some answers about payments and listings that may help you'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-2xl px-6">
                <AccordionTrigger className="text-foreground font-semibold text-left hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
