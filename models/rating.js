const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const rating = new Schema({
    value: {type: Number, required: true, },
    user: { type:Schema.Types.ObjectId, required: true, ref: 'User'},
    article: { type:Schema.Types.ObjectId, required: true, ref: 'Article'},
    date: { type:Date, required: true}
});
rating.index({user: 1, article:1}, {unique: true});
module.exports = mongoose.model('Rating', rating);