const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const videoSchema = new Schema({
  title: { type: String, required: true },
  thumbnail: { type: String },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
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
  videoLength: { type: Number },
  embeddUrl: { type: String },
  public: { type: Boolean, default: false },
});
videoSchema.index({ category: 1 });

module.exports = mongoose.model("Video", videoSchema);
