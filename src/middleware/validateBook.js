const { body, validationResult } = require("express-validator");

const createBookValidators = [
  body("name").trim().notEmpty().withMessage("name is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("description is required")
    .isLength({ max: 2000 })
    .withMessage("description max length is 2000"),
  body("author").trim().notEmpty().withMessage("author is required"),
  body("publishDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("publishDate must be an ISO date"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { createBookValidators };
