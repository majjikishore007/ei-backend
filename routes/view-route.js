const router = require('express').Router();
const View = require('../models/view');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth')

router.get('/', checkAuth,  (req, res) => {

})

router.post('/',checkAuth, (req, res) => {
    const view  = new View({
        value : 1,
        user : req.userData.userId,
        article:  req.body.article,
        date: Date.now()
    });
    view.save()
        .then(result => {
            Console.log(result)
            res.json({success: true, code:200, result: "Page view"})
        })
        .catch(err => {
            res.json({success: false, code: 500, error: err})
        })
        
})

router.get('/article/:id', (req, res) => {
    const articleId = req.params.id;
    const d = new Date();
    d.setDate(d.getDate()-14)
    View.aggregate([
        {$match: {$and : [{article : mongoose.Types.ObjectId(articleId)}, {date : {$gt: d}}]}},
        {$group : {
            _id : { year : { $year : "$date" },        
            month : { $month : "$date" },        
            day : { $dayOfMonth : "$date" },}, total: {$sum : '$value'} 
        }},
        {$sort: {'_id.year' : 1, '_id.month': 1, '_id.day' : 1}},
        {$limit : 14},
    ])
      .then(result => {
          res.json(result)
      })
});


router.get('/article-view/:id', (req, res) => {
    const articleId = req.params.id;
    View.aggregate([
        {$match: {article : mongoose.Types.ObjectId(articleId)}},
        {$group : {
            _id : '$article', total: {$sum: '$value'}
        }}
    ]).then(result => {
        if(result.length > 0) {
            res.json({success: true, code : 200, data : result[0].total})
        }else  {
            res.json({success: false, code : 300, data : 0})
        }
    }).catch(err => {
        res.json({success : false, code: 500, data: 0 });
    })
    
});


module.exports =  router
