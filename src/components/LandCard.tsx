import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { MapPin, Ruler, Route } from 'lucide-react';

interface LandCardProps {
  id: string;
  title_bn: string;
  title_en: string;
  price: number;
  area_size: number;
  location_bn: string;
  location_en: string;
  road_width: number;
  images: string[];
  is_featured: boolean;
}

const LandCard = ({
  id, title_bn, title_en, price, area_size,
  location_bn, location_en, road_width, images, is_featured,
}: LandCardProps) => {
  const { t, lang } = useI18n();
  const title = lang === 'bn' ? title_bn : title_en;
  const location = lang === 'bn' ? location_bn : location_en;

  return (
    <Link to={`/land/${id}`}>
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm group border border-outline-variant/30 hover-lift">
        <div className="relative h-64 overflow-hidden">
          <img
            src={images?.[0] || '/placeholder.svg'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <span className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-bold text-sm shadow-md">
            {t('taka')}{price.toLocaleString()}
          </span>
          {is_featured && (
            <div className="absolute bottom-4 left-4">
              <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase">
                {t('featured')}
              </span>
            </div>
          )}
        </div>
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 text-outline mb-3">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-xs font-bold uppercase tracking-wider">{location}</span>
          </div>
          <h3 className="font-headline text-lg md:text-xl font-bold text-primary mb-4 leading-snug line-clamp-2">{title}</h3>
          <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/30 pt-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <Ruler className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-outline font-bold uppercase">{lang === 'bn' ? 'পরিমাণ' : 'Size'}</p>
                <p className="font-bold text-sm text-on-surface">{area_size} {t('decimal')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <Route className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-outline font-bold uppercase">{lang === 'bn' ? 'রাস্তা' : 'Road'}</p>
                <p className="font-bold text-sm text-on-surface">{road_width} {t('feet')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LandCard;
