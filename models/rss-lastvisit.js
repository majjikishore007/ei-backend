const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const rssFeedLastVisitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  rssFeedId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "AllContent",
  },
});

rssFeedLastVisitSchema.index({ userId: 1, rssFeedId: 1 }, { unique: true });

module.exports = mongoose.model("RssFeedLastVisit", rssFeedLastVisitSchema);
