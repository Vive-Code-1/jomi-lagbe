import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={images?.[0] || '/placeholder.svg'}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
          {is_featured && (
            <Badge className="absolute left-2 top-2 bg-secondary text-secondary-foreground">
              {t('featured')}
            </Badge>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-3">
            <p className="text-lg font-bold text-primary-foreground">
              {t('taka')} {price.toLocaleString()}
            </p>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="mb-2 line-clamp-1 text-base font-semibold text-foreground">{title}</h3>
          <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{location}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Ruler className="h-3.5 w-3.5" />
                <span>{area_size} {t('decimal')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Route className="h-3.5 w-3.5" />
                <span>{road_width} {t('feet')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default LandCard;
