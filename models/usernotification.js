const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const userNotificationSchema = new Schema({

  sender: {type: Schema.Types.ObjectId, ref:'Publisher'},
 
  article: { type: Schema.Types.ObjectId, ref: "Article" },
  date: { type: Date, required: true },
  viewed: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model(
  "UserNotification",
  userNotificationSchema
);