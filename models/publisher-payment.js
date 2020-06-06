const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const publisherPaymentSchema = new Schema({
    credit: {type: Number, required: true},
    amount: {type: Number},
    user: {type: Schema.Types.ObjectId,  ref: 'User'},
    publisher: {type: Schema.Types.ObjectId,  ref: 'Publisher'},
    capture:{type: Boolean, default: false},
    created_at : {type: Date, required: true}
});

module.exports = mongoose.model('Credit', publisherPaymentSchema);