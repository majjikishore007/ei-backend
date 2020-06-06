const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const articleViewSchema = new Schema({
    viewedAt: {type: Number, required: true},
    news: {type: mongoose.Types.ObjectId, required: true, ref: 'Article'}, 
    user: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}

});

module.exports = mongoose.model('Viewarticle', articleViewSchema);