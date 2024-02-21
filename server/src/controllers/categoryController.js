const Category = require("../models/categoryModel");
const asyncHandler = require("../utils/asyncHandler");
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary");
const dbService = require("../utils/dbService");
const path =require("path")
exports.createCategory = asyncHandler(async (req, res) => {
    console.log(req.file);
  let categoryName = req.body.categoryName
  const existingName = await dbService.findOne(Category, { categoryName});
  if (existingName) {
    return res.badRequest({ message: "اسم التصنيف مستخدم بالفعل" });
  }

  const imagePath = path.join(__dirname, `../uploads/${req.file.filename}`);
    const imagePathResult = await cloudinaryUploadImage(imagePath);
    req.body.categoryImage = {
      url: imagePathResult.secure_url,
      publicId: imagePathResult.public_id,
    };
  const category = await dbService.create(Category, req.body);
  res.success({ data: category });
});
exports.updateCategoryById = asyncHandler(async (req, res) => {
  console.log("ddddddd",req.params.id);
  const existingCategory = await dbService.findOne(Category, { _id: req.params.id });
  if (!existingCategory) {
    return res.recordNotFound({ message: "Book not found" });
  }

  if (req.file && req.file.filename) {
    await cloudinaryRemoveImage(existingCategory.categoryImage.publicId);
    const imagePath = path.join(__dirname, `../uploads/${req.file.filename}`);
    const imagePathResult = await cloudinaryUploadImage(imagePath);
    req.body.categoryImage = {
      url: imagePathResult.secure_url,
      publicId: imagePathResult.public_id,
    };
  }

  const category = await dbService.updateOne(
    Category,
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.success({ data: category });
});
exports.getAll = asyncHandler(async(req,res)=>{
  const categories = await dbService.findMany(Category,{})
  res.success({ data: categories });
})
exports.deleteCategoryById = asyncHandler(async (req, res) => {
  const existingCategory = await dbService.findOne(Category, {
    _id: req.params.id,
  });
  if (!existingCategory) {
    return res.recordNotFound({ message: "Category not found" });
  }

  await cloudinaryRemoveImage(existingCategory.categoryImage.publicId);
  await dbService.deleteOne(Category, { _id: req.params.id });
  res.success();
});
 