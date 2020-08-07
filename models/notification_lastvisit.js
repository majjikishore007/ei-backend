const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const notificationLastVisitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  lastVisitedAt: {
    type: Date,
    required: true,
  },
});

notificationLastVisitSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model(
  "NotificationLastVisit",
  notificationLastVisitSchema
);
