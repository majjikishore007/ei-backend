const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const CustomNotification = new Schema({
  title: { type: String },
  description: { type: String },
  thumbnail: { type: String },
  category: { type: String },
  articleList: [{ type: Schema.Types.ObjectId, ref: "Article" }],
  allUser: { type: Boolean, default: false },
  userList: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CustomNotification", CustomNotification);
