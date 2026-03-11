import { useAbout } from '../../hooks/useAbout';
import { renderRichText } from '../../utils/renderRichText';
import { PageHeader } from '../shared/PageHeader';
import './AboutPage.css';

export function AboutPage() {
  const { data: aboutData, isLoading, error } = useAbout();

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
          {error?.message || 'No about page content available'}
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
