import './PageHeader.css';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  iconSrc?: string;
}

export function PageHeader({ title, subtitle, iconSrc }: PageHeaderProps) {
  return (
    <header className="page-header-container">
      <div className="page-header-title-row">
        {iconSrc && (
          <img src={iconSrc} alt="" className="page-header-icon" />
        )}
        <h1 className="page-header">{title}</h1>
      </div>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </header>
  );
}
