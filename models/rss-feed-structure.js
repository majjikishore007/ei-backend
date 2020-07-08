const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const rssFeedStructureSchema = new Schema({
  titleField: { type: String },
  contentField: { type: String },
  descriptionField: { type: String },
  linkField: { type: String, required: true },
  pubDateField: { type: String },
  publisherId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Publisher",
    unique: true,
  },
  categoryField: { type: String },
  authorField: { type: String },
  imageField: { type: String },
});

rssFeedStructureSchema.index({ publisherId: 1 }, { unique: true });

module.exports = mongoose.model("RssFeedStructure", rssFeedStructureSchema);
