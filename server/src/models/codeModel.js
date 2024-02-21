const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: false, trim: true },
  code: { type: String, },
  originalname: { type: String }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;