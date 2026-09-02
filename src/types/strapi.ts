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

// Rich text nodes (used for descriptions, tracklists, news bodies, etc.)

// A run of text, optionally carrying any combination of formatting marks
export interface StrapiTextNode {
  type?: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface StrapiLinkNode {
  type: 'link';
  url: string;
  children: StrapiTextNode[];
}

export type StrapiInlineNode = StrapiTextNode | StrapiLinkNode;

export interface StrapiParagraph {
  type: 'paragraph';
  children: StrapiInlineNode[];
}

export interface StrapiHeading {
  type: 'heading';
  level: number;
  children: StrapiInlineNode[];
}

export interface StrapiListItem {
  type: 'list-item';
  children: StrapiInlineNode[];
}

export interface StrapiList {
  type: 'list';
  format?: 'ordered' | 'unordered';
  children: StrapiListItem[];
}

export interface StrapiQuote {
  type: 'quote';
  children: StrapiInlineNode[];
}

export interface StrapiCodeBlock {
  type: 'code';
  children: StrapiTextNode[];
}

export type StrapiBlockNode =
  | StrapiParagraph
  | StrapiHeading
  | StrapiList
  | StrapiQuote
  | StrapiCodeBlock;

export type StrapiRichText = StrapiBlockNode[];

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
