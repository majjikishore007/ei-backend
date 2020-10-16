const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const curatorPageSchema = new Schema({
  name: { type: String, required: true },
  coverImage: { type: String },
  profilePic: { type: String },
  bio: { type: String },
  journalist:{type:Boolean},
  publishers:{
    existingPublishers:[{type: Schema.Types.ObjectId, ref: "Publisher"}],
    nominatedPublishers:{type:String}
  },
  website: { type: String },
  socialLinks:{
      facebook:{type:String},
      twitter:{type:String},
      instagram:{type:String},
      linkedin:{type:String},
  },
  speciality:{type:String},
  categories:{type:String},
  languages:{type:String},
  contactEmailVisible:{type:Boolean},
  associationDetail:{
    role:{type:String},
    university:{type:String}
  },
  articleList: [{ type: Schema.Types.ObjectId, ref: "Article" }],
  authorizedUser: { type: mongoose.Types.ObjectId, ref: "User" },
  claimStatus: {
    type: String,
    enum: ["NONE", "UNDER_VERIFICATION", "VERIFIED"],
    default: "NONE",
  },
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
curatorPageSchema.index({ name: 1 });
curatorPageSchema.index({ urlStr: 1 });

module.exports = mongoose.model("CuratorPage", curatorPageSchema);
