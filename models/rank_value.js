const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const rankValueSchema = new Schema({
  action: { type: String, required: true },
  keyword_value: { type: Number },
  publisher_keyword_value: { type: Number },
  article_keyword_value: { type: Number },
  other_keyword_value: { type: Number },
  created_at: { type: Date, default: Date.now },
});
rankValueSchema.index({ action: 1 }, { unique: true });
module.exports = mongoose.model("RankValue", rankValueSchema);
