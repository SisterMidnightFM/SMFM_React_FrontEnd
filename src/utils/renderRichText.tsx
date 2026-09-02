import React from 'react';
import type { StrapiInlineNode, StrapiRichText } from '../types/strapi';

// Helper function to render rich text nodes (inline elements)
function renderRichTextNode(node: StrapiInlineNode | undefined, index: number): React.ReactNode {
  if (!node) return null;

  // Handle link nodes (process before text to support formatted links)
  if (node.type === 'link') {
    if (node.url) {
      return (
        <a key={index} href={node.url} target="_blank" rel="noopener noreferrer">
          {node.children?.map((child, i) => renderRichTextNode(child, i))}
        </a>
      );
    }
    return null;
  }

  // Handle text nodes with formatting
  const { text, bold, italic, underline, strikethrough, code } = node;
  let content: React.ReactNode = text || '';

  // Apply text formatting (can be nested/combined)
  if (bold) content = <strong>{content}</strong>;
  if (italic) content = <em>{content}</em>;
  if (underline) content = <u>{content}</u>;
  if (strikethrough) content = <s>{content}</s>;
  if (code) content = <code>{content}</code>;

  return <span key={index}>{content}</span>;
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
    return richText.map((block, pIndex) => {
      // Handle different block types

      // Handle headings
      if (block.type === 'heading' && block.level) {
        const Tag = `h${Math.min(block.level, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        return (
          <Tag key={pIndex}>
            {block.children?.map((child, cIndex) => renderRichTextNode(child, cIndex))}
          </Tag>
        );
      }

      // Handle lists
      if (block.type === 'list') {
        const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
        return (
          <ListTag key={pIndex}>
            {block.children?.map((item, iIndex) => (
              <li key={iIndex}>
                {item.children?.map((child, cIndex) => renderRichTextNode(child, cIndex))}
              </li>
            ))}
          </ListTag>
        );
      }

      // Handle quotes
      if (block.type === 'quote') {
        return (
          <blockquote key={pIndex}>
            {block.children?.map((child, cIndex) => renderRichTextNode(child, cIndex))}
          </blockquote>
        );
      }

      // Handle code blocks
      if (block.type === 'code') {
        const codeText = block.children?.map((child) => child.text).join('') || '';
        return (
          <pre key={pIndex}>
            <code>{codeText}</code>
          </pre>
        );
      }

      // Default to paragraph (also handles type === 'paragraph')
      if (block.children && block.children.length > 0) {
        return (
          <p key={pIndex}>
            {block.children.map((child, cIndex) => renderRichTextNode(child, cIndex))}
          </p>
        );
      }

      return null;
    });
  }

  return null;
}
