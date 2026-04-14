import { useEffect, useState, useRef, ReactNode } from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  url: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
  fallback?: ReactNode;
}

const LottieAnimation = ({ url, className = '', loop = true, autoplay = true, style, fallback }: LottieAnimationProps) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [error, setError] = useState(false);
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then(data => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => { cancelled = true; };
  }, [url]);

  if (error || !animationData) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <Lottie
      animationData={animationData}
      loop={prefersReducedMotion.current ? false : loop}
      autoplay={prefersReducedMotion.current ? false : autoplay}
      className={className}
      style={style}
    />
  );
};

export default LottieAnimation;
