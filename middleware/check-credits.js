const Credit = require('../models/credit');
const mongoose = require('mongoose');

module.exports = (req, res, next) => {
    Credit.aggregate([
        { $match: { user: mongoose.Types.ObjectId(req.userData.userId), capture: true}},
        {$group: {_id: null, total: {$sum: '$credit'}}}
    ]).then(result =>{
        if(result) {
            req.credits = result[0].total
        }else {
            req.credits = 0;
        }
        next();
    }).catch(err => {
        res.json({success: false, error: err});
    })
};