const router = require('express').Router();
const Article = require('../models/article');
const Rating = require('../models/rating');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

router.get('/', (req, res) => {
    Rating.find()
          .exec()
          .then(ressult => {
              res.json(ressult);
          }) 
          .catch(err => {
              res.json(err);
          })
})

router.post('/',checkAuth , (req, res) => {
        new Rating({
            value: req.body.ratingValue,
            article: req.body.articleId,
            user: req.userData.userId,
            date: Date.now()
        }).save().then(newRating => {
            res.json({success:  true, message: 'rate successfully'});
        })
        .catch(err => {
            if(err.code === 11000) {
                Rating.updateOne({article:req.body.articleId, user: req.userData.userId}, {$set : {value: req.body.ratingValue}})
                      .then(output => {
                          res.json({success: true, message: 'update rating'});
                      })
            } else {
                res.json({success:  false, message: err.errmsg});
            }
        })  
});



router.get('/user/:articleId', checkAuth, (req, res) => {
    const articleId = req.params.articleId;
    const userId = req.userData.userId;
    Rating.findOne({article:articleId, user: userId})
          .exec()
          .then(result => {
              res.json({success: true, result: result});
          }).catch(err => {
            res.json({success: false , result: "No data found"});
          })
});

router.get('/:userId',  (req, res) => {
   
    const userId = req.params.userId;
    Rating.find({ user: userId})
          .exec()
          .then(result => {
              res.json({success: true, result: result});
          }).catch(err => {
            res.json({success: false , result: "No data found"});
          })
});

router.get('/aggregate/all', (req, res) => {
    Rating.aggregate([
        
        {
        $group : {
            _id : '$article', average : {$avg: '$value'}, total : { $sum: 1 }
        }
    }]).exec()
      .then(result => {
          ratings = {};
          for(var i=0;i<result.length;i++) {
              ratings[result[i]._id] = {avg: result[i].average, total : result[i].total}
          }
          res.json(result);
      })
})


router.get('/article/:id', (req, res) => {
    const articleId = req.params.id;
    Rating.aggregate([
        {$match : {article : mongoose.Types.ObjectId(articleId)}},
        {$group :  {
            _id: '$article', average: {$avg: '$value'}, total : {$sum : 1}
        }}
    ]).exec()
      .then(result => {
          if(result.length > 0){
              res.json({success:true ,code: 200, data: result[0]});
          } else {
              res.json({success: false , code: 404,  data: 0});
          }
      })
      .catch(err => {
          res.json({success: false, data: 'data error'});
      })
});

module.exports = router;