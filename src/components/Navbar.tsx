import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { Heart, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { t, lang, setLang } = useI18n();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          🏡 JomiSheba
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary">{t('home')}</Link>
          <Link to="/listings" className="text-sm font-medium text-foreground hover:text-primary">{t('listings')}</Link>
          <Link to="/packages" className="text-sm font-medium text-foreground hover:text-primary">{t('adPackages')}</Link>
          {user && (
            <Link to="/favorites" className="text-sm font-medium text-foreground hover:text-primary">
              <Heart className="inline h-4 w-4 mr-1" />{t('favorites')}
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-foreground hover:text-primary">{t('admin')}</Link>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}>
            <Globe className="h-4 w-4 mr-1" />
            {lang === 'bn' ? 'EN' : 'বাং'}
          </Button>
          {user ? (
            <Button variant="outline" size="sm" onClick={() => { signOut(); navigate('/'); }}>
              {t('logout')}
            </Button>
          ) : (
            <Button size="sm" onClick={() => navigate('/auth')}>
              {t('login')}
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-background p-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium">{t('home')}</Link>
            <Link to="/listings" onClick={() => setMobileOpen(false)} className="text-sm font-medium">{t('listings')}</Link>
            <Link to="/packages" onClick={() => setMobileOpen(false)} className="text-sm font-medium">{t('adPackages')}</Link>
            {user && <Link to="/favorites" onClick={() => setMobileOpen(false)} className="text-sm font-medium">{t('favorites')}</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium">{t('admin')}</Link>}
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}>
              <Globe className="h-4 w-4 mr-1" />{lang === 'bn' ? 'EN' : 'বাং'}
            </Button>
            {user ? (
              <Button variant="outline" size="sm" onClick={() => { signOut(); navigate('/'); setMobileOpen(false); }}>
                {t('logout')}
              </Button>
            ) : (
              <Button size="sm" onClick={() => { navigate('/auth'); setMobileOpen(false); }}>
                {t('login')}
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
