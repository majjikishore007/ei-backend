const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const blogCommentSchema = new Schema({
  blog: { type: mongoose.Types.ObjectId, required: true, ref: "Blog" },
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("BlogComment", blogCommentSchema);
