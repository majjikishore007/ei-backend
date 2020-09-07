const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const pushNotification = new Schema({
  notification: { type: Object, required: true },
  data: { type: Object, required: true },
  device: { type: String },
  viewed: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  pushedAt: { type: Date, default: Date.now },
});
pushNotification.index({ device: 1 });
module.exports = mongoose.model("PushNotification", pushNotification);
