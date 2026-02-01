const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Book = require("../models/book.model");

// Sample seed data (copied from seedBooks.js)
const sampleBooks = [
  {
    name: "Clean Code",
    description: "A handbook of agile software craftsmanship",
    author: "Robert C. Martin",
    publishDate: "2008-08-01",
  },
  {
    name: "Clean Architecture",
    description: "A craftsman's guide to software structure and design",
    author: "Robert C. Martin",
    publishDate: "2017-09-20",
  },
  {
    name: "Agile Software Development",
    description: "Principles, patterns, and practices",
    author: "Robert C. Martin",
    publishDate: "2002-03-25",
  },
  {
    name: "The Pragmatic Programmer",
    description: "Your journey to mastery",
    author: "Andrew Hunt",
    publishDate: "1999-10-30",
  },
  {
    name: "Pragmatic Thinking and Learning",
    description: "Refactor your wetware",
    author: "Andrew Hunt",
    publishDate: "2008-10-01",
  },
  {
    name: "You Don't Know JS",
    description: "Deep dive into JavaScript",
    author: "Kyle Simpson",
    publishDate: "2015-12-27",
  },
  {
    name: "You Don't Know JS: Scope & Closures",
    description: "Understanding JavaScript scope",
    author: "Kyle Simpson",
    publishDate: "2014-03-04",
  },
  {
    name: "Refactoring",
    description: "Improving the design of existing code",
    author: "Martin Fowler",
    publishDate: "1999-07-08",
  },
  {
    name: "Patterns of Enterprise Application Architecture",
    description: "Enterprise software design patterns",
    author: "Martin Fowler",
    publishDate: "2002-11-15",
  },
  {
    name: "Effective Java",
    description: "Best practices for the Java platform",
    author: "Joshua Bloch",
    publishDate: "2001-01-01",
  },
  {
    name: "Java Puzzlers",
    description: "Traps, pitfalls, and corner cases",
    author: "Joshua Bloch",
    publishDate: "2005-07-01",
  },
  {
    name: "Grokking Algorithms",
    description: "An illustrated guide for programmers",
    author: "Aditya Bhargava",
    publishDate: "2016-05-01",
  },
  {
    name: "Grokking AI Algorithms",
    description: "Understanding AI step by step",
    author: "Aditya Bhargava",
    publishDate: "2020-08-15",
  },
  {
    name: "Design Patterns",
    description: "Elements of reusable object-oriented software",
    author: "Erich Gamma",
    publishDate: "1994-10-31",
  },
  {
    name: "The Mythical Man-Month",
    description: "Essays on software engineering",
    author: "Frederick P. Brooks Jr.",
    publishDate: "1975-01-01",
  },
  {
    name: "Domain-Driven Design",
    description: "Tackling complexity in the heart of software",
    author: "Eric Evans",
    publishDate: "2003-08-20",
  },
];

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // seed
  await Book.insertMany(sampleBooks);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // ensure a fresh test state if needed
});

describe("Books API - core acceptance", () => {
  test("POST /api/books creates a valid book and returns persisted entity", async () => {
    const payload = {
      name: "Test Driven Development",
      description: "By example",
      author: "Kent Beck",
      publishDate: "2002-11-08",
    };

    const res = await request(app).post("/api/books").send(payload).expect(201);

    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe(payload.name);
    expect(res.body.publishDate).toBe(
      new Date(payload.publishDate).toISOString(),
    );

    // persisted in DB
    const found = await Book.findById(res.body._id).lean();
    expect(found).not.toBeNull();
    expect(found.author).toBe(payload.author);
  });

  test("GET /api/books supports substring search on name/description (case-insensitive)", async () => {
    const res = await request(app)
      .get("/api/books")
      .query({ search: "javascript" })
      .expect(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    // all results should have name or description matching javascript (case-insensitive)
    for (const r of res.body.results) {
      const match =
        /javascript/i.test(r.name) || /javascript/i.test(r.description);
      expect(match).toBe(true);
    }
  });

  test("GET /api/books filters by author exact match case-insensitive", async () => {
    const res = await request(app)
      .get("/api/books")
      .query({ author: "kyle simpson" })
      .expect(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    for (const r of res.body.results) {
      expect(r.author.toLowerCase()).toBe("kyle simpson");
    }
  });

  test("GET /api/books supports inclusive publishDate range", async () => {
    const res = await request(app)
      .get("/api/books")
      .query({ from: "2014-01-01", to: "2016-12-31" })
      .expect(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    for (const r of res.body.results) {
      if (r.publishDate) {
        const d = new Date(r.publishDate);
        expect(d >= new Date("2014-01-01")).toBe(true);
        expect(d <= new Date("2016-12-31")).toBe(true);
      }
    }
  });

  test("GET /api/books pagination and sorting works (limit max 50)", async () => {
    const res = await request(app)
      .get("/api/books")
      .query({ page: 1, limit: 100, sortBy: "publishDate", order: "asc" })
      .expect(200);

    // limit was capped to max 50 by controller
    expect(res.body.limit).toBeLessThanOrEqual(50);
    expect(Array.isArray(res.body.results)).toBe(true);

    // Check sorting ascending by publishDate
    const dates = res.body.results
      .map((r) => (r.publishDate ? new Date(r.publishDate).valueOf() : null))
      .filter(Boolean);
    const sorted = [...dates].sort((a, b) => a - b);
    expect(dates).toEqual(sorted);
  });

  test("invalid date parameters return 400", async () => {
    await request(app)
      .get("/api/books")
      .query({ from: "not-a-date" })
      .expect(400);
    await request(app)
      .get("/api/books")
      .query({ to: "not-a-date" })
      .expect(400);
  });
});
