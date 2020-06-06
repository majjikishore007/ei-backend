const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: {type: String,},
    description: {type: String},
    cover: {type: String},
    price: {type: Number, default: 0}, 
    author: {type: String,}, 
    publisher: {type: Schema.Types.ObjectId, ref:'Publisher'}, 
    content: {type: String},
    category:{type:String},
    time: {type: Number},
    website: {type: String,},
    publishingDate: { type: Date },
    created_at: { type: Date },
    lan: {type:String},
    seo : { metaTitle:{type:String}, metaKeywords:{type:String}, metaDescription: {type:String} },
    urlStr: { type: String},
    public: {type: Boolean, default: false},

});

module.exports = mongoose.model('Article', articleSchema);