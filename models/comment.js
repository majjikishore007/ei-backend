const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const comment = new Schema({
    message: {type: String, required: true},
    user: { type:Schema.Types.ObjectId, required: true, ref: 'User'},
    article: { type:Schema.Types.ObjectId, required: true, ref: 'Article'},
    date: { type:Date, required: true}
});

module.exports = mongoose.model('Comment',comment);