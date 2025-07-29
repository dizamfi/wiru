import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { env } from '@/utils/env';

interface UseSEOOptions {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

export const useSEO = ({
  title,
  description = 'Convierte tu chatarra electrónica en dinero de forma segura y sostenible.',
  keywords = 'chatarra electrónica, reciclaje, dinero, sostenible',
  image = '/images/og-image.jpg',
  type = 'website',
  noIndex = false,
}: UseSEOOptions = {}) => {
  const location = useLocation();

  useEffect(() => {
    const siteTitle = env.APP_NAME;
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const currentUrl = window.location.origin + location.pathname;

    // Update title
    document.title = fullTitle;

    // Update meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    };

    // Basic meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    
    if (noIndex) {
      updateMeta('robots', 'noindex,nofollow');
    }

    // Open Graph
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', image, true);
    updateMeta('og:url', currentUrl, true);
    updateMeta('og:type', type, true);

    // Twitter
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    updateMeta('twitter:card', 'summary_large_image');

  }, [title, description, keywords, image, type, noIndex, location.pathname]);

  return {
    setTitle: (newTitle: string) => {
      document.title = newTitle;
    },
    setDescription: (newDescription: string) => {
      const meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (meta) meta.content = newDescription;
    }
  };
};