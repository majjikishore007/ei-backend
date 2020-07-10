const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const videoViewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
  viewedUpto: { type: Number, required: true },
  videoLength: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
});

videoViewSchema.index({ user: 1, video: 1 }, { unique: true });

module.exports = mongoose.model("VideoView", videoViewSchema);
