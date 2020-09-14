const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const timelineTopicSchema = new Schema({
  keyword: { type: Schema.Types.ObjectId, required: true, ref: "Keyword" },
  description: { type: String },
  helpingKeywords: [{ type: Schema.Types.ObjectId, ref: "Keyword" }],
  created_at: { type: Date, default: new Date() },
});

module.exports = mongoose.model("TimelineTopic", timelineTopicSchema);