const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const tweetSchema = new Schema({
  tweetId: { type: String },
  text: { type: String },
  user: { type: Object },
  retweeted_status: { type: Object },
  lang: { type: String },
  entities: { type: Object },
  created_at: { type: Date, default: Date.now },
});
tweetSchema.index({ tweetId: 1 });

module.exports = mongoose.model("Tweet", tweetSchema);
