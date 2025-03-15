# Large Data Table Test

This test verifies handling of large tables with many columns.

## Test Input

```markdown
| ID | Name | Department | Location | Hire Date | Salary | Performance | Manager | Project |
|----|------|------------|----------|-----------|--------|-------------|---------|---------|
| 001 | John Smith | Engineering | New York | 2020-01-15 | $85,000 | 4.2 | Jane Doe | Alpha |
| 002 | Jane Doe | Engineering | New York | 2018-05-10 | $105,000 | 4.8 | Bob Johnson | Alpha |
| 003 | Bob Johnson | Management | Boston | 2015-11-01 | $125,000 | 4.5 | Alice Brown | All |
| 004 | Alice Brown | Executive | Boston | 2010-03-15 | $175,000 | 4.9 | - | All |
| 005 | Charlie Davis | Engineering | San Francisco | 2021-02-28 | $95,000 | 4.0 | Jane Doe | Beta |
```

## Expected Behavior

- Table with many columns should be handled responsively
- For wide tables, a horizontal scrolling mechanism may be used or font size may be reduced
- Column widths should be optimized for readability
- Numeric data should be properly aligned (typically right-aligned)
- Long text in cells should be handled appropriately (wrapped or truncated with indicator)
- Table should be usable on both desktop and mobile viewports
- When printed, table should maintain readability or split across pages appropriately