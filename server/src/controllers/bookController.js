const asyncHandler = require("express-async-handler");
const dbService = require("../utils/dbService");
const Book = require("../models/bookModel");
const fs = require("fs");
const path = require("path");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
exports.createBook = asyncHandler(async (req, res) => {
  const imagePath = path.join(
    __dirname,
    `../uploads/${req.files.coverImage[0].filename}`
  );
  const bookPath = path.join(
    __dirname,
    `../uploads/${req.files.bookFile[0].filename}`
  );
  const imagePathResult = await cloudinaryUploadImage(imagePath);
  const bookPathResult = await cloudinaryUploadImage(bookPath);
  let bookObj = {
    ...req.body,
    publishedBy: req.user._id,
    file: {
      url: bookPathResult.secure_url,
      publicId: bookPathResult.public_id,
    },
    coverImage: {
      url: imagePathResult.secure_url,
      publicId: imagePathResult.public_id,
    },
  };
  const book = await dbService.create(Book, bookObj);
  res.success({ data: book });

});

exports.getAllBooks = asyncHandler(async (req, res) => {
  const books = await dbService.findMany(Book, { Suggestion: false });
  res.success({ data: books });
});
exports.getUserBooksSuggestions = asyncHandler(async (req, res) => {
  const books = await dbService.findMany(Book, { Suggestion: true });
  res.success({ data: books });
})
exports.acceptUserSuggestion = asyncHandler(async (req, res) => {
  const book = await dbService.updateOne(
    Book,
    { _id: req.params.id },
    { Suggestion: false },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!book) {
    return res.recordNotFound({ message: "Book not found" });
  }
  res.success({ data: book });
})
exports.getBookById = asyncHandler(async (req, res) => {
  const book = await dbService.findOne(Book, { _id: req.params.id });
  if (!book) {
    return res.recordNotFound({ message: "Book not found" });
  }
  res.success({ data: book });
});
exports.addReview = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const book = await dbService.findOne(Book, { _id: req.params.id });
  if (!book) {
    return res.recordNotFound({ message: "Book not found" });
  }
  book.reviews.push({ user: req.user._id, text });
  await book.save();
  res.success({ data: book });
});

exports.updateBookById = asyncHandler(async (req, res) => {
  const existingBook = await dbService.findOne(Book, { _id: req.params.id });
  if (!existingBook) {
    return res.recordNotFound({ message: "Book not found" });
  }

  if (req.file && req.file.filename) {
    await cloudinaryRemoveImage(existingBook.coverImage.publicId);
    const imagePath = path.join(__dirname, `../uploads/${req.file.filename}`);
    const imagePathResult = await cloudinaryUploadImage(imagePath);
    req.body.coverImage = {
      url: imagePathResult.secure_url,
      publicId: imagePathResult.public_id,
    };
  }

  const book = await dbService.updateOne(
    Book,
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!book) {
    return res.recordNotFound({ message: "Book not found" });
  }
  res.success({ data: book });

});
exports.updateRateById = asyncHandler(async (req, res) => {
  console.log("rating", req.body);
  const { rating } = req.body;
  const existingBook = await dbService.findOne(Book, {
    _id: req.params.id,
  });
  if (!existingBook) {
    return res.recordNotFound({ message: "Book not found" });
  }
  const existingRating = existingBook.ratings.length > 0 && existingBook.ratings.find((r) => r.user.toString() === req.user._id
  );
  console.log(existingRating);
  if (existingRating) {
    existingRating.rating = rating;
  } else {
    existingBook.ratings.push({ user: req.user._id, rating });
  }
  await existingBook.save();
  res.success();
});
exports.download = asyncHandler(async (req, res) => {
  const existingBook = await dbService.findOne(Book, { _id: req.params.id });
  if (!existingBook) {
    return res.recordNotFound({ message: "Book not found" });
  }
  existingBook.downloads += 1;
  existingBook.save();
  res.success();
});
exports.deleteBookById = asyncHandler(async (req, res) => {
  const existingBook = await dbService.findOne(Book, { _id: req.params.id });
  if (!existingBook) {
    return res.recordNotFound({ message: "Book not found" });
  }
  await cloudinaryRemoveImage(existingBook.coverImage.publicId);
  await dbService.deleteOne(Book, { _id: req.params.id });
  res.success({ message: "Book deleted successfully" });
});
