const User = require("../models/userModel");
const dbService = require("../utils/dbService");
const asyncHandler = require("../utils/asyncHandler");
const Project = require("../models/codeModel");
const unzipper = require('unzipper')
const fs = require('fs');
const path = require('path');
exports.createProject = asyncHandler(async (req, res) => {
    if (!req.file || !req.file.filename) {
        return res.badRequest();
    }
    const filePath = path.join(__dirname, `../uploads/${req.file.filename}`);

    let projectData;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        projectData = {
            ...req.body,
            originalname: req.file.originalname,
            user: req.user._id,
            code: data.toString()
        };
        fs.unlinkSync(filePath);
        dbService.create(Project, projectData)
            .then((project) => {
                res.success({ data: project });
            })
            .catch((error) => {
                console.error(error);
                res.error("Failed to save project data");
            });
    });
});

exports.getAllProjects = asyncHandler(async (req, res) => {
    
    const projects = await dbService.findMany(Project, {user:req.user._id});
    res.success({ data: projects });
});
exports.deleteProject = asyncHandler(async(req,res)=>{
    const existingProject = await dbService.findOne(Project, {
        _id: req.params.id,
    });
    if (!existingProject) {
        return res.recordNotFound({ message: "Project not found" });
    }
    dbService.deleteOne(Project, { _id: req.params.id })
     .then((project) => {
            res.success({ data: project });
        })
     .catch((error) => {
            console.error(error);
            res.error("Failed to delete project");
        });
})