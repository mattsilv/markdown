'use client';

import { MarkdownOptions } from '../types';
import { processFootnotes } from '../../footnoteUtils';

/**
 * Pre-process markdown to fix common issues before rendering
 */
export function preprocessMarkdown(text: string, options: MarkdownOptions): string {
  if (!text) return "";

  let processed = text;

  // Fix escaped backslashes before periods in lists if option is checked
  if (options.fixEscapes) {
    // Fix backslash escapes before periods in numbered lists
    processed = processed.replace(/(\d+)\\\./g, "$1.");

    // Fix other common escaped characters that cause rendering issues
    processed = processed.replace(/\\([._*{}[\]()#+\-!])/g, "$1");
  }

  // Google Docs processing functionality
  if (options.fixGDocs) {
    // Basic fixes for common Google Docs issues
    // Remove extra backslashes that Google Docs adds
    processed = processed.replace(/\\([^\s])/g, '$1');
    // Fix line breaks
    processed = processed.replace(/\n{3,}/g, '\n\n');
  }

  // Process standard markdown footnotes
  if (options.processFootnotes) {
    console.log("Processing standard markdown footnotes");
    try {
      processed = processFootnotes(processed);
      console.log("Footnotes processed successfully");
    } catch (err) {
      console.error("Error processing footnotes:", err);
      // Continue without footnote processing rather than failing
    }
  }

  // Remove special characters and symbols that come from ChatGPT copy operations
  // Remove invisible/hidden Unicode characters
  processed = processed.replace(/[\u200B-\u200F\u2028-\u202E\u00A0]/g, '');
  
  // Remove non-breaking spaces and other typographic whitespace variations
  processed = processed.replace(/[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g, ' ');
  
  // Remove unusual punctuation and symbols that may appear when copying from ChatGPT
  processed = processed.replace(/[\u2013\u2014]/g, '-'); // En dash, em dash to hyphen
  processed = processed.replace(/[\u2018\u2019]/g, "'"); // Curly single quotes to straight quote
  processed = processed.replace(/[\u201C\u201D]/g, '"'); // Curly double quotes to straight quotes
  
  // GSM character set replacement - replace non-GSM characters with closest equivalents
  // GSM charset includes standard ASCII, plus some extension characters
  
  // Function to check if a character is in GSM charset
  const isGSMChar = (char: string): boolean => {
    // GSM 03.38 charset
    // Basic characters
    const gsmBasicChars = '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\x1BÆæßÉ !\"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà';
    // Extension characters (preceded by escape character in actual GSM encoding)
    const gsmExtChars = '{}[~]|^€\\';
    
    return gsmBasicChars.includes(char) || gsmExtChars.includes(char);
  };
  
  // Replace non-GSM characters with appropriate alternatives or remove them
  const processedChars = [];
  for (let i = 0; i < processed.length; i++) {
    const char = processed[i];
    
    if (isGSMChar(char) || /\s/.test(char)) {
      // Keep GSM characters and whitespace
      processedChars.push(char);
    } else {
      // For common Unicode punctuation/symbols, map to closest GSM equivalent
      switch (char) {
        case '\u201C': // left double quote
        case '\u201D': // right double quote
        case '\u201E': // double low-9 quotation mark
          processedChars.push('"');
          break;
        case '\u2018': // left single quote
        case '\u2019': // right single quote
          processedChars.push("'");
          break;
        case '\u2013': // en dash
        case '\u2014': // em dash
          processedChars.push('-');
          break;
        case '\u2022': // bullet
          processedChars.push('*');
          break;
        case '\u2026': // ellipsis
          processedChars.push('...');
          break;
        case '\u2264': // less than or equal to
          processedChars.push('<=');
          break;
        case '\u2265': // greater than or equal to
          processedChars.push('>=');
          break;
        case '\u00D7': // multiplication sign
          processedChars.push('x');
          break;
        case '\u00F7': // division sign
          processedChars.push('/');
          break;
        case '\u00B0': // degree sign
          processedChars.push('deg');
          break;
        default:
          // For other characters, try to use a basic ASCII equivalent
          // This is a simplified replacement - only handles common accented characters
          const normalizedChar = char.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (normalizedChar && normalizedChar.length === 1 && isGSMChar(normalizedChar)) {
            processedChars.push(normalizedChar);
          }
          // If still not GSM-compatible, just skip the character
          break;
      }
    }
  }
  
  // Replace the processed text with our GSM-compatible version
  processed = processedChars.join('');
  
  return processed;
}