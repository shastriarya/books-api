const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    publishDate: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true },
);
bookSchema.index(
  { name: "text", description: "text", author: "text" },
  { weights: { name: 10, description: 5, author: 3 }, name: "TextIndex" },
);
bookSchema.index({ author: 1, publishDate: -1 });

module.exports = mongoose.model("Book", bookSchema);
