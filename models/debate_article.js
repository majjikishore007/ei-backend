const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const debateArticleSchema = new Schema({
    debate: {type: mongoose.Types.ObjectId, required: true, ref: 'Debate'},
    article : {type: mongoose.Types.ObjectId, required: true, ref: 'Article'},
    user : {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    type: {type: Boolean, required: true},
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date,  default: Date.now()},

});
debateArticleSchema.index({debate: 1, article:1}, {unique: true});
module.exports = mongoose.model('DebateArticle', debateArticleSchema);