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

#  Books API (Node.js + MongoDB)

A minimal and well-structured **Books API** built using **Node.js, Express, and MongoDB**, supporting book creation and advanced exploration with search, filters, pagination, and sorting.

This project is implemented as part of a backend interview task.

---

##  Features

- Create a book
- Explore books with:
  - Substring (case-insensitive) search on `name` and `description`
  - Filter by author (case-insensitive)
  - Filter by publish date range
  - Pagination
  - Sorting
- MongoDB indexing for performance
- Clean folder structure
- OpenAPI documentation

---

## 🛠 Tech Stack

- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **dotenv**

---

##  Project Structure

src/
├── config/
│ └── db.js
├── controllers/
│ └── book.controller.js
├── models/
│ └── book.model.js
├── routes/
│ └── book.routes.js
├── seed/
│ └── seedBooks.js
├── docs/
│ └── openapi.yaml
├── app.js
└── server.js

---

## Setup Instructions

### Clone Repository

````bash
git clone <repo-url>
cd books-api

### Install Dependencies
npm install

##  Environment Variables
PORT=3000
MONGO_URI=mongodb://localhost:27017/booksdb


Start MongoDB

Make sure MongoDB is running locally.

### Seed the database (optional but recommended)

Create a `.env` file in the project root with your MONGO_URI (example: MONGO_URI=mongodb://localhost:27017/booksdb) then run:

```bash
npm run seed
````

# Run Server

npm start

# Server will run at:

# http://localhost:3000

# Tests

Run the test suite (Jest + Supertest using an in-memory MongoDB):

```bash
npm test
```

# Postman / Manual testing

A simple Postman collection is available at `src/docs/postman_collection.json`. Import it into Postman or Insomnia and update the host if needed.
API Endpoints
➕ Create Book

POST /api/books

Request body must be JSON. Required fields: `name`, `description`, `author`. `publishDate` should be an ISO date if provided.

Example:

{
"name": "Clean Code",
"description": "A handbook of agile software craftsmanship",
"author": "Robert C. Martin",
"publishDate": "2008-08-01"
}

Validation errors return 400 with an `errors` array describing issues.

Explore Books

GET /api/books

Query Parameters
Param Description
search Text search on name & description
author Filter by author
from Publish date start (ISO)
to Publish date end (ISO)
page Page number (default: 1)
limit Results per page (default: 10, max: 50)
sortBy name / author / publishDate
order asc / desc
Example
/api/books?search=javascript&author=Kyle Simpson&page=1&limit=5&sortBy=publishDate&order=asc

Indexing Strategy

Text index on name and description

Index on author

Index on publishDate

Ensures fast search and filtering even with large datasets.

# API Documentation

OpenAPI specification available at:

src/docs/openapi.yaml

You can load `src/docs/openapi.yaml` into Postman or any OpenAPI viewer (Swagger UI / Insomnia) to try the API interactively.

---

This repository intentionally focuses on the interview task requirements (create + explore books). The project keeps the implementation minimal to aid readability and assessment. For production deployments you might add monitoring, containers, or log aggregation, but those are out of scope for this task.

---

## Production checklist 

- Provide a real `MONGO_URI` and set `NODE_ENV=production` in your environment (or use secrets in your container/orchestration platform).
- Use a process manager (PM2 / systemd) or containers + orchestrator to run the app reliably.
- Add monitoring and centralized logs (e.g., Stackdriver / Datadog / ELK) for production observability.
- Consider adding request/response tracing and metrics for performance.
- Replace console logs with a structured logger (winston/pino) if you need advanced logging features.
- For high-traffic search, implement a scalable search index (Atlas Search or Elastic) rather than regex-based substring matching.

---

If you want, I can add CI (GitHub Actions), a basic test suite, or switch to a structured logger (winston/pino). Tell me which you'd prefer next.
