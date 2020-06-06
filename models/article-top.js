const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const articleTopSchema = new Schema({
    article:{type: Schema.Types.ObjectId, ref:'Article'}, 
    displayTop:{type: Boolean , default: true}
});



module.exports = mongoose.model('ArticleTop', articleTopSchema);