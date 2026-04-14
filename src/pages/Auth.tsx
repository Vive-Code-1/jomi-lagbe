import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import LottieAnimation from '@/components/LottieAnimation';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

const Auth = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const initialMode = searchParams.get('mode') === 'register' ? false : true;
  const [isLogin, setIsLogin] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      }
      toast.success(t('success'));
      navigate(redirectTo);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const isLovableHost = window.location.hostname.endsWith('.lovable.app');

      if (isLovableHost) {
        // Lovable managed OAuth
        const result = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: window.location.origin,
        });

        if (result.error) {
          toast.error(result.error.message || (lang === 'bn' ? 'Google লগইনে সমস্যা হয়েছে' : 'Google login failed'));
          return;
        }

        if (result.redirected) {
          return;
        }

        toast.success(t('success'));
        navigate(redirectTo);
      } else {
        // Supabase native OAuth (Vercel / custom domain)
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        });
        if (error) throw error;
        return; // browser redirects to Google
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Branding Panel - Desktop only */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(135deg, hsl(150, 100%, 15%) 0%, hsl(150, 80%, 8%) 100%)',
        }}
      >
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(43, 100%, 50%) 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, hsl(43, 100%, 50%) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Top - Brand */}
        <div className="relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">{lang === 'bn' ? 'হোমে ফিরুন' : 'Back to Home'}</span>
          </button>
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            জমি লাগবে
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mb-6" />
        </div>

        {/* Center - Headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center">
          <LottieAnimation
            url="https://assets10.lottiefiles.com/packages/lf20_uu0x8lqv.json"
            className="w-48 h-48 mb-8"
          />
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {lang === 'bn' ? 'আপনার ভবিষ্যতের' : 'Build the'}
            <br />
            <span className="text-accent">{lang === 'bn' ? 'ভিত্তি গড়ে তুলুন' : 'Foundation of Your Future'}</span>
          </h2>
          <p className="text-white/60 text-lg max-w-sm" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            {lang === 'bn'
              ? 'বাংলাদেশের সবচেয়ে বিশ্বস্ত জমি কেনা-বেচার প্ল্যাটফর্ম'
              : 'Bangladesh\'s most trusted land buying and selling platform'}
          </p>
        </div>

        {/* Bottom - Tagline */}
        <div className="relative z-10">
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "'Noto Serif', serif" }}>
            THE HERITAGE MODERNIST
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-1/2 flex flex-col min-h-screen bg-white">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">{lang === 'bn' ? 'ফিরুন' : 'Back'}</span>
          </button>
          <h1 className="text-xl font-bold text-primary" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            জমি লাগবে
          </h1>
          <div className="w-16" />
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 md:px-12 lg:px-20">
          <div className="w-full max-w-md space-y-8">
            {/* Heading */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                {isLogin
                  ? (lang === 'bn' ? 'স্বাগতম' : 'Welcome Back')
                  : (lang === 'bn' ? 'নতুন একাউন্ট তৈরি করুন' : 'Create New Account')}
              </h2>
              <p className="text-muted-foreground">
                {isLogin
                  ? (lang === 'bn' ? 'আপনার একাউন্টে লগইন করুন' : 'Sign in to your account')
                  : (lang === 'bn' ? 'আপনার তথ্য দিয়ে রেজিস্ট্রেশন সম্পন্ন করুন' : 'Fill in your details to register')}
              </p>
            </div>

            {/* Google Login */}
            <Button
              variant="outline"
              className="w-full h-12 gap-3 rounded-xl border-border hover:bg-muted/50 text-foreground font-medium"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {googleLoading
                ? (lang === 'bn' ? 'লগইন হচ্ছে...' : 'Signing in...')
                : (lang === 'bn' ? 'Google দিয়ে চালিয়ে যান' : 'Continue with Google')}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground font-medium">{lang === 'bn' ? 'অথবা ইমেইল দিয়ে' : 'or with email'}</span>
              <Separator className="flex-1" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground font-medium">
                    {lang === 'bn' ? 'পুরো নাম' : 'Full Name'}
                  </Label>
                  <Input
                    id="fullName"
                    placeholder={lang === 'bn' ? 'আপনার পুরো নাম লিখুন' : 'Enter your full name'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="h-12 rounded-xl bg-muted/30 border-border focus:border-primary px-4"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  {lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={lang === 'bn' ? 'example@email.com' : 'example@email.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-muted/30 border-border focus:border-primary px-4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={lang === 'bn' ? '••••••••' : '••••••••'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12 rounded-xl bg-muted/30 border-border focus:border-primary px-4"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-bold"
                style={{
                  background: 'linear-gradient(135deg, hsl(150, 100%, 15%) 0%, hsl(150, 80%, 8%) 100%)',
                }}
                disabled={loading}
              >
                {loading
                  ? (lang === 'bn' ? 'অপেক্ষা করুন...' : 'Please wait...')
                  : isLogin
                    ? (lang === 'bn' ? 'লগ ইন করুন' : 'Sign In')
                    : (lang === 'bn' ? 'একাউন্ট তৈরি করুন' : 'Create Account')}
              </Button>
            </form>

            {/* Toggle */}
            <p className="text-center text-sm text-muted-foreground">
              {isLogin
                ? (lang === 'bn' ? 'একাউন্ট নেই?' : "Don't have an account?")
                : (lang === 'bn' ? 'ইতোমধ্যে একাউন্ট আছে?' : 'Already have an account?')}
              {' '}
              <button
                className="text-primary font-semibold hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin
                  ? (lang === 'bn' ? 'নতুন একাউন্ট খুলুন' : 'Create Account')
                  : (lang === 'bn' ? 'লগ ইন করুন' : 'Sign In')}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} জমি লাগবে। {lang === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
