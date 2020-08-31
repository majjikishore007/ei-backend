const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const NewsfeedSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  mobileFeed: {
    finalList: { type: Array, default: [] },
    lastPreferenceId: { type: String },
  },
  websiteFeed: {
    finalList: { type: Array, default: [] },
    lastPreferenceId: { type: String },
  },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

NewsfeedSchema.index({ user: 1 });

module.exports = mongoose.model("Newsfeed", NewsfeedSchema);
