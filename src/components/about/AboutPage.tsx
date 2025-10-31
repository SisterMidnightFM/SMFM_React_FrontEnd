import { useEffect, useState } from 'react';
import { fetchAboutPage } from '../../services/about';
import { renderRichText } from '../../utils/renderRichText';
import { PageHeader } from '../shared/PageHeader';
import type { AboutPage as AboutPageType } from '../../types/about';
import './AboutPage.css';

export function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutPageType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAboutPage() {
      try {
        setIsLoading(true);
        const data = await fetchAboutPage();
        setAboutData(data);
      } catch (err) {
        console.error('Failed to load about page:', err);
        setError('Failed to load about page content');
      } finally {
        setIsLoading(false);
      }
    }

    loadAboutPage();
  }, []);

  if (isLoading) {
    return (
      <div className="about-page">
        <div className="about-page__loading">Loading...</div>
      </div>
    );
  }

  if (error || !aboutData) {
    return (
      <div className="about-page">
        <div className="about-page__error">
          {error || 'No about page content available'}
        </div>
      </div>
    );
  }

  return (
    <div className="about-page">
      <PageHeader
        title="ABOUT SMFM"
        iconSrc="/Images/Logo Brown.webp"
      />
      <div className="about-page__content">
        {renderRichText(aboutData.AboutPageText)}
      </div>
    </div>
  );
}
