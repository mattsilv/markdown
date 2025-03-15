# Complex Table Test

This test verifies handling of tables with varied content and formatting.

## Test Input

```markdown
| Product | Description | Price | Stock |
|---------|-------------|-------|-------|
| Widget A | **Premium** widget with special features | $19.99 | 42 |
| Widget B | Basic model with *standard* features | $9.99 | 105 |
| Widget C | Economy version | $4.99 | 0 |
```

## Expected Behavior

- Table should render with clean borders and spacing
- Text formatting within cells (bold, italic) should be preserved
- Column widths should be proportional to content
- Numeric values (prices, stock) should be right-aligned or properly formatted
- Zero stock value might be highlighted differently
- Headers should be visually distinct from data rows
- Table should be properly centered on the page
- Table should fit within page boundaries when printed
- Table should scale appropriately on different screen sizes