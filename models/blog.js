const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    cover: {type: String, required: true}, 
    author: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}, 
    content: {type: String},
    category:{type:String, default: 'General'},
    updated_at : { type: Date },
    created_at: { type: Date },
    seo : { metaTitle:{type:String}, metaKeywords:{type:String}, metaDescription: {type:String} },
    urlStr: { type: String, required: true, unique: true},

});

module.exports = mongoose.model('Blog', blogSchema);