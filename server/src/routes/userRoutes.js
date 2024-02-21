const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { upload } = require('../utils/upload');
const { authenticate } = require('../middleware/auth');

router.put('/wishlist/book/:id',authenticate, userController.toggleBookToWishlist);

router.put('/wishlist/course/:id',authenticate, userController.toggleCourseToWishlist);

router.put('/profile',authenticate, upload.single("image"), userController.editUserProfile);
router.get('/profile/:id',authenticate, userController.getUser);
router.get('/suggestions',authenticate, userController.showBooksCoursesAndUsers);
router.put('/follow/:id',authenticate, userController.toggleFollowUser);
// router.put('/unfollow/:id',authenticate, userController.unFollowUser);

module.exports = router;
