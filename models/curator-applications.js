const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const CuratorApplication = new Schema({
  name: { type: String },
  email: { type: String },
  fbLink:{type:String},
  twitterLink:{type:String},
  linkedinLink:{type:String},
  mediumLink:{type:String},
  websiteLink:{type:String},
  articleLink: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

CuratorApplication.index({name:1,email:1},{unique:true});

module.exports = mongoose.model("CuratorApplication", CuratorApplication);
