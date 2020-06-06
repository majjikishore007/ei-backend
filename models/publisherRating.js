const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const publisherRating = new Schema({
    value: {type: Number, required: true, },
    user: { type:Schema.Types.ObjectId, required: true, ref: 'User'},
    publisher: { type:Schema.Types.ObjectId, required: true, ref: 'Publisher'},
    date: { type:Date, required: true}
});
publisherRating.index({user: 1, publisher:1}, {unique: true});
module.exports = mongoose.model('Publisherrating', publisherRating);