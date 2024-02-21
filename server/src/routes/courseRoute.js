const { authorizeAdmin,authenticate } = require("../middleware/auth");
const courseCtrl =require('../controllers/courseController');
const { createCourseKeys, updateCourseKeys } = require("../utils/validation/courseValidation");
const { validate } = require("../utils/validate");
const { upload } = require("../utils/upload");
const router = require("express").Router();
router.post(
  "/create",
  authorizeAdmin,
  upload.single("image"),
  validate(createCourseKeys),
  courseCtrl.createCourse
);
router.patch(
  "/update/:id",
  authorizeAdmin,
  upload.single("image"),
  validate(updateCourseKeys),
  courseCtrl.updateCourseById
);
router.put('/accept/:id',authorizeAdmin,courseCtrl.acceptUserSuggestion)
router.get('/get-suggestion',authorizeAdmin,courseCtrl.getUserCoursesSuggestions)
router.put('/:id',authenticate,courseCtrl.updateRateById);
router.get('/get-all',courseCtrl.getAllCourses)
router.post('/request',authenticate, courseCtrl.requestCourse)
router.delete('/delete/:id',authorizeAdmin, courseCtrl.deleteCourseById)
module.exports = router;
