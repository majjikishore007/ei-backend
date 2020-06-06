const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const preferenceSchema = new Schema({
    user : {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    category:[{
      name : {type: String},
      selected : {type: Boolean}
    }]
});

module.exports = mongoose.model('Preference', preferenceSchema);