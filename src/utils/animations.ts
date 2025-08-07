// Función para lazy loading de animaciones
export const lazyLoadAnimation = (
  element: HTMLElement, 
  animationClass: string,
  threshold = 0.1
) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold });

  observer.observe(element);
  
  return () => observer.disconnect();
};

// Función para contadores animados con easing
export const animateNumber = (
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void,
  easing: 'linear' | 'easeOut' | 'easeInOut' = 'easeOut'
) => {
  const startTime = performance.now();
  
  const easingFunctions = {
    linear: (t: number) => t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
    easeInOut: (t: number) => t < 0.5 
      ? 4 * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 3) / 2
  };
  
  const update = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easedProgress = easingFunctions[easing](progress);
    const current = start + (end - start) * easedProgress;
    
    callback(Math.floor(current));
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };
  
  requestAnimationFrame(update);
};

// Función para animar múltiples números de forma escalonada
export const animateMultipleNumbers = (
  targets: Array<{
    start: number;
    end: number;
    callback: (value: number) => void;
    delay?: number;
  }>,
  duration = 2000,
  easing: 'linear' | 'easeOut' | 'easeInOut' = 'easeOut'
) => {
  targets.forEach((target, index) => {
    const delay = target.delay || index * 100;
    
    setTimeout(() => {
      animateNumber(
        target.start, 
        target.end, 
        duration, 
        target.callback, 
        easing
      );
    }, delay);
  });
};

// Función para crear efectos de partículas
export const createParticleEffect = (
  container: HTMLElement,
  particleCount = 20,
  particleClass = 'particle',
  duration = 3000
) => {
  const particles: HTMLElement[] = [];
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = particleClass;
    
    // Posición inicial aleatoria
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 2}s`;
    particle.style.animationDuration = `${duration}ms`;
    
    container.appendChild(particle);
    particles.push(particle);
  }
  
  // Limpiar partículas después de la animación
  setTimeout(() => {
    particles.forEach(particle => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
  }, duration + 2000);
  
  return particles;
};

// Función para scroll suave con callback
export const smoothScrollTo = (
  target: HTMLElement | string,
  duration = 1000,
  offset = 0,
  callback?: () => void
) => {
  const targetElement = typeof target === 'string' 
    ? document.querySelector(target) as HTMLElement
    : target;
    
  if (!targetElement) return;
  
  const startPosition = window.pageYOffset;
  const targetPosition = targetElement.offsetTop - offset;
  const distance = targetPosition - startPosition;
  const startTime = performance.now();
  
  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };
  
  const animation = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    
    window.scrollTo(0, startPosition + (distance * ease));
    
    if (progress < 1) {
      requestAnimationFrame(animation);
    } else if (callback) {
      callback();
    }
  };
  
  requestAnimationFrame(animation);
};

// Función para detectar si las animaciones están deshabilitadas
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Función para aplicar animaciones condicionalmente
export const applyAnimationIfEnabled = (
  element: HTMLElement,
  animationClass: string,
  fallbackClass?: string
) => {
  if (prefersReducedMotion()) {
    if (fallbackClass) {
      element.classList.add(fallbackClass);
    }
  } else {
    element.classList.add(animationClass);
  }
};

// Función para crear ripple effect
export const createRippleEffect = (
  event: MouseEvent,
  element: HTMLElement,
  color = 'rgba(255, 255, 255, 0.3)'
) => {
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: ${color};
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    pointer-events: none;
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
  `;
  
  // Agregar keyframes si no existen
  if (!document.querySelector('#ripple-keyframes')) {
    const style = document.createElement('style');
    style.id = 'ripple-keyframes';
    style.textContent = `
      @keyframes ripple-animation {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);
  
  // Remover el ripple después de la animación
  setTimeout(() => {
    ripple.remove();
  }, 600);
};

// Función para observer de performance de animaciones
export const observeAnimationPerformance = (
  element: HTMLElement,
  animationName: string
) => {
  let startTime = 0;
  let animationFrames = 0;
  
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.name === animationName) {
        console.log(`Animation ${animationName} performance:`, {
          duration: entry.duration,
          startTime: entry.startTime,
          fps: animationFrames / (entry.duration / 1000)
        });
      }
    });
  });
  
  observer.observe({ entryTypes: ['measure'] });
  
  const animationStart = () => {
    startTime = performance.now();
    animationFrames = 0;
  };
  
  const animationFrame = () => {
    animationFrames++;
    requestAnimationFrame(animationFrame);
  };
  
  const animationEnd = () => {
    const endTime = performance.now();
    performance.measure(animationName, 'animation-start', 'animation-end');
    observer.disconnect();
  };
  
  // Marcar puntos de referencia
  performance.mark('animation-start');
  animationStart();
  requestAnimationFrame(animationFrame);
  
  // El elemento debe llamar a animationEnd cuando termine
  return { animationEnd };
};

// Utilidades para trabajar con CSS Custom Properties (variables)
export const setCSSVariable = (property: string, value: string) => {
  document.documentElement.style.setProperty(`--${property}`, value);
};

export const getCSSVariable = (property: string): string => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${property}`)
    .trim();
};

// Función para animar CSS custom properties
export const animateCSSProperty = (
  element: HTMLElement,
  property: string,
  startValue: number,
  endValue: number,
  duration = 1000,
  unit = 'px'
) => {
  const startTime = performance.now();
  
  const update = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = startValue + (endValue - startValue) * progress;
    
    element.style.setProperty(`--${property}`, `${current}${unit}`);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };
  
  requestAnimationFrame(update);
};