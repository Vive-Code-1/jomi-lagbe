import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { Heart, Menu, X, Globe, Bell, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { t, lang, setLang } = useI18n();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md">
      <div className="relative flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
        {/* Logo - Left */}
        <Link to="/" className="text-2xl font-bold text-primary shrink-0">
          জমি লাগবে
        </Link>

        {/* Nav Links - Center */}
        <div className="hidden md:flex gap-6 items-center absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="text-primary font-bold border-b-2 border-secondary pb-1 text-sm tracking-tight whitespace-nowrap">
            {t('home')}
          </Link>
          <Link to="/listings" className="text-on-surface-variant font-medium text-sm tracking-tight hover:text-primary transition-colors duration-200 whitespace-nowrap">
            {t('listings')}
          </Link>
          <Link to="/packages" className="text-on-surface-variant font-medium text-sm tracking-tight hover:text-primary transition-colors duration-200 whitespace-nowrap">
            {t('adPackages')}
          </Link>
          <Link to="/about" className="text-on-surface-variant font-medium text-sm tracking-tight hover:text-primary transition-colors duration-200 whitespace-nowrap">
            {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
          </Link>
          <Link to="/contact" className="text-on-surface-variant font-medium text-sm tracking-tight hover:text-primary transition-colors duration-200 whitespace-nowrap">
            {lang === 'bn' ? 'যোগাযোগ' : 'Contact'}
          </Link>
          {user && (
            <Link to="/favorites" className="text-on-surface-variant font-medium text-sm tracking-tight hover:text-primary transition-colors duration-200 whitespace-nowrap">
              {t('favorites')}
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-on-surface-variant font-medium text-sm tracking-tight hover:text-primary transition-colors duration-200 whitespace-nowrap">
              {t('admin')}
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="text-primary hover:text-primary"
          >
            <Globe className="h-4 w-4 mr-1" />
            {lang === 'bn' ? 'EN' : 'বাং'}
          </Button>
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="text-primary">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => { signOut(); navigate('/'); }} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                {t('logout')}
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate('/auth')}
              className="bg-primary text-primary-foreground rounded-lg font-bold px-6"
            >
              {t('login')}
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden text-primary" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="bg-background p-6 md:hidden">
          <div className="flex flex-col gap-4">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-primary font-semibold">{t('home')}</Link>
            <Link to="/listings" onClick={() => setMobileOpen(false)} className="text-on-surface-variant font-medium">{t('listings')}</Link>
            <Link to="/packages" onClick={() => setMobileOpen(false)} className="text-on-surface-variant font-medium">{t('adPackages')}</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="text-on-surface-variant font-medium">{lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="text-on-surface-variant font-medium">{lang === 'bn' ? 'যোগাযোগ' : 'Contact'}</Link>
            {user && <Link to="/favorites" onClick={() => setMobileOpen(false)} className="text-on-surface-variant font-medium">{t('favorites')}</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-on-surface-variant font-medium">{t('admin')}</Link>}
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')} className="justify-start text-primary">
              <Globe className="h-4 w-4 mr-1" />{lang === 'bn' ? 'EN' : 'বাং'}
            </Button>
            {user ? (
              <Button variant="outline" size="sm" onClick={() => { signOut(); navigate('/'); setMobileOpen(false); }} className="border-primary text-primary">
                {t('logout')}
              </Button>
            ) : (
              <Button size="sm" onClick={() => { navigate('/auth'); setMobileOpen(false); }} className="bg-primary text-primary-foreground">
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
