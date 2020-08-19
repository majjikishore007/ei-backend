const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const articleCommentVoteSchema = new Schema({
  article: { type: mongoose.Types.ObjectId, required: true, ref: "Article" },
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  comment: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Comment",
  },
  vote: { type: Boolean, required: true },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});
articleCommentVoteSchema.index({ user: 1, comment: 1 }, { unique: true });
module.exports = mongoose.model("ArticleCommentVote", articleCommentVoteSchema);
