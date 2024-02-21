const codeController = require("../controllers/codeController");
const { authenticate } = require("../middleware/auth");
const { upload } = require("../utils/upload");
const { validate } = require("../utils/validate");
const { projectKeys } = require("../utils/validation/codeValidation");
const router = require("express").Router();

router.post(
    "/create",
    authenticate,
    upload.single('file'),
    validate(projectKeys),
    codeController.createProject
);
router.get('/get-all', authenticate, codeController.getAllProjects)
router.delete('/delete/:id', authenticate, codeController.deleteProject)
module.exports = router;
