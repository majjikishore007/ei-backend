const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    _id : {type: Schema.Types.ObjectId, required:true},
    order: {type: String, required: true, unique: true},
    amount: {type: Number, required: true},
    capture: {type: Boolean, required: true},
    receipt: {type: String, required: true},
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User'},
    created_at: {type:Date, required: true}
  
});

module.exports = mongoose.model('Payment', paymentSchema);