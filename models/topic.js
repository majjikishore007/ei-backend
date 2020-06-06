const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const topicSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    cover: {type: String, required: true}, 
    user: {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    keywords : {type: String, required: true},
    urlStr: { type: String, required: true, unique: true},
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date,  default: Date.now()},

});

module.exports = mongoose.model('Topic', topicSchema);