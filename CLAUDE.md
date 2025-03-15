# Markdown to Print Project Guide

## Project Directories

- `/Users/mattsilverman/Documents/GitHub/markdown-to-print/markdown-to-print-next/`

## Next.js Build & Test Commands

- Start development server: `npm run dev` (IMPORTANT: DO NOT RUN THIS COMMAND! The server is always running in the background manually. Running it again will close the existing server.)
- Build for production: `npm run build`
- Run production build locally: `npm run start`
- Run tests: `npm test`
- Run type checking: `npm run typecheck`
- Run linting: `npm run lint`
- Run single test: `node tests/test-footnote-direct.js` or `node tests/footnote-test.js`
- Run e2e tests: `node tests/e2e-test.js`

## Puppeteer Access

- Always use local IP address (192.168.9.82 or 192.168.9.54) instead of localhost
- Development server URL: `http://192.168.9.82:3000`
- For screenshots/testing: `mcp__puppeteer__puppeteer_navigate` with URL `http://192.168.9.82:3000`

## Code Style Guidelines

- **Imports**: Use ES modules syntax (`import x from 'y'`) and organize imports by external modules first, then local modules
- **Modules**: Organize code into logical modules with clear separation of concerns
- **Formatting**: Follow standard formatting with 2-space indentation
- **Documentation**: Use TSDoc comments for functions with `@param` and `@returns` annotations
- **Error Handling**: Use try/catch with detailed error messages; log errors in the console but gracefully continue when possible
- **Naming Conventions**: Use camelCase for variables/functions and PascalCase for classes/components
- **Function Structure**: Pure functions where possible, descriptive names that reflect purpose
- **Types**: Use TypeScript types and interfaces; mark optional parameters with `?`
- **React Components**: Use functional components with hooks; props should have proper interfaces
- **Testing**: Write focused unit tests for utility functions and broader integration tests for components
