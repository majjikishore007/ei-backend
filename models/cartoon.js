const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const cartoonSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    cover: {type: String, required: true}, 
    author: {type: String, required: true}, 
    category:{type:String, default: 'General'},
    date: {type: Date},
    updated_at : { type: Date },
    created_at: { type: Date },
    urlStr: { type: String, required: true, unique: true},

});

module.exports = mongoose.model('Cartoon', cartoonSchema);