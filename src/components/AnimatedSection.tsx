import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade';

interface AnimatedSectionProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  stagger?: number;
  distance?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  stagger = 0,
  distance = 60,
  className = '',
  as: Tag = 'div',
}) => {
  const ref = useScrollAnimation<HTMLDivElement>({
    direction,
    delay,
    duration,
    stagger,
    distance,
  });

  return (
    // @ts-ignore
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
};

export default AnimatedSection;
