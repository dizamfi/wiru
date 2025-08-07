import { useEffect, useState, useRef } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { freezeOnceVisible = false, ...observerOptions } = options;

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      const isVisible = entry.isIntersecting;
      
      setIsIntersecting(isVisible);
      
      if (isVisible && !hasBeenVisible) {
        setHasBeenVisible(true);
      }
      
      // Si freezeOnceVisible está habilitado y ya fue visible, 
      // desconectamos el observer
      if (freezeOnceVisible && hasBeenVisible) {
        observer.unobserve(ref.current!);
      }
    }, observerOptions);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [observerOptions, freezeOnceVisible, hasBeenVisible]);

  return {
    ref,
    isIntersecting,
    hasBeenVisible,
    // Función para resetear el estado
    reset: () => {
      setIsIntersecting(false);
      setHasBeenVisible(false);
    }
  };
};

// Hook específico para animaciones de entrada
export const useScrollAnimation = (
  animationClass = 'animate-slide-up',
  options: UseIntersectionObserverOptions = {}
) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
    ...options
  });

  useEffect(() => {
    if (isIntersecting && !hasAnimated && ref.current) {
      ref.current.classList.add(animationClass);
      setHasAnimated(true);
    }
  }, [isIntersecting, hasAnimated, animationClass]);

  return { ref, isVisible: isIntersecting, hasAnimated };
};

// Hook para múltiples elementos con animaciones escalonadas
export const useStaggeredAnimation = (
  itemCount: number,
  delay = 100,
  animationClass = 'animate-slide-up'
) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true
  });

  useEffect(() => {
    if (isIntersecting) {
      // Animar elementos de forma escalonada
      visibleItems.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * delay);
      });
    }
  }, [isIntersecting, itemCount, delay]);

  const getItemProps = (index: number) => ({
    className: visibleItems[index] ? animationClass : 'opacity-0',
    style: { animationDelay: `${index * delay}ms` }
  });

  return { ref, getItemProps, isVisible: isIntersecting };
};