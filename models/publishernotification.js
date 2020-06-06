const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const publisherNotificationSchema = new Schema({
  message: { type: String },
  rating: { type: Number },
  sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  reciever: { type: Schema.Types.ObjectId, required: true, ref: "Publisher" },
  article: { type: Schema.Types.ObjectId, required: true, ref: "Article" },
  date: { type: Date, required: true },
  viewed: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model(
  "PublisherNotification",
  publisherNotificationSchema
);
