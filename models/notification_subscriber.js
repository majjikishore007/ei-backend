const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const NotificationSubscriberSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  device: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

NotificationSubscriberSchema.index({ user: 1 });
NotificationSubscriberSchema.index({ device: 1 }, { unique: true });

module.exports = mongoose.model(
  "NotificationSubscriber",
  NotificationSubscriberSchema
);
