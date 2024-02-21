const asyncHandler = require("express-async-handler");
const dbService = require("../utils/dbService");
const Course = require("../models/courseModel");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} = require("../utils/cloudinary");
exports.createCourse = asyncHandler(async (req, res) => {
  const imagePath = path.join(__dirname, `../uploads/${req.file.filename}`);
  const imagePathResult = await cloudinaryUploadImage(imagePath);
  req.body.image = {
    url: imagePathResult.secure_url,
    publicId: imagePathResult.public_id,
  };
  const course = await dbService.create(Course, req.body);
  res.success({ data: course });
});
exports.getAllCourses = asyncHandler(async (req, res) => {
  const courses = await dbService.findMany(Course, { Suggestion: false });
  res.success({ data: courses });
});
exports.getCourseById = asyncHandler(async (req, res) => {
  const course = await dbService.findOne(Course, { _id: req.params.id });
  if (!course) {
    return res.recordNotFound({ message: "course not found" });
  }
  res.success({ data: course });
});

exports.requestCourse = asyncHandler(async (req, res) => {
  const course = await dbService.findOne(Course, {
    _id: req.params.id,
  });
  if (!course) {
    return res.recordNotFound({ message: "Course not found" });
  }
  course.requestList.push({ user: req.user._id });

  await course.save();
  res.success({ data: course });
});

exports.updateCourseById = asyncHandler(async (req, res) => {
  const existingCourse = await dbService.findOne(Course, {
    _id: req.params.id,
  });
  if (!existingCourse) {
    return res.recordNotFound({ message: "Course not found" });
  }
  if (req.file && req.file.filename) {
    await cloudinaryRemoveImage(existingCourse.image.publicId);
    const imagePath = path.join(__dirname, `../uploads/${req.file.filename}`);
    const imagePathResult = await cloudinaryUploadImage(imagePath);
    req.body.image = {
      url: imagePathResult.secure_url,
      publicId: imagePathResult.public_id,
    };
  }

  const course = await dbService.updateOne(
    Course,
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!course) {
    return res.recordNotFound({ message: "Course not found" });
  }
  res.success({ data: course });
});
exports.updateRateById = asyncHandler(async (req, res) => {
  console.log("rating", req.body);
  const { rating } = req.body;
  const existingCourse = await dbService.findOne(Course, {
    _id: req.params.id,
  });
  if (!existingCourse) {
    return res.recordNotFound({ message: "Course not found" });
  }
  console.log(existingCourse);
  const existingRating = existingCourse.ratings.length > 0 && existingCourse.ratings.find((r) => r.user.toString() === req.user._id
  );
  console.log(existingRating);
  if (existingRating) {
    existingRating.rating = rating;
  } else {
    existingCourse.ratings.push({ user: req.user._id, rating });
  }
  await existingCourse.save();
  res.success();
});

exports.getUserCoursesSuggestions = asyncHandler(async (req, res) => {
  const course = await dbService.findMany(Course, { Suggestion: true });
  res.success({ data: course });
})
exports.acceptUserSuggestion = asyncHandler(async (req, res) => {
  const course = await dbService.updateOne(
    Course,
    { _id: req.params.id },
    { Suggestion: false },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!course) {
    return res.recordNotFound({ message: "Book not found" });
  }
  res.success({ data: course });
})
exports.deleteCourseById = asyncHandler(async (req, res) => {
  const existingCourse = await dbService.findOne(Course, {
    _id: req.params.id,
  });
  if (!existingCourse) {
    return res.recordNotFound({ message: "course not found" });
  }
  console.log(existingCourse);
  await cloudinaryRemoveImage(existingCourse.image.publicId);
  await dbService.deleteOne(Course, { _id: req.params.id });
  res.success();
});