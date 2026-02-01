const express = require("express");
const router = express.Router();
const {
  createBook,
  getBooks,
  create,
  bookUi,
} = require("../controllers/book.controller");
const { createBookValidators } = require("../middleware/validateBook");

// UI routes
router.get("/books/create", create);
router.get("/book-ui", bookUi);

// API
router.post("/books", createBookValidators, createBook);
router.get("/books", getBooks);

module.exports = router;
