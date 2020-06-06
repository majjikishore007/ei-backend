const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const bookmark = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User'},
    article: { type: Schema.Types.ObjectId, required: true, ref: 'Article'},
    paid: { type: Boolean,  default: false },
    date: { type:Date, required: true}
});
bookmark.index({user: 1, article: 1}, {unique: true});
module.exports = mongoose.model('Bookmark', bookmark);