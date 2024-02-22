const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const Book = require("../models/bookModel");
const Course = require("../models/courseModel");
const dbService = require("../utils/dbService");
const path = require("path")
const fs = require("fs");
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary");

exports.getUser = asyncHandler(async (req, res) => {
    const user = await dbService.findOne(User, { _id: req.params.id });
    if (!user) {
        return res.recordNotFound({ message: "User not found" });
    }
    res.success({ data: user });
})
exports.toggleBookToWishlist = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const { id: bookId } = req.params;
    const user = await dbService.findOne(User, { _id: userId });
    const book = await dbService.findOne(Book, { _id: bookId });
    const index = user.bookWishlist.findIndex(bookObj => bookObj._id.toString() === book._id.toString());
    if (index !== -1) {
        user.bookWishlist.splice(index, 1);
    } else {
        user.bookWishlist.push(book._id);
    }

    await user.save();
    res.success({ data: user });
})
exports.toggleCourseToWishlist = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const { id: courseId } = req.params;
    const user = await dbService.findOne(User, { _id: userId });
    const course = await dbService.findOne(Course, { _id: courseId });
    const index = user.courseWishlist.findIndex(courseObj => courseObj._id.toString() === course._id.toString());
    if (index !== -1) {
        user.courseWishlist.splice(index, 1);
    } else {
        user.courseWishlist.push(course._id);
    }
    await user.save();
    res.success({ data: user });
});
exports.editUserProfile = asyncHandler(async (req, res) => {
    const user = await dbService.findOne(User, { _id: req.user._id });
    console.log(req.file);
    if (!user) {
        return res.recordNotFound({ message: "User not found" });
    }
    if (req.file && req.file.filename) {
        if (user.profileImage && user.profileImage.publicId !== null) {
            await cloudinaryRemoveImage(user.profileImage.publicId);
        }
        const imagePath = path.join(__dirname, `../uploads/${req.file.filename}`);
        const imagePathResult = await cloudinaryUploadImage(imagePath);
        req.body.profileImage = {
            url: imagePathResult.secure_url,
            publicId: imagePathResult.public_id,
        };
    }
    const updatedUser = await dbService.updateOne(User, { _id: req.user._id }, req.body)
    res.success({ data: updatedUser });
})

exports.showBooksCoursesAndUsers = asyncHandler(async (req, res) => {
    const user = await dbService.findOne(User, { _id: req.user._id });
    if (!user) {
        return res.recordNotFound({ message: "User not found" });
    }
    const books = await dbService.findMany(Book, {
        $or: [{
            keys: { $in: user.skills }
        }, {
            category: { $in: user.interests }
        }, {
            keys: { $in: user.interests }
        }]
    });
    const courses = await dbService.findMany(Course, {
        $or: [{
            keys: { $in: user.skills }
        }, {
            category: { $in: user.interests }
        }, {
            keys: { $in: user.interests }
        }]
    });
    const users = await dbService.findMany(User, {
        $and: [{
            _id: { $ne: req.user._id }
        }, {
            $or: [{
                skills: { $in: user.skills }
            }, {
                interests: { $in: user.interests }
            }]
        }]
    });
    res.success({ data: { books, courses, users } });
});

exports.toggleFollowUser = asyncHandler(async (req, res) => {
    const { id: targetUserId } = req.params;
    const { _id: currentUserId } = req.user;

    // Prevent a user from toggling follow on themselves
    if (targetUserId === currentUserId) {
        return res.badRequest({ message: "You cannot follow or unfollow yourself" });
    }

    // Find both the current user and the target user
    const targetUser = await dbService.findOne(User, { _id: targetUserId });
    const currentUser = await dbService.findOne(User, { _id: currentUserId });

    if (!targetUser || !currentUser) {
        return res.recordNotFound({ message: "User not found" });
    }

    // Check if the current user is already following the target user
    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
        // If they are following, remove the current user from the target user's followers
        // and remove the target user from the current user's following list
        targetUser.followers.splice(targetUser.followers.indexOf(currentUserId), 1);
        currentUser.following.splice(currentUser.following.indexOf(targetUserId), 1);
        await targetUser.save();
        await currentUser.save();
        res.success({ message: "User unfollowed successfully" });
    } else {
        // If they are not following, add the current user to the target user's followers
        // and add the target user to the current user's following list
        targetUser.followers.push(currentUserId);
        currentUser.following.push(targetUserId);
        await targetUser.save();
        await currentUser.save();
        res.success({ message: "User followed successfully" });
    }
});
exports.userSearch = asyncHandler(async (req, res) => {
    const { searchText, searchIn } = req.body
    if (searchIn === "books") {
        const books = await dbService.findMany(Book, {
            $or: [
                { title: { $regex: searchText, $options: 'i' } },
                { description: { $regex: searchText, $options: 'i' } },
                { author: { $regex: searchText, $options: 'i' } }
            ]
        })

        console.log(books);
        return res.success({ data: books })

    }

    const courses = await dbService.findMany(Course, {
        $or: [
            { name: { $regex: searchText, $options: 'i' } },
            { description: { $regex: searchText, $options: 'i' } },
            { instructor: { $regex: searchText, $options: 'i' } },
            { whatUWillLearn: { $regex: searchText, $options: 'i' } }
        ]
    })
    console.log(courses);
    return res.success({ data: courses })

})