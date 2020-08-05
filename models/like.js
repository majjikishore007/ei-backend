const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const likeSchema = new Schema({
  count: { type: Number, required: true, default: 0 },
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  publisher: { type: Schema.Types.ObjectId, required: true, ref: "Publisher" },
  date: { type: Date, required: true },
});
likeSchema.index({ user: 1, publisher: 1 }, { unique: true });
module.exports = mongoose.model("Like", likeSchema);
