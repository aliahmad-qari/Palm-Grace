import { useEffect } from 'react';
import { Memorial } from '../../types/index.js';
import { calendarYear } from '../../lib/calendarDate.js';

export function useMemorialSEO(memorial: Memorial | null) {
  useEffect(() => {
    if (!memorial) return;

    const previousTitle = document.title;
    const birthYear = calendarYear(memorial.birthDate || memorial.dateOfBirth);
    const passYear = calendarYear(memorial.deathDate || memorial.dateOfPassing);
    const lifespanText = birthYear && passYear ? ` (${birthYear} – ${passYear})` : '';

    const pageTitle = `In Loving Memory of ${memorial.fullName}${lifespanText} | Palm & Grace`;
    document.title = pageTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attribute: string, attrValue: string, content: string): HTMLMetaElement => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
      return element;
    };

    const cleanDescription = (memorial.biography || memorial.memorialLine || `Remembering the life, memories and legacy of ${memorial.fullName}.`)
      .replace(/\s+/g, ' ')
      .slice(0, 160);

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    // Description & OpenGraph / Twitter tags
    setMetaTag('name', 'description', cleanDescription);
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', cleanDescription);
    setMetaTag('property', 'og:image', memorial.mainPhotograph);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', 'profile');
    setMetaTag('property', 'og:site_name', 'Palm & Grace');

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', cleanDescription);
    setMetaTag('name', 'twitter:image', memorial.mainPhotograph);

    // Schema.org Structured Data (JSON-LD)
    const scriptId = 'palm-grace-memorial-schema';
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: memorial.fullName,
      birthDate: memorial.showBirthDate !== false ? (memorial.birthDate || memorial.dateOfBirth)?.slice(0, 10) : undefined,
      deathDate: memorial.showDeathDate !== false ? (memorial.deathDate || memorial.dateOfPassing)?.slice(0, 10) : undefined,
      description: cleanDescription,
      image: memorial.mainPhotograph,
      url: currentUrl,
      sameAs: [memorial.livestreamUrl, memorial.recordingUrl].filter(Boolean),
    };

    scriptElement.textContent = JSON.stringify(structuredData);

    return () => {
      document.title = previousTitle;
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [memorial]);
}
