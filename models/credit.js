const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const creditSchema = new Schema({
    _id : {type: Schema.Types.ObjectId, required: true},
    credit: {type: Number, required: true},
    user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    publisher: {type: Schema.Types.ObjectId, required: true, ref: 'Publisher'},
    article: {type: Schema.Types.ObjectId,  ref:'Article'},
    created_at : {type: Date, required: true}
});

creditSchema.index({userId: 1, articleId:1}, {unique: true});
module.exports = mongoose.model('Credit', creditSchema);