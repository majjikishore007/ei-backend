const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const keywordRankingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  keyword: { type: Schema.Types.ObjectId, required: true, ref: "Keyword" },
  rank: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});
keywordRankingSchema.index({ user: 1, keyword: 1 }, { unique: true });
module.exports = mongoose.model("KeywordRanking", keywordRankingSchema);
