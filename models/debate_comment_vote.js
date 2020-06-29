const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const debateCommentVoteSchema = new Schema({
  debate: { type: mongoose.Types.ObjectId, required: true, ref: "Debate" },
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  comment: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "DebateComment",
  },
  vote: { type: Boolean, required: true },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});
debateCommentVoteSchema.index({ user: 1, comment: 1 }, { unique: true });
module.exports = mongoose.model("DebateCommentVote", debateCommentVoteSchema);
