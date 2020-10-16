const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const TwitterTrendSchema = new Schema({
  name: { type: String },
  url: { type: String },
  query: { type: Object },
  tweet_volume: { type: Number, default: 0 },
  trending_at: { type: Date, default: Date.now },
  country: { type: String },
  woeid: { type: Number },
});
TwitterTrendSchema.index({ name: 1 });

module.exports = mongoose.model("TwitterTrend", TwitterTrendSchema);
