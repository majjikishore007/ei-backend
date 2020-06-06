const router = require('express').Router();
const Article = require('../models/article');
const Credit = require('../models/credit');
const mongoose = require('mongoose');
const User = require('../models/user');
const Publisher = require('../models/publisher');
const checkAuth = require('../middleware/check-auth');
router.get('/', (req, res) => {
    Credit.find()
          .exec()
          .then(result => {
              res.json({success: true, result: result});
          })
          .catch(err => {
              res.json({success: false, error: err});
          })
})

router.post('/', checkAuth, (req, res) => {
    const credit = new Credit({
        _id: mongoose.Types.ObjectId(),
        credit : req.body.credit,
        user : req.userData.userId,
        publisher : req.body.publisher,
        article: req.body.article,
        created_at: Date.now()
    });
    credit.save()
          .then(result => {
           
              return res.json({success: true, code: 200, data: result});
              
          })
          .catch(err => {
              if(err.code === 11000){
                return res.json({success: false, code: 11000, message: "Thankyou, But you alreday paid for this article."});
              }
              return res.json({success: false, code: 503, error: err});
          })
 });


//  credit detail for article

router.get('/article/:id', (req, res) => {
    const articleId = req.params.id;
    Credit.aggregate([
        {$match : {article : mongoose.Types.ObjectId(articleId)}},
        {$group : {
            _id: { year : { $year : "$created_at" },        
            month : { $month : "$created_at" },        
            day : { $dayOfMonth : "$created_at" },}, total: {$sum : '$credit'}
        }},
        {$sort: {'_id.year' : 1, '_id.month': 1, '_id.day' : 1}},
        {$limit : 14}
    ]).then(result => {
        res.json(result);
    })

});

router.get('/user/article/:id', checkAuth, (req, res) => {
    const articleId = req.params.id;
    Credit.countDocuments({$and : [{user: req.userData.userId, article: articleId}]})
          .exec()
          .then(result => {
              if(result> 0) {
                  res.json({success: true, message: 'You has beeen paid for this article'});
              }else {
                  res.json({success: false, error: 'Entry not found'}); 
              }
          })
          .catch(err => {
              res.json({success: false, error: err})
          })
})


router.get('/earning/article/:id' , (req, res) => {
    const article = req.params.id;
    Credit.aggregate([
        {$match:{}},
        {$group: {_id: '$articleId', total:{$sum : '$credit'}}},

    ]).then(result => {
        if(result.length > 0) {
            res.json({success: true, data :result[0].total});
        }else {
            res.json({success: false, data : 0});
        }
    })
    .catch(err => {
        res.json({success: false, data : 0});
    })
})

 module.exports = router

