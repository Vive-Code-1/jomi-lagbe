import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade';

interface ScrollAnimationOptions {
  direction?: Direction;
  delay?: number;
  duration?: number;
  stagger?: number;
  distance?: number;
  once?: boolean;
}

const getFromVars = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'up': return { y: distance, opacity: 0 };
    case 'down': return { y: -distance, opacity: 0 };
    case 'left': return { x: distance, opacity: 0 };
    case 'right': return { x: -distance, opacity: 0 };
    case 'fade': return { opacity: 0 };
  }
};

export const useScrollAnimation = <T extends HTMLElement = HTMLDivElement>(
  options: ScrollAnimationOptions = {}
) => {
  const ref = useRef<T>(null);
  const {
    direction = 'up',
    delay = 0,
    duration = 0.8,
    stagger = 0,
    distance = 60,
    once = true,
  } = options;

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !ref.current) return;

    const el = ref.current;
    const children = stagger > 0 ? el.children : [el];
    const fromVars = getFromVars(direction, distance);

    const tween = gsap.fromTo(
      children,
      fromVars,
      {
        ...Object.fromEntries(Object.keys(fromVars).map(k => [k, k === 'opacity' ? 1 : 0])),
        duration,
        delay,
        stagger: stagger > 0 ? stagger : 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: once ? 'play none none none' : 'play none none reverse',
        },
      }
    );

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [direction, delay, duration, stagger, distance, once]);

  return ref;
};

export const useCountUp = (end: number, duration = 2) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !ref.current) return;

    const el = ref.current;
    const obj = { val: 0 };

    const tween = gsap.to(obj, {
      val: end,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        if (el) el.textContent = Math.round(obj.val).toLocaleString('bn-BD');
      },
    });

    return () => {
      tween.kill();
    };
  }, [end, duration]);

  return ref;
};

export default useScrollAnimation;
