# Markdown to Print

A powerful Next.js application for converting markdown documents into beautifully formatted, print-ready reports.

## Features

- **Rich Markdown Support**: Handles complex formatting, tables, footnotes, and citations
- **Table Enhancement**: Intelligently detects and formats different table types (financial, demographic, reference)
- **Print Optimization**: CSS optimized for both screen viewing and print output
- **URL and Text Fragment Handling**: Proper formatting of links for both digital and print formats
- **Automatic Title Extraction**: Intelligently extracts document titles from markdown content
- **Customizable Styling**: Fine-tune the appearance of your generated reports
- **Responsive Design**: Works seamlessly across devices

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server (IMPORTANT: Only run if server isn't already running)
npm run dev

# View in browser
open http://localhost:3000
```

### Testing

```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run all tests
npm run test:all

# Run specific test suite
npm run test:e2e
npm run test:footnotes
npm run test:text-fragment
```

## Table Processing

The application includes sophisticated table detection and formatting:

- **Financial Tables**: Optimized for numeric data with proper alignment
- **Demographic Tables**: Specialized handling for mixed data presentations
- **Reference Tables**: Special treatment for citation and bibliography tables
- **Consumer Reports**: Formatting for survey and percentage data
- **Responsive Tables**: Automatic wrapping for wide tables on mobile devices

## Footnote Handling

- **Smart Detection**: Recognizes various footnote formats (`[^1]`, `[1]`, superscript)
- **Automatic Works Cited**: Generates a properly formatted reference section
- **Link Integration**: Transforms URLs in footnotes into clickable links
- **Duplicate Prevention**: Intelligently merges with existing bibliography sections

## Character Filtering

- **GSM Character Set Filtering**: Removes incompatible Unicode characters
- **Special Character Handling**: Automatic removal of special characters from LLM-generated markdown

## Sample Documents

Browse example documents to see the formatting capabilities:

- `/samples/kaizen.md` - General formatting example
- `/samples/oai-micro.md` - LLM-generated content example
- `/samples/tables_sample.md` - Complex table formatting example

## Print Mode

Use the "Print" button in report view to generate a print-optimized version:

- Tables properly paginated with repeated headers
- Links formatted for readability in printed output
- Proper page breaks to maintain document structure
- Color preservation for important visual elements

## Project Structure

- `/src/app/components` - React components for UI elements
- `/src/app/styles` - CSS styling including print optimization
- `/src/utils` - Utility functions for markdown processing
- `/src/utils/tableUtils` - Table detection and enhancement
- `/src/utils/footnoteUtils` - Footnote processing and rendering
- `/test-cases` - Example documents for testing
- `/tests` - End-to-end and integration tests

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.