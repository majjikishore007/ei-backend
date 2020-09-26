const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const authorPageSchema = new Schema({
  name: { type: String, required: true },
  coverImage: { type: String },
  profilePic: { type: String },
  bio: { type: String },
  website: { type: String },
  articleList: [{ type: Schema.Types.ObjectId, ref: "Article" }],
  authorizedUser: { type: mongoose.Types.ObjectId, ref: "User" },
  claimStatus: {
    type: String,
    enum: ["NONE", "UNDER_VERIFICATION", "VERIFIED"],
    default: "NONE",
  },
  publisher: { type: Schema.Types.ObjectId, ref: "Publisher" },
  organization: { type: String },
  claims: [
    {
      claimByUser: { type: mongoose.Types.ObjectId, ref: "User" },
      claimingDocumentType: { type: String },
      claimingDocument: { type: String }, //uploaded file link of doc like voter ID, Aadhar ID, Drivinf Licence
    },
  ],
  urlStr: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
authorPageSchema.index({ name: 1 });
authorPageSchema.index({ urlStr: 1 });

module.exports = mongoose.model("AuthorPage", authorPageSchema);
