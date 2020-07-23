const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const userNotificationSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  reciever: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  article: { type: Schema.Types.ObjectId, ref: "Article" },
  debate: { type: Schema.Types.ObjectId, ref: "Debate" },
  blog: { type: Schema.Types.ObjectId, ref: "Blog" },
  message: { type: String },
  notificationType: { type: String },
  debateParentComment: {
    type: Schema.Types.ObjectId,
    ref: "DebateComment",
  },
  debateComment: {
    type: Schema.Types.ObjectId,
    ref: "DebateComment",
  },
  articleParentComment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  articleComment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  blogParentComment: {
    type: Schema.Types.ObjectId,
    ref: "BlogComment",
  },
  blogComment: {
    type: Schema.Types.ObjectId,
    ref: "BlogComment",
  },
  date: { type: Date, required: true },
  viewed: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model("UserNotification", userNotificationSchema);
