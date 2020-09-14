const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const timelineSchema = new Schema({
  timelineTopic: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "TimelineTopic",
  },
  date: { type: Date, require: true },
  shortDescription: { type: String, require: true },
  longDescription: { type: String },
  articles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
});

module.exports = mongoose.model("Timeline", timelineSchema);