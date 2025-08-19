import { useState, useEffect } from 'react';

interface UseRiveAnimationProps {
  src: string;
  autoplay?: boolean;
  preload?: boolean;
}

interface UseRiveAnimationReturn {
  isLoaded: boolean;
  hasError: boolean;
  retry: () => void;
}

export const useRiveAnimation = ({
  src,
  autoplay = true,
  preload = true
}: UseRiveAnimationProps): UseRiveAnimationReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const retry = () => {
    setHasError(false);
    setIsLoaded(false);
  };

  useEffect(() => {
    if (!preload) return;

    // Precargar la animación
    const preloadAnimation = async () => {
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error('Failed to load animation');
        setIsLoaded(true);
      } catch (error) {
        console.error('Error preloading Rive animation:', error);
        setHasError(true);
      }
    };

    preloadAnimation();
  }, [src, preload]);

  return {
    isLoaded,
    hasError,
    retry
  };
};