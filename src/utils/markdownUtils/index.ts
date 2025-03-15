'use client';

// Export interfaces
export { MarkdownOptions } from './types';

// Export components
export { preprocessMarkdown } from './components/preprocessing';
export { configureMarked } from './components/markedConfiguration';
export { extractTitle } from './components/titleExtractor';
export { renderMarkdown } from './components/renderer';
export { configureCustomLinkRenderer } from './components/linkRenderer';

// Initialize custom renderers
import { configureCustomLinkRenderer } from './components/linkRenderer';
configureCustomLinkRenderer();