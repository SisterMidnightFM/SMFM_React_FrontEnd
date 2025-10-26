/**
 * Common Strapi type definitions
 */

// Strapi timestamps
export interface StrapiTimestamps {
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// Strapi image format (thumbnail, small, medium, large)
export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

// Complete Strapi image object with all formats
export interface StrapiImage extends StrapiTimestamps {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  folderPath: string;
}

// Rich text node (used for descriptions, tracklists, etc.)
export interface StrapiTextNode {
  type: 'text';
  text: string;
}

export interface StrapiParagraph {
  type: 'paragraph';
  children: StrapiTextNode[];
}

export type StrapiRichText = StrapiParagraph[];

// Generic Strapi response wrapper
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Single entity response
export interface StrapiSingleResponse<T> {
  data: T;
}

// Collection response
export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
