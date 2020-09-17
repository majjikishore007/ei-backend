const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const plalistSchema = new Schema({
  thumbnail: { type: String },
  title: { type: String, require: true },

  shortDescription: { type: String },

  articles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
  audio: [{ type: Schema.Types.ObjectId, ref: "Audio" }],
  video: [{ type: Schema.Types.ObjectId, ref: "Video" }],
});

module.exports = mongoose.model("Playlist", plalistSchema);