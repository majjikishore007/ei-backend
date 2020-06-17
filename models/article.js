const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  cover: { type: String, required: true },
  price: { type: Number, default: 0 },
  author: { type: String },
  publisher: { type: Schema.Types.ObjectId, ref: "Publisher" },
  content: { type: String },
  category: { type: String },
  time: { type: Number },
  website: { type: String },
  publishingDate: { type: Date, required: true },
  created_at: { type: Date },
  lan: { type: String },
  artImage: { type: String },
  seo: {
    metaTitle: { type: String },
    metaKeywords: { type: String },
    metaDescription: { type: String },
  },
  urlStr: { type: String },
  public: { type: Boolean, default: false },
});

module.exports = mongoose.model("Article", articleSchema);
