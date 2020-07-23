const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const articleCommentSchema = new Schema({
  article: { type: mongoose.Types.ObjectId, required: true, ref: "Article" },
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("ArticleComment", articleCommentSchema);
