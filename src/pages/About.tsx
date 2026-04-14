import { useI18n } from '@/lib/i18n';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { ShieldCheck, Map, CreditCard, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  const { lang } = useI18n();

  return (
    <div className="pt-20 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 max-w-screen-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              {lang === 'bn' ? 'আমাদের মিশন' : 'OUR MISSION'}
            </span>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground leading-tight mb-6">
              {lang === 'bn'
                ? 'ভূমি মালিকানা হোক সহজ ও বিশ্বস্ত'
                : 'Making Land Ownership Easy & Trustworthy'}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10">
              {lang === 'bn'
                ? 'জমি লাগবে প্ল্যাটফর্মের লক্ষ্য হলো বাংলাদেশের রিয়েল এস্টেট বাজারে স্বচ্ছতা এবং আধুনিক প্রযুক্তি ব্যবহারের মাধ্যমে জমি কেনা-বেচার প্রক্রিয়াকে সাধারণ মানুষের জন্য সহজতর করা। আমরা বিশ্বাস করি একটি টুকরো জমি কেবল সম্পত্তি নয়, এটি একটি পরিবারের ভবিষ্যৎ উত্তরাধিকার।'
                : 'Jomi Lagbe aims to simplify the land buying and selling process for common people through transparency and modern technology in Bangladesh\'s real estate market. We believe a piece of land is not just property—it is a family\'s future legacy.'}
            </p>
            <AnimatedSection stagger={0.15} delay={0.3} className="flex gap-6">
              <div className="bg-card border border-border rounded-2xl p-6 text-center min-w-[140px] hover-lift">
                <span className="text-3xl font-bold text-primary block">১০+</span>
                <span className="text-muted-foreground text-sm">
                  {lang === 'bn' ? 'বছরের অভিজ্ঞতা' : 'Years Experience'}
                </span>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 text-center min-w-[140px] hover-lift">
                <span className="text-3xl font-bold text-primary block">৫০০০+</span>
                <span className="text-muted-foreground text-sm">
                  {lang === 'bn' ? 'সফল ডিল' : 'Successful Deals'}
                </span>
              </div>
            </AnimatedSection>
          </AnimatedSection>
          <AnimatedSection direction="right" delay={0.2}>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
                alt="Aerial view of green agricultural fields"
                className="w-full h-[400px] md:h-[500px] object-cover rounded-3xl shadow-lg"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Bento Grid - Why We're Different */}
      <section className="px-6 md:px-12 py-16 md:py-24 max-w-screen-2xl mx-auto">
        <AnimatedSection direction="up" className="text-center mb-14">
          <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">
            {lang === 'bn' ? 'কেন আমরা আলাদা?' : 'Why We\'re Different?'}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {lang === 'bn'
              ? 'আমাদের সেবার মূল ভিত্তি হলো সততা এবং আধুনিক প্রযুক্তি'
              : 'Our service is built on honesty and modern technology'}
          </p>
        </AnimatedSection>

        <AnimatedSection stagger={0.12} className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="md:col-span-2 bg-card border border-border rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-start hover-lift group">
            <div className="flex-1">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {lang === 'bn' ? 'যাচাইকৃত লিস্টিং' : 'Verified Listings'}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {lang === 'bn'
                  ? 'আমাদের প্রতিটি জমি ব্যক্তিগতভাবে বিশেষজ্ঞ দল দ্বারা যাচাই করা হয়। কাগজের বৈধতা থেকে শুরু করে সরেজমিনে পরিদর্শন—সবকিছু আমরাই নিশ্চিত করি।'
                  : 'Every property is personally verified by our expert team. From document validity to on-site inspection—we ensure everything.'}
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80"
              alt="Verified property"
              className="w-full md:w-[200px] h-[160px] object-cover rounded-2xl"
            />
          </div>

          {/* Card 2 */}
          <div className="bg-primary rounded-3xl p-8 text-primary-foreground hover-lift">
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-2xl flex items-center justify-center mb-4">
              <Map className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">
              {lang === 'bn' ? 'আধুনিক ম্যাপ সুবিধা' : 'Modern Map Feature'}
            </h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              {lang === 'bn'
                ? 'সরাসরি গুগল ম্যাপ ইন্টিগ্রেশনের মাধ্যমে জমির সঠিক অবস্থান এবং চারপাশের পরিবেশ ঘরে বসেই দেখুন।'
                : 'View exact land location and surrounding environment from home through direct Google Maps integration.'}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-card border border-border rounded-3xl p-8 hover-lift">
            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              {lang === 'bn' ? 'নিরাপদ পেমেন্ট' : 'Secure Payment'}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {lang === 'bn'
                ? 'সম্পূর্ণ ক্যাশলেস এবং স্বচ্ছ ট্রানজাকশন পদ্ধতি যা আপনার অর্থের নিরাপত্তা নিশ্চিত করে।'
                : 'Completely cashless and transparent transaction system that ensures the security of your money.'}
            </p>
          </div>

          {/* Card 4 */}
          <div className="md:col-span-2 bg-card border border-border rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-start hover-lift group">
            <div className="flex-1">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4">
                <Headphones className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {lang === 'bn' ? '২৪/৭ সাপোর্ট' : '24/7 Support'}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {lang === 'bn'
                  ? 'যেকোনো আইনি জটিলতা বা জমির তথ্য জানতে আমাদের কল করুন। আমাদের বিশেষজ্ঞ দল আপনার সহায়তায় সর্বদা প্রস্তুত।'
                  : 'Call us for any legal complexities or land information. Our expert team is always ready to assist you.'}
              </p>
              <Link to="/contact">
                <Button className="bg-primary text-primary-foreground rounded-xl font-bold px-6">
                  {lang === 'bn' ? 'কথা বলুন বিশেষজ্ঞের সাথে' : 'Talk to an Expert'}
                </Button>
              </Link>
            </div>
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80"
              alt="Support team"
              className="w-full md:w-[200px] h-[160px] object-cover rounded-2xl"
            />
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
};

export default About;
