import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Auth = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const initialMode = searchParams.get('mode') === 'register' ? false : true;
  const [isLogin, setIsLogin] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{isLogin ? t('loginTitle') : t('registerTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input placeholder={t('fullName')} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            )}
            <Input type="email" placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('loading') : isLogin ? t('login') : t('register')}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isLogin ? t('noAccount') : t('hasAccount')}{' '}
            <button className="text-primary underline" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? t('register') : t('login')}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
