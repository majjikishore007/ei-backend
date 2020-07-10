const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const videoTopSchema = new Schema({
  video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
  displayTop: { type: Boolean, default: true },
});
videoTopSchema.index({ video: 1 }, { unique: true });

module.exports = mongoose.model("VideoTop", videoTopSchema);
