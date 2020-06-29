const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const debateCommentSchema = new Schema({
  debate: { type: mongoose.Types.ObjectId, required: true, ref: "Debate" },
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  message: { type: String, required: true },
  type: { type: Number, default: 2 }, // 0 = for, 1 = against 2 =neutral,
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("DebateComment", debateCommentSchema);
