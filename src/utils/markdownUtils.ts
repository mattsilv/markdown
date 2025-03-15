'use client';

// This file now re-exports from the modular components
// to maintain backward compatibility during refactoring

export { MarkdownOptions } from './markdownUtils/types';
export { preprocessMarkdown } from './markdownUtils/components/preprocessing';
export { configureMarked } from './markdownUtils/components/markedConfiguration';
export { extractTitle } from './markdownUtils/components/titleExtractor';
export { renderMarkdown } from './markdownUtils/components/renderer';
export { configureCustomLinkRenderer } from './markdownUtils/components/linkRenderer';