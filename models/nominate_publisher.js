const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const nominatePublisherSchema = new Schema({
  name: { type: String, required: true },
  website: { type: String },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("NominatePublisher", nominatePublisherSchema);
