const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const debateCounterCommnetSchema = new Schema({
    debate: {type: mongoose.Types.ObjectId, required: true, ref: 'Debate'},
    user : {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    parent_comment : {type: mongoose.Types.ObjectId, required: true, ref: 'DebateComment'},
    message: {type: String, required: true},
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date,  default: Date.now()},

});

module.exports = mongoose.model('DebateCounterComment', debateCounterCommnetSchema);