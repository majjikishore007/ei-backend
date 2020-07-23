const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const publisherNotificationSchema = new Schema({
  message: { type: String },
  rating: { type: Number },
  sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  reciever: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  publisher: { type: Schema.Types.ObjectId, ref: "Publisher" },
  article: { type: Schema.Types.ObjectId, ref: "Article" },
  articleComment: { type: Schema.Types.ObjectId, ref: "Comment" },
  debate: { type: Schema.Types.ObjectId, ref: "Debate" },
  debateComment: { type: Schema.Types.ObjectId, ref: "DebateComment" },
  date: { type: Date, required: true },
  notificationType: { type: String },
  sharedMedium: { type: String },
  viewed: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model(
  "PublisherNotification",
  publisherNotificationSchema
);
