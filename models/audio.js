const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const audioSchema = new Schema({
  title: { type: String, required: true },
  thumbnail: { type: String },
  description: { type: String, required: true },
  audioUrl: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, default: 0 },
  publisher: { type: Schema.Types.ObjectId, ref: "Publisher" },
  publishingDate: { type: Date, required: true },
  altImage: { type: String },
  seo: {
    metaTitle: { type: String },
    metaKeywords: { type: String },
    metaDescription: { type: String },
  },
  urlStr: { type: String },
  externalLink: { type: Boolean },
  public: { type: Boolean, default: false },
});
audioSchema.index({ category: 1 });

audioSchema.index({ title: "text", description: "text", category: "text" });

module.exports = mongoose.model("Audio", audioSchema);
