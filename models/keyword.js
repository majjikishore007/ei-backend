const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const keyWordSchema = new Schema({
    keyword: {type: String, unique: true},
    count: {type: Number, default: 1},
    for: {type: Number, default: 0},
    against: {type: Number, default:0},
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date,  default: Date.now()},

});

module.exports = mongoose.model('Keyword', keyWordSchema);