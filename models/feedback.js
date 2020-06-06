const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    user:{ type:Schema.Types.ObjectId, required: true, ref: 'User'},
    like : {type: Number},
   ease: {type: Number},
   addonNote:{type:String},
   refused: {type: Boolean},
});

module.exports = mongoose.model('Feedback', feedbackSchema);