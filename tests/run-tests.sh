#!/bin/bash

# Script to run tests with configurable base URL
# Reads TEST_BASE_URL from .env.local by default

# Initialize variables
TEST_TO_RUN=$1

# Color formatting
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Markdown to Print Test Runner${NC}"

# Check if node and npm are available
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

# Run the appropriate test
if [ -z "$TEST_TO_RUN" ]; then
    # If no specific test specified, run the primary e2e test
    echo -e "${BLUE}Running end-to-end test...${NC}"
    node tests/e2e-test.js
elif [ "$TEST_TO_RUN" = "footnotes" ]; then
    # Run footnote test
    echo -e "${BLUE}Running footnote test...${NC}"
    node tests/footnote-test.js
elif [ "$TEST_TO_RUN" = "text-fragment" ]; then
    # Run text fragment test
    echo -e "${BLUE}Running text fragment test...${NC}"
    node tests/text-fragment-test.js
elif [ "$TEST_TO_RUN" = "submit" ]; then
    # Run submit test (requires second argument for markdown file)
    MARKDOWN_FILE=$2
    if [ -z "$MARKDOWN_FILE" ]; then
        echo -e "${RED}Error: No markdown file specified for submit test${NC}"
        echo -e "Usage: ./run-tests.sh submit path/to/markdown.md"
        exit 1
    fi
    echo -e "${BLUE}Running submit test with file: $MARKDOWN_FILE${NC}"
    node tests/submit-test.js "$MARKDOWN_FILE"
elif [ "$TEST_TO_RUN" = "all" ]; then
    # Run all tests
    echo -e "${BLUE}Running all tests...${NC}"
    echo -e "\n${BLUE}1. End-to-end test${NC}"
    node tests/e2e-test.js
    echo -e "\n${BLUE}2. Footnote test${NC}"
    node tests/footnote-test.js
    echo -e "\n${BLUE}3. Text fragment test${NC}"
    node tests/text-fragment-test.js
else
    # Try to run the specified test file
    if [ -f "tests/$TEST_TO_RUN.js" ]; then
        echo -e "${BLUE}Running test: $TEST_TO_RUN${NC}"
        node "tests/$TEST_TO_RUN.js"
    else
        echo -e "${RED}Error: Test '$TEST_TO_RUN' not found${NC}"
        echo -e "Available tests: e2e, footnotes, text-fragment, submit, all"
        exit 1
    fi
fi