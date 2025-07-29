import React, { useEffect } from 'react';
import { env } from '@/utils/env';
import { type ClassValue } from 'clsx';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = 'Convierte tu chatarra electrónica en dinero de forma segura y sostenible con nuestra plataforma líder en reciclaje.',
  keywords = 'chatarra electrónica, reciclaje, dinero, sostenible, dispositivos, venta',
  image = '/images/og-image.jpg',
  url,
  type = 'website',
  noIndex = false,
}) => {
  const siteTitle = env.APP_NAME;
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Function to update or create meta tag
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      const selector = `meta[${attribute}="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Function to update or create link tag
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      
      element.setAttribute('href', href);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', siteTitle);
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    
    if (noIndex) {
      updateMetaTag('robots', 'noindex,nofollow');
    } else {
      updateMetaTag('robots', 'index,follow');
    }

    // Open Graph / Facebook
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:site_name', siteTitle, true);

    // Twitter Cards
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Additional SEO meta tags
    updateMetaTag('theme-color', '#2563eb'); // Primary color
    updateMetaTag('msapplication-TileColor', '#2563eb');
    updateMetaTag('application-name', siteTitle);

    // Canonical URL
    updateLinkTag('canonical', currentUrl);

    // Optional: Add structured data for better SEO
    const addStructuredData = () => {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteTitle,
        "url": currentUrl,
        "description": description,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${currentUrl}?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };

      let scriptElement = document.querySelector('script[type="application/ld+json"]');
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        // scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      
      scriptElement.textContent = JSON.stringify(structuredData);
    };

    addStructuredData();

  }, [fullTitle, description, keywords, image, currentUrl, type, noIndex, siteTitle]);

  // This component doesn't render anything visible
  return null;
};