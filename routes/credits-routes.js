const router = require('express').Router();
const Article = require('../models/article');
const Credit = require('../models/credit');
const mongoose = require('mongoose');
const User = require('../models/user');
const Publisher = require('../models/publisher');
const checkAuth = require('../middleware/check-auth');
const checkCredits = require('../middleware/check-credits')

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

router.post('/', checkAuth, checkCredits, (req, res) => { 
    User.findById(req.userData.userId)
        .exec()
        .then(user => {
            if(req.credits >= req.body.credit) {
                const creditDoc = new Credit({
                    credit: (-1)*req.body.credit,
                    amount: (-1)*req.body.amount,
                    user :  req.userData.userId,
                    publisher: req.body.publisher,
                    pub_amount: (-1)*req.body.amount/2,
                    article :  req.body.article,
                    capture: true,
                    created_at : Date.now()
                });
                creditDoc.save()
                         .then(result => {
                              User.updateOne({_id: req.userData.userId}, {$inc: {credits: (-1)*req.body.credit}}).exec();
                              res.json({success: true, message: 'credit has been used for this article'})

                         }).catch(err => {
                             if(err.code === 11000) {
                                res.json({success: false, error: 'You alraedy paid for this article' });
                             }else{
                                 res.json({success: false, error: err})
                             }
                             
                         })
            }else {
                res.json({success: false, error: 'you don\'t have enough credit for this article'});
            }
        })
});


router.get('/user/article/:id', checkAuth, (req, res) => {
    const articleId = req.params.id;
    Credit.countDocuments({$and: [{article: articleId}, {user: req.userData.userId}]})
        .exec()
        .then(result => {
            if(result > 0) {
                res.json({success: true, code: 200, message: 'Paid'});
            }else {
                res.json({success: false, code: 404, message: 'Unpaid'});
            }
        })
        .catch(err => {
            res.json({success: false, code: 500, message: 'Unpaid'})
        })
})

//  credit detail for article

router.get('/article/:id', (req, res) => {
    const articleId = req.params.id;
    const d = new Date();
    d.setDate(d.getDate()-14)
    Credit.aggregate([
        {$match : { $and :[{article : mongoose.Types.ObjectId(articleId)}, {created_at : {$gt: d}}]}},
        {$group : {
            _id: { year : { $year : "$created_at" },        
            month : { $month : "$created_at" },        
            day : { $dayOfMonth : "$created_at" },}, total: {$sum : '$credit'}, user : {$sum: 1}
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
              if(result > 0) {
                  res.json({success: true, message: 'You has beeen paid for this article'});
              }else {
                  res.json({success: false, error: 'Entry not found'}); 
              }
          })
          .catch(err => {
              res.json({success: false, error: err})
          })
})


router.get('/earning/:id' , (req, res) => {
    const article = req.params.id;
    Credit.aggregate([
        {$match:{article : mongoose.Types.ObjectId(article)}},
        {$group: {_id: '$article', total:{$sum : '$credit'}}},

    ]).then(result => {
        if(result.length > 0) {
            result[0].total = (-1)*result[0].total/4;
            res.json({success: true, data :result[0].total});
        }else {
            res.json({success: false, data : 0});
        }
    })
    .catch(err => {
        res.json({success: false, data : 0});
    })
})

router.get('/user', checkAuth, (req, res) => {
   Credit.find({$and: [{user: req.userData.userId}, {bank: false}]})
         .sort('-_id')
         .populate('article', 'title urlStr')
         .exec()
         .then(result => {
             res.json({success : true, credits: result})
         })
         .catch(err => {
             res.json({success: false, error: err})
         })
})

router.get('/aggergate/user',checkAuth, (req, res) => {
    Credit.aggregate([
        { $match: { $and: [{user: mongoose.Types.ObjectId(req.userData.userId)}, {capture: true}, {bank: false}]}},
        {$group: {_id: null, total: {$sum: '$credit'}}}
    ]).then(result =>{
        res.json({success: true, credits : result[0].total})
    }).catch(err => {
        res.json({success: false, error: err});
    })
})

router.get('/purchased/article', checkAuth, (req, res) => {
    Credit.find({ $and : [{user: req.userData.userId }, {credit : {$lt: 0}}]})
          .select('article')
          .populate('article')
          .exec((err, publisher) => {
            Publisher.populate(publisher, {
                path: 'article.publisher'
            })
            .then(result => {
                res.json({success:  true, result: result});
            })
            .catch(err => {
                res.json({err:  false, error: err});
            })
          })
        });

router.get('/earning/publisher/:id', (req, res) => {
    const publisherId = req.params.id;
    Credit.aggregate([
        {$match: {publisher: mongoose.Types.ObjectId(publisherId)}},
        {$group:{_id: '$publisher', total: {$sum: '$credit'}}}
    ]).then(result => {
       if(result.length > 0) {
           result[0].total = (-1)*result[0].total/2;
           res.json({success: true, data : {credit: result[0].total, earning: result[0].total/4}})
       }else {
        res.json({success: true, data: { credit: 0, earning: 0}})
       }
        
    }).catch(err => {
        res.json({success: false, error: err})
    })
})


router.get('/details/publisher/:id', (req, res) => {
    const publisherId = req.params.id;
    Credit.find({publisher : publisherId})
          .sort('-_id')
          .exec()
          .then(result => {
              res.json({success: true, result: result})
          })
          .catch(err => {
              res.json({success: false, error: err})
          })
})

router.post('/payment/publisher', checkAuth, (req, res) => {
    const creditDoc = new Credit({
        credit: req.body.credit,
        amount: req.body.amount,
        pub_amount: req.body.amount/2,
        user :  req.userData.userId,
        publisher: req.body.publisher,
        capture: true,
        created_at : Date.now(),
        bank: true,
    })
    creditDoc.save()
             .then(result => {
                res.json({success :true, result: result})
             })
             .catch(err => {
                 res.json({success : false, error : err});
             })
})

module.exports = router