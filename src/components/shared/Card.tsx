import { Link } from '@tanstack/react-router';
import type { StrapiImage } from '../../types/strapi';
import { NewBadge } from './NewBadge';
import './Card.css';

export interface CardProps {
  // Navigation
  to: string;
  params?: Record<string, string>;

  // Image
  image?: StrapiImage | null;
  imagePlaceholder?: string;
  circularImage?: boolean;

  // Text content
  headerText: string;
  descriptiveText?: string;
  descriptiveText2?: string;

  // Location
  location?: string;

  // Badge
  badge?: string;
  newBadge?: boolean;

  // Footer link
  footerLink?: {
    text: string;
    icon?: string;
  };

  // Tags
  tags?: Array<{
    id: number | string;
    label: string;
  }>;
  maxTags?: number;

  // Optional overrides
  className?: string;

  // Event handlers
  onMouseEnter?: () => void;
}

// SVG clip-path definitions for hand-drawn effect (rendered once globally)
export function CardClipPaths() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {/* ===== SUBTLE WOBBLE VARIATIONS (minimal hand-drawn effect) ===== */}
        <clipPath id="hand-drawn-subtle-1" clipPathUnits="objectBoundingBox">
          <path d="M 0.05,0.005 Q 0.02,0.005 0.01,0.035 Q 0.005,0.05 0.005,0.08 L 0.006,0.3 Q 0.005,0.5 0.006,0.7 L 0.005,0.92 Q 0.005,0.95 0.01,0.965 Q 0.02,0.995 0.05,0.995 L 0.3,0.994 Q 0.5,0.995 0.7,0.994 L 0.95,0.995 Q 0.98,0.995 0.99,0.965 Q 0.995,0.95 0.995,0.92 L 0.994,0.7 Q 0.995,0.5 0.994,0.3 L 0.995,0.08 Q 0.995,0.05 0.99,0.035 Q 0.98,0.005 0.95,0.005 L 0.7,0.006 Q 0.5,0.005 0.3,0.006 L 0.05,0.005 Z" />
        </clipPath>

        <clipPath id="hand-drawn-subtle-2" clipPathUnits="objectBoundingBox">
          <path d="M 0.048,0.006 Q 0.018,0.006 0.009,0.038 Q 0.006,0.052 0.006,0.085 L 0.005,0.35 Q 0.006,0.5 0.005,0.65 L 0.006,0.915 Q 0.006,0.948 0.009,0.962 Q 0.018,0.994 0.048,0.994 L 0.35,0.995 Q 0.5,0.994 0.65,0.995 L 0.952,0.994 Q 0.982,0.994 0.991,0.962 Q 0.994,0.948 0.994,0.915 L 0.995,0.65 Q 0.994,0.5 0.995,0.35 L 0.994,0.085 Q 0.994,0.052 0.991,0.038 Q 0.982,0.006 0.952,0.006 L 0.65,0.005 Q 0.5,0.006 0.35,0.005 L 0.048,0.006 Z" />
        </clipPath>

        <clipPath id="hand-drawn-subtle-3" clipPathUnits="objectBoundingBox">
          <path d="M 0.052,0.007 Q 0.022,0.007 0.01,0.04 Q 0.006,0.055 0.006,0.082 L 0.005,0.32 Q 0.006,0.52 0.005,0.68 L 0.006,0.918 Q 0.006,0.945 0.01,0.96 Q 0.022,0.993 0.052,0.993 L 0.32,0.994 Q 0.52,0.995 0.68,0.994 L 0.948,0.993 Q 0.978,0.993 0.99,0.96 Q 0.994,0.945 0.994,0.918 L 0.995,0.68 Q 0.994,0.52 0.995,0.32 L 0.994,0.082 Q 0.994,0.055 0.99,0.04 Q 0.978,0.007 0.948,0.007 L 0.68,0.006 Q 0.52,0.005 0.32,0.006 L 0.052,0.007 Z" />
        </clipPath>

        <clipPath id="hand-drawn-subtle-4" clipPathUnits="objectBoundingBox">
          <path d="M 0.047,0.006 Q 0.019,0.006 0.01,0.036 Q 0.006,0.051 0.006,0.079 L 0.005,0.28 Q 0.006,0.48 0.005,0.72 L 0.006,0.921 Q 0.006,0.949 0.01,0.964 Q 0.019,0.994 0.047,0.994 L 0.28,0.995 Q 0.48,0.994 0.72,0.995 L 0.953,0.994 Q 0.981,0.994 0.99,0.964 Q 0.994,0.949 0.994,0.921 L 0.995,0.72 Q 0.994,0.48 0.995,0.28 L 0.994,0.079 Q 0.994,0.051 0.99,0.036 Q 0.981,0.006 0.953,0.006 L 0.72,0.005 Q 0.48,0.006 0.28,0.005 L 0.047,0.006 Z" />
        </clipPath>

        <clipPath id="hand-drawn-subtle-5" clipPathUnits="objectBoundingBox">
          <path d="M 0.05,0.007 Q 0.021,0.007 0.01,0.039 Q 0.006,0.053 0.006,0.081 L 0.005,0.29 Q 0.006,0.51 0.005,0.71 L 0.006,0.919 Q 0.006,0.947 0.01,0.961 Q 0.021,0.993 0.05,0.993 L 0.29,0.994 Q 0.51,0.995 0.71,0.994 L 0.95,0.993 Q 0.979,0.993 0.99,0.961 Q 0.994,0.947 0.994,0.919 L 0.995,0.71 Q 0.994,0.51 0.995,0.29 L 0.994,0.081 Q 0.994,0.053 0.99,0.039 Q 0.979,0.007 0.95,0.007 L 0.71,0.006 Q 0.51,0.005 0.29,0.006 L 0.05,0.007 Z" />
        </clipPath>

        <clipPath id="hand-drawn-subtle-6" clipPathUnits="objectBoundingBox">
          <path d="M 0.049,0.006 Q 0.02,0.006 0.01,0.037 Q 0.006,0.05 0.006,0.08 L 0.005,0.33 Q 0.006,0.49 0.005,0.67 L 0.006,0.92 Q 0.006,0.95 0.01,0.963 Q 0.02,0.994 0.049,0.994 L 0.33,0.995 Q 0.49,0.994 0.67,0.995 L 0.951,0.994 Q 0.98,0.994 0.99,0.963 Q 0.994,0.95 0.994,0.92 L 0.995,0.67 Q 0.994,0.49 0.995,0.33 L 0.994,0.08 Q 0.994,0.05 0.99,0.037 Q 0.98,0.006 0.951,0.006 L 0.67,0.005 Q 0.49,0.006 0.33,0.005 L 0.049,0.006 Z" />
        </clipPath>

        {/* ===== MEDIUM WOBBLE VARIATIONS (default hand-drawn effect) ===== */}
        <clipPath id="hand-drawn-1" clipPathUnits="objectBoundingBox">
          <path d="M 0.05,0.008 Q 0.02,0.008 0.012,0.035 Q 0.01,0.05 0.01,0.08 L 0.012,0.3 Q 0.01,0.5 0.012,0.7 L 0.01,0.92 Q 0.01,0.95 0.012,0.965 Q 0.02,0.992 0.05,0.992 L 0.3,0.99 Q 0.5,0.988 0.7,0.99 L 0.95,0.992 Q 0.98,0.992 0.988,0.965 Q 0.99,0.95 0.99,0.92 L 0.988,0.7 Q 0.99,0.5 0.988,0.3 L 0.99,0.08 Q 0.99,0.05 0.988,0.035 Q 0.98,0.008 0.95,0.008 L 0.7,0.01 Q 0.5,0.012 0.3,0.01 L 0.05,0.008 Z" />
        </clipPath>

        <clipPath id="hand-drawn-2" clipPathUnits="objectBoundingBox">
          <path d="M 0.048,0.01 Q 0.018,0.01 0.01,0.038 Q 0.008,0.052 0.008,0.085 L 0.01,0.35 Q 0.012,0.5 0.01,0.65 L 0.008,0.915 Q 0.008,0.948 0.01,0.962 Q 0.018,0.99 0.048,0.99 L 0.35,0.992 Q 0.5,0.99 0.65,0.992 L 0.952,0.99 Q 0.982,0.99 0.99,0.962 Q 0.992,0.948 0.992,0.915 L 0.99,0.65 Q 0.988,0.5 0.99,0.35 L 0.992,0.085 Q 0.992,0.052 0.99,0.038 Q 0.982,0.01 0.952,0.01 L 0.65,0.008 Q 0.5,0.01 0.35,0.008 L 0.048,0.01 Z" />
        </clipPath>

        <clipPath id="hand-drawn-3" clipPathUnits="objectBoundingBox">
          <path d="M 0.052,0.012 Q 0.022,0.012 0.013,0.04 Q 0.01,0.055 0.01,0.082 L 0.008,0.32 Q 0.01,0.52 0.008,0.68 L 0.01,0.918 Q 0.01,0.945 0.013,0.96 Q 0.022,0.988 0.052,0.988 L 0.32,0.99 Q 0.52,0.992 0.68,0.99 L 0.948,0.988 Q 0.978,0.988 0.987,0.96 Q 0.99,0.945 0.99,0.918 L 0.992,0.68 Q 0.99,0.52 0.992,0.32 L 0.99,0.082 Q 0.99,0.055 0.987,0.04 Q 0.978,0.012 0.948,0.012 L 0.68,0.01 Q 0.52,0.008 0.32,0.01 L 0.052,0.012 Z" />
        </clipPath>

        <clipPath id="hand-drawn-4" clipPathUnits="objectBoundingBox">
          <path d="M 0.047,0.009 Q 0.019,0.009 0.011,0.036 Q 0.009,0.051 0.009,0.079 L 0.011,0.28 Q 0.009,0.48 0.011,0.72 L 0.009,0.921 Q 0.009,0.949 0.011,0.964 Q 0.019,0.991 0.047,0.991 L 0.28,0.989 Q 0.48,0.991 0.72,0.989 L 0.953,0.991 Q 0.981,0.991 0.989,0.964 Q 0.991,0.949 0.991,0.921 L 0.989,0.72 Q 0.991,0.48 0.989,0.28 L 0.991,0.079 Q 0.991,0.051 0.989,0.036 Q 0.981,0.009 0.953,0.009 L 0.72,0.011 Q 0.48,0.009 0.28,0.011 L 0.047,0.009 Z" />
        </clipPath>

        <clipPath id="hand-drawn-5" clipPathUnits="objectBoundingBox">
          <path d="M 0.05,0.011 Q 0.021,0.011 0.012,0.039 Q 0.01,0.053 0.01,0.081 L 0.012,0.29 Q 0.01,0.51 0.012,0.71 L 0.01,0.919 Q 0.01,0.947 0.012,0.961 Q 0.021,0.989 0.05,0.989 L 0.29,0.991 Q 0.51,0.989 0.71,0.991 L 0.95,0.989 Q 0.979,0.989 0.988,0.961 Q 0.99,0.947 0.99,0.919 L 0.988,0.71 Q 0.99,0.51 0.988,0.29 L 0.99,0.081 Q 0.99,0.053 0.988,0.039 Q 0.979,0.011 0.95,0.011 L 0.71,0.009 Q 0.51,0.011 0.29,0.009 L 0.05,0.011 Z" />
        </clipPath>

        <clipPath id="hand-drawn-6" clipPathUnits="objectBoundingBox">
          <path d="M 0.049,0.01 Q 0.02,0.01 0.011,0.037 Q 0.009,0.05 0.009,0.08 L 0.011,0.33 Q 0.009,0.49 0.011,0.67 L 0.009,0.92 Q 0.009,0.95 0.011,0.963 Q 0.02,0.99 0.049,0.99 L 0.33,0.992 Q 0.49,0.99 0.67,0.992 L 0.951,0.99 Q 0.98,0.99 0.989,0.963 Q 0.991,0.95 0.991,0.92 L 0.989,0.67 Q 0.991,0.49 0.989,0.33 L 0.991,0.08 Q 0.991,0.05 0.989,0.037 Q 0.98,0.01 0.951,0.01 L 0.67,0.008 Q 0.49,0.01 0.33,0.008 L 0.049,0.01 Z" />
        </clipPath>

        {/* ===== STRONG WOBBLE VARIATIONS (pronounced hand-drawn effect) ===== */}
        <clipPath id="hand-drawn-strong-1" clipPathUnits="objectBoundingBox">
          <path d="M 0.05,0.015 Q 0.02,0.012 0.015,0.035 Q 0.012,0.05 0.015,0.08 L 0.018,0.3 Q 0.012,0.5 0.018,0.7 L 0.015,0.92 Q 0.012,0.95 0.015,0.965 Q 0.02,0.988 0.05,0.985 L 0.3,0.982 Q 0.5,0.985 0.7,0.982 L 0.95,0.985 Q 0.98,0.988 0.985,0.965 Q 0.988,0.95 0.985,0.92 L 0.982,0.7 Q 0.988,0.5 0.982,0.3 L 0.985,0.08 Q 0.988,0.05 0.985,0.035 Q 0.98,0.012 0.95,0.015 L 0.7,0.018 Q 0.5,0.015 0.3,0.018 L 0.05,0.015 Z" />
        </clipPath>

        <clipPath id="hand-drawn-strong-2" clipPathUnits="objectBoundingBox">
          <path d="M 0.048,0.016 Q 0.018,0.013 0.013,0.038 Q 0.01,0.052 0.013,0.085 L 0.016,0.35 Q 0.018,0.5 0.016,0.65 L 0.013,0.915 Q 0.01,0.948 0.013,0.962 Q 0.018,0.987 0.048,0.984 L 0.35,0.987 Q 0.5,0.984 0.65,0.987 L 0.952,0.984 Q 0.982,0.987 0.987,0.962 Q 0.99,0.948 0.987,0.915 L 0.984,0.65 Q 0.982,0.5 0.984,0.35 L 0.987,0.085 Q 0.99,0.052 0.987,0.038 Q 0.982,0.013 0.952,0.016 L 0.65,0.013 Q 0.5,0.016 0.35,0.013 L 0.048,0.016 Z" />
        </clipPath>

        <clipPath id="hand-drawn-strong-3" clipPathUnits="objectBoundingBox">
          <path d="M 0.052,0.018 Q 0.022,0.015 0.016,0.04 Q 0.013,0.055 0.016,0.082 L 0.013,0.32 Q 0.015,0.52 0.013,0.68 L 0.016,0.918 Q 0.013,0.945 0.016,0.96 Q 0.022,0.985 0.052,0.982 L 0.32,0.985 Q 0.52,0.987 0.68,0.985 L 0.948,0.982 Q 0.978,0.985 0.984,0.96 Q 0.987,0.945 0.984,0.918 L 0.987,0.68 Q 0.985,0.52 0.987,0.32 L 0.984,0.082 Q 0.987,0.055 0.984,0.04 Q 0.978,0.015 0.948,0.018 L 0.68,0.015 Q 0.52,0.013 0.32,0.015 L 0.052,0.018 Z" />
        </clipPath>

        <clipPath id="hand-drawn-strong-4" clipPathUnits="objectBoundingBox">
          <path d="M 0.047,0.014 Q 0.019,0.016 0.014,0.036 Q 0.011,0.051 0.014,0.079 L 0.017,0.28 Q 0.014,0.48 0.017,0.72 L 0.014,0.921 Q 0.011,0.949 0.014,0.964 Q 0.019,0.984 0.047,0.986 L 0.28,0.983 Q 0.48,0.986 0.72,0.983 L 0.953,0.986 Q 0.981,0.984 0.986,0.964 Q 0.989,0.949 0.986,0.921 L 0.983,0.72 Q 0.986,0.48 0.983,0.28 L 0.986,0.079 Q 0.989,0.051 0.986,0.036 Q 0.981,0.016 0.953,0.014 L 0.72,0.017 Q 0.48,0.014 0.28,0.017 L 0.047,0.014 Z" />
        </clipPath>

        <clipPath id="hand-drawn-strong-5" clipPathUnits="objectBoundingBox">
          <path d="M 0.05,0.017 Q 0.021,0.014 0.015,0.039 Q 0.012,0.053 0.015,0.081 L 0.018,0.29 Q 0.015,0.51 0.018,0.71 L 0.015,0.919 Q 0.012,0.947 0.015,0.961 Q 0.021,0.986 0.05,0.983 L 0.29,0.986 Q 0.51,0.984 0.71,0.986 L 0.95,0.983 Q 0.979,0.986 0.985,0.961 Q 0.988,0.947 0.985,0.919 L 0.982,0.71 Q 0.985,0.51 0.982,0.29 L 0.985,0.081 Q 0.988,0.053 0.985,0.039 Q 0.979,0.014 0.95,0.017 L 0.71,0.014 Q 0.51,0.015 0.29,0.014 L 0.05,0.017 Z" />
        </clipPath>

        <clipPath id="hand-drawn-strong-6" clipPathUnits="objectBoundingBox">
          <path d="M 0.049,0.015 Q 0.02,0.013 0.014,0.037 Q 0.011,0.05 0.014,0.08 L 0.017,0.33 Q 0.014,0.49 0.017,0.67 L 0.014,0.92 Q 0.011,0.95 0.014,0.963 Q 0.02,0.987 0.049,0.985 L 0.33,0.987 Q 0.49,0.985 0.67,0.987 L 0.951,0.985 Q 0.98,0.987 0.986,0.963 Q 0.989,0.95 0.986,0.92 L 0.983,0.67 Q 0.986,0.49 0.983,0.33 L 0.986,0.08 Q 0.989,0.05 0.986,0.037 Q 0.98,0.013 0.951,0.015 L 0.67,0.013 Q 0.49,0.015 0.33,0.013 L 0.049,0.015 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function Card({
  to,
  params,
  image,
  imagePlaceholder = 'IMAGE',
  circularImage = false,
  headerText,
  descriptiveText,
  descriptiveText2,
  location,
  badge,
  newBadge,
  footerLink,
  tags,
  maxTags = 3,
  className = '',
  onMouseEnter,
}: CardProps) {
  // Get image URL from Strapi image object
  const getImageUrl = (): string | null => {
    if (!image) return null;

    const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
    const imageUrl = image.formats?.medium?.url || image.formats?.small?.url || image.url;

    return imageUrl ? `${STRAPI_URL}${imageUrl}` : null;
  };

  const fullImageUrl = getImageUrl();
  const displayTags = tags?.slice(0, maxTags);
  const hasNoImage = !fullImageUrl;

  return (
    <div className="card-wrapper">
      {/* New Badge (spiky circle) - Outside the Link to avoid clipping */}
      {newBadge && <NewBadge />}

      <Link
        to={to}
        params={params}
        className={`card ${hasNoImage ? 'card--no-image' : ''} ${circularImage ? 'card--circular-image' : ''} ${className}`}
        onMouseEnter={onMouseEnter}
      >
        {/* Badge (existing text badge) */}
        {badge && (
          <div className="card__badge">
            {badge}
          </div>
        )}

      {/* Image Section */}
      <div className="card__image-container">
        {fullImageUrl ? (
          <img
            src={fullImageUrl}
            alt={image?.alternativeText || headerText}
            className="card__image"
          />
        ) : (
          <div className="card__placeholder">
            <span>{imagePlaceholder}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="card__content">
        {/* Header Text */}
        <h3 className="card__header">{headerText}</h3>

        {/* Location */}
        {location && (
          <div className="card__location">
            <img src="/icons/location.svg" width="12" height="12" alt="" className="card__location-icon" />
            <span>{location}</span>
          </div>
        )}

        {/* Descriptive Text */}
        {descriptiveText && (
          <div className="card__text">{descriptiveText}</div>
        )}

        {/* Descriptive Text 2 */}
        {descriptiveText2 && (
          <div className="card__text-secondary">{descriptiveText2}</div>
        )}

        {/* Tags */}
        {displayTags && displayTags.length > 0 && (
          <div className="card__tags">
            {displayTags.map((tag) => (
              <span key={tag.id} className="card__tag">
                {tag.label}
              </span>
            ))}
          </div>
        )}

        {/* Footer Link */}
        {footerLink && (
          <div className="card__footer-link">
            <span>{footerLink.text}</span>
            {footerLink.icon && (
              <img src={footerLink.icon} width="12" height="12" alt="" className="card__footer-icon" />
            )}
          </div>
        )}
      </div>
    </Link>
    </div>
  );
}
