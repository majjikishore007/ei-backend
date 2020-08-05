const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const publisherSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  about: { type: String, required: true },
  website: { type: String, required: true, unique: true },
  feedurl: { type: [String] },
  address: { type: String, required: true },
  city: { type: String },
  zip: { type: Number },
  income: { type: Number, default: 0 },
  logo: { type: String },
  verified: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  urlStr: { type: String },
});

module.exports = mongoose.model("Publisher", publisherSchema);
