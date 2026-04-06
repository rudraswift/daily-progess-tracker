const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  description: { type: String },
  categoryId: { type: String, default: "work" }, // "work", "health", "personal", etc.
  timeSection: { type: String, enum: ["morning", "afternoon", "evening", "anytime"], default: "anytime" },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  date: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 } // For progress radial and bars
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
