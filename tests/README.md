# Markdown to Print Test Suite

This directory contains automated tests for the Markdown to Print application.

## Running Tests

You can run the tests using the provided `run-tests.sh` script or via npm commands.

### Using npm scripts

```bash
# Run the default e2e test
npm test

# Run the e2e test specifically
npm run test:e2e

# Run the footnote test
npm run test:footnotes

# Run the text fragment test
npm run test:text-fragment

# Run all tests
npm run test:all
```

### Using the script directly

```bash
# Run the default e2e test
./tests/run-tests.sh

# Run a specific test
./tests/run-tests.sh footnotes
./tests/run-tests.sh text-fragment
./tests/run-tests.sh e2e

# Run all tests
./tests/run-tests.sh all

# Run the submit test with a markdown file
./tests/run-tests.sh submit path/to/markdown.md
```

## Configuration

### Test Base URL

Tests use the `TEST_BASE_URL` environment variable defined in the `.env.local` file to determine which server to connect to. By default, it falls back to `http://localhost:3000`.

#### How to Configure:

1. Create or modify the `.env.local` file in the project root:

```
# .env.local
TEST_BASE_URL=http://192.168.9.82:3000
```

2. All tests will automatically use this URL.

You can also temporarily override this setting by specifying the environment variable:

```bash
# Temporarily override the base URL for a single test run
TEST_BASE_URL="http://another-server:3000" npm test
```

This approach keeps your local IP configuration in a .env file that isn't committed to version control, making it easier to run the tests across different environments.

## Test Files

- **e2e-test.js**: Full end-to-end test that submits markdown and verifies rendering
- **footnote-test.js**: Tests specifically for footnote processing
- **text-fragment-test.js**: Tests text fragment link generation
- **submit-test.js**: Simple test to submit a markdown file and verify it works

## Adding New Tests

When creating new test files:

1. Import the required dependencies
2. Use the `TEST_BASE_URL` constant for navigation
3. Follow the existing test structure for consistency
4. Add your test to the `run-tests.sh` script if needed