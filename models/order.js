const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    article : {type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  }
});

module.exports = mongoose.model('Order', articleSchema);