const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const blogCommentVoteSchema = new Schema({
  blog: { type: mongoose.Types.ObjectId, required: true, ref: "Blog" },
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  comment: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "BlogComment",
  },
  vote: { type: Boolean, required: true },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});
blogCommentVoteSchema.index({ user: 1, comment: 1 }, { unique: true });
module.exports = mongoose.model("BlogCommentVote", blogCommentVoteSchema);
