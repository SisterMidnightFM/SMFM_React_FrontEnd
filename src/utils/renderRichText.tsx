import React from 'react';
import type { StrapiRichText } from '../types/strapi';

// Helper function to render rich text nodes (inline elements)
function renderRichTextNode(node: any, index: number): React.ReactNode {
  if (!node) return null;

  const { type, text, bold, italic, underline, strikethrough, code } = node;

  // Handle link nodes (process before text to support formatted links)
  if (type === 'link') {
    const linkUrl = node.url;
    if (linkUrl) {
      return (
        <a key={index} href={linkUrl} target="_blank" rel="noopener noreferrer">
          {node.children?.map((child: any, i: number) => renderRichTextNode(child, i))}
        </a>
      );
    }
  }

  // Handle text nodes with formatting
  if (type === 'text' || text !== undefined) {
    let content: React.ReactNode = text || '';

    // Apply text formatting (can be nested/combined)
    if (bold) content = <strong>{content}</strong>;
    if (italic) content = <em>{content}</em>;
    if (underline) content = <u>{content}</u>;
    if (strikethrough) content = <s>{content}</s>;
    if (code) content = <code>{content}</code>;

    return <span key={index}>{content}</span>;
  }

  // If node has children but no specific type handler, try to render children
  if (node.children && Array.isArray(node.children)) {
    return (
      <span key={index}>
        {node.children.map((child: any, i: number) => renderRichTextNode(child, i))}
      </span>
    );
  }

  return null;
}

// Helper function to parse Markdown formatting in a string
function parseMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;

  // Combined regex for: links [text](url), bold **text**, italic *text*
  const markdownRegex = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
  let match;

  while ((match = markdownRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      parts.push(text.substring(currentIndex, match.index));
    }

    // Check which pattern matched
    if (match[1]) {
      // Link: [text](url)
      const linkText = match[2];
      const url = match[3];
      parts.push(
        <a key={match.index} href={url} target="_blank" rel="noopener noreferrer">
          {linkText}
        </a>
      );
    } else if (match[4]) {
      // Bold: **text**
      const boldText = match[5];
      parts.push(<strong key={match.index}>{boldText}</strong>);
    } else if (match[6]) {
      // Italic: *text*
      const italicText = match[7];
      parts.push(<em key={match.index}>{italicText}</em>);
    }

    currentIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }

  // If no formatting found, return the original text
  return parts.length > 0 ? parts : [text];
}

/**
 * Render Strapi rich text content
 * Handles both rich text arrays and plain strings
 */
export function renderRichText(richText: StrapiRichText | string | null | undefined): React.ReactNode {
  if (!richText) return null;

  if (typeof richText === 'string') {
    // Plain text or markdown - parse markdown formatting and render with line breaks
    return richText.split('\n').map((line, i) => (
      <p key={i}>{line ? parseMarkdown(line) : '\u00A0'}</p>
    ));
  }

  if (Array.isArray(richText)) {
    return richText.map((paragraph: any, pIndex) => {
      const { children, type } = paragraph;

      // Handle different block types

      // Handle headings
      if (type === 'heading' && paragraph.level) {
        const level = paragraph.level;
        const Tag = `h${Math.min(level, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        return (
          <Tag key={pIndex}>
            {children?.map((child: any, cIndex: number) => renderRichTextNode(child, cIndex))}
          </Tag>
        );
      }

      // Handle lists
      if (type === 'list') {
        const ListTag = paragraph.format === 'ordered' ? 'ol' : 'ul';
        return (
          <ListTag key={pIndex}>
            {children?.map((item: any, iIndex: number) => (
              <li key={iIndex}>
                {item.children?.map((child: any, cIndex: number) => renderRichTextNode(child, cIndex))}
              </li>
            ))}
          </ListTag>
        );
      }

      // Handle quotes
      if (type === 'quote') {
        return (
          <blockquote key={pIndex}>
            {children?.map((child: any, cIndex: number) => renderRichTextNode(child, cIndex))}
          </blockquote>
        );
      }

      // Handle code blocks
      if (type === 'code') {
        const codeText = children?.map((child: any) => child.text).join('') || '';
        return (
          <pre key={pIndex}>
            <code>{codeText}</code>
          </pre>
        );
      }

      // Default to paragraph (also handles type === 'paragraph')
      if (children && children.length > 0) {
        return (
          <p key={pIndex}>
            {children.map((child: any, cIndex: number) => renderRichTextNode(child, cIndex))}
          </p>
        );
      }

      return null;
    });
  }

  return null;
}
