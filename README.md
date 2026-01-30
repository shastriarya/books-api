## Design Decisions

- Chose a REST-only architecture to keep concerns separated.
- Used MongoDB text indexes for efficient search on name and description.
- Applied filtering before sorting and pagination to ensure correct results.
- Enforced pagination limits to prevent performance issues.

## Performance Considerations

- Indexes on `author`, `publishDate`, and text fields reduce query latency.
- Pagination is handled at the database level using `skip` and `limit`.
- Sorting is applied only after filtering to avoid unnecessary computation.

## API Behavior

- All filters are optional and composable.
- The API always returns stable, predictable responses.
