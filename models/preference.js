const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const preferenceSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  keyword: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Keyword",
  },
});

preferenceSchema.index({ user: 1 });
preferenceSchema.index({ user: 1, keyword: 1 }, { unique: true });

module.exports = mongoose.model("Preference", preferenceSchema);
