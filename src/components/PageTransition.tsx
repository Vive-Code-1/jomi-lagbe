import { useEffect, useRef, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [location.pathname]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};

export default PageTransition;
