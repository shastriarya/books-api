const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });
const mongoose = require("mongoose");
const Book = require("../models/book.model");

const books = [
  // Robert C. Martin
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

  // Andrew Hunt & David Thomas
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

  // Kyle Simpson
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

  // Martin Fowler
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

  // Joshua Bloch
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

  // Aditya Bhargava
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

  // Single-author books
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

(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error(
      "MONGO_URI is not defined. Ensure .env exists in project root and contains MONGO_URI.",
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    await Book.deleteMany();
    await Book.insertMany(books);
    console.log("Database seeded");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
