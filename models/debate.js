const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const debateSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    cover: {type: String, required: true}, 
    moderator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    keywords : {type: String, required: true},
    urlStr: { type: String, required: true, unique: true},
    start_date: {type: Date, default: Date.now()},
    end_date: {type : Date, default: Date.now()},
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date,  default: Date.now()},

});

module.exports = mongoose.model('Debate', debateSchema);