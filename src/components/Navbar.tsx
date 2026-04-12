import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { Heart, Menu, X, Globe, Bell, User, Plus } from 'lucide-react';
import { useState } from 'react';

const activeClass = "text-primary font-bold border-b-2 border-secondary pb-1 text-sm tracking-tight whitespace-nowrap";
const inactiveClass = "text-on-surface-variant font-medium text-sm tracking-tight hover:text-primary transition-colors duration-200 whitespace-nowrap";
const mobileActiveClass = "text-primary font-semibold";
const mobileInactiveClass = "text-on-surface-variant font-medium";

const Navbar = () => {
  const { t, lang, setLang } = useI18n();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) => isActive ? activeClass : inactiveClass;
  const mobileLinkClass = ({ isActive }: { isActive: boolean }) => isActive ? mobileActiveClass : mobileInactiveClass;

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md">
      <div className="relative flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-primary shrink-0">
          জমি লাগবে
        </Link>

        <div className="hidden md:flex gap-6 items-center absolute left-1/2 -translate-x-1/2">
          <NavLink to="/" end className={linkClass}>{t('home')}</NavLink>
          <NavLink to="/listings" className={linkClass}>{t('listings')}</NavLink>
          <NavLink to="/packages" className={linkClass}>{t('adPackages')}</NavLink>
          <NavLink to="/about" className={linkClass}>{lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</NavLink>
          <NavLink to="/contact" className={linkClass}>{lang === 'bn' ? 'যোগাযোগ' : 'Contact'}</NavLink>
          {user && <NavLink to="/favorites" className={linkClass}>{t('favorites')}</NavLink>}
          {isAdmin && <NavLink to="/admin" className={linkClass}>{t('admin')}</NavLink>}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Button variant="ghost" size="sm" onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')} className="text-primary hover:text-primary">
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
            <Button size="sm" onClick={() => navigate('/auth')} className="bg-primary text-primary-foreground rounded-lg font-bold px-6">
              {t('login')}
            </Button>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden text-primary" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="bg-background p-6 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink to="/" end onClick={() => setMobileOpen(false)} className={mobileLinkClass}>{t('home')}</NavLink>
            <NavLink to="/listings" onClick={() => setMobileOpen(false)} className={mobileLinkClass}>{t('listings')}</NavLink>
            <NavLink to="/packages" onClick={() => setMobileOpen(false)} className={mobileLinkClass}>{t('adPackages')}</NavLink>
            <NavLink to="/about" onClick={() => setMobileOpen(false)} className={mobileLinkClass}>{lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</NavLink>
            <NavLink to="/contact" onClick={() => setMobileOpen(false)} className={mobileLinkClass}>{lang === 'bn' ? 'যোগাযোগ' : 'Contact'}</NavLink>
            {user && <NavLink to="/favorites" onClick={() => setMobileOpen(false)} className={mobileLinkClass}>{t('favorites')}</NavLink>}
            {isAdmin && <NavLink to="/admin" onClick={() => setMobileOpen(false)} className={mobileLinkClass}>{t('admin')}</NavLink>}
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
