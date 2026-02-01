const Book = require("../models/book.model");

//Get api for create-book

exports.create = (req, res) => {
  res.render("createBook");
};

//POST API/BOOK
exports.createBook = async (req, res) => {
  try {
    const { name, description, author, publishDate } = req.body;

    if (!name || !description || !author) {
      return res.status(400).json({
        message: "name, description and author are required",
      });
    }

    // Normalize publishDate to a Date (ISO); validate if provided
    let parsedPublishDate = undefined;
    if (publishDate) {
      parsedPublishDate = new Date(publishDate);
      if (isNaN(parsedPublishDate.valueOf())) {
        return res
          .status(400)
          .json({ message: "publishDate must be a valid ISO date" });
      }
    }

    const book = await Book.create({
      name,
      description,
      author,
      publishDate: parsedPublishDate,
    });

    // Ensure publishDate is serialized as ISO string in the response
    const bookObj = book.toObject();
    if (bookObj.publishDate)
      bookObj.publishDate = bookObj.publishDate.toISOString();

    res.status(201).json(bookObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/books

exports.bookUi = (req, res) => {
  res.render("searchBook");
};
exports.getBooks = async (req, res) => {
  try {
    const {
      search,
      author,
      from,
      to,
      page = 1,
      limit = 10,
      sortBy = "publishDate",
      order = "desc",
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { author: new RegExp(search, "i") },
      ];
    }

    if (author) {
      query.author = new RegExp(author, "i");
    }


    if (from || to) {
      query.publishDate = {};
      if (from && !isNaN(Date.parse(from)))
        query.publishDate.$gte = new Date(from);
      if (to && !isNaN(Date.parse(to))) query.publishDate.$lte = new Date(to);
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const skip = (pageNumber - 1) * limitNumber;

    const allowedSortFields = ["publishDate", "name", "author", "createdAt"];
    const sortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "publishDate";
    const sortOrder = order === "asc" ? 1 : -1;

    const [books, total] = await Promise.all([
      Book.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Book.countDocuments(query),
    ]);

    const results = books.map((b) => ({
      ...b,
      publishDate: b.publishDate ? new Date(b.publishDate).toISOString() : null,
    }));

    res.json({
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
      hasNext: pageNumber * limitNumber < total,
      hasPrev: pageNumber > 1,
      results,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
