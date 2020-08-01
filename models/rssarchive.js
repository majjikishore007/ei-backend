const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const rssArchiveSchema = new Schema({
  rssFeedId: { type: Schema.Types.ObjectId, ref: "AllContent" },
});
rssArchiveSchema.index({ rssFeedId: 1 });
module.exports = mongoose.model("RssArchive", rssArchiveSchema);
