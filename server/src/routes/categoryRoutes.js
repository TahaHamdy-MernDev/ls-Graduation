const categoryCtrl = require("../controllers/categoryController");
const { authorizeAdmin } = require("../middleware/auth");
const { validate } = require("../utils/validate");
const { upload } = require("../utils/upload");
const {
  createCategoryKeys, updateCategoryKeys,
} = require("../utils/validation/categoryValidation");

const router = require("express").Router();
router.post(
  "/create",
  authorizeAdmin,
  upload.single("image"),
  validate(createCategoryKeys),
  categoryCtrl.createCategory
);
router.put(
  "/update/:id",
  authorizeAdmin,
  upload.single("image"),
  validate(updateCategoryKeys),
  categoryCtrl.updateCategoryById
);
router.delete('/delete/:id',authorizeAdmin,categoryCtrl.deleteCategoryById)
router.get("/get-all", categoryCtrl.getAll);
module.exports = router;
