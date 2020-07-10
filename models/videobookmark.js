const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const videoBookmarkSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
  date: { type: Date, required: true },
});

videoBookmarkSchema.index({ user: 1, video: 1 }, { unique: true });

module.exports = mongoose.model("VideoBookmark", videoBookmarkSchema);
