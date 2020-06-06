const router = require('express').Router();
const Article = require('../models/article');
const Publisherrating = require('../models/publisherRating');
const checkAuth =  require('../middleware/check-auth')
router.get('/', (req, res) => {
   Publisherrating.find().exec()
                  .then(result => {
                      res.json({success: true, result: result});

                  })
                  .catch(err => {
                      res.json({success : false, error: err});
                  })
});

router.post('/', checkAuth, (req, res) => {
    const publisherrating = new Publisherrating({
        value : req.body.ratingValue,
        publisher: req.body.publisherId,
        user: req.userData.userId,
        date: Date.now()

    });
    publisherrating.save()
                   .then(result => {
                       res.json({success: true, code: 200, message: 'rating successfully'});
                   })
                   .catch(err => {
                       if(err.code ===  11000) {
                           Publisherrating.updateOne({publisher: req.body.publisherId, user: req.userData.userId}, {$set : {value: req.body.ratingValue}})
                                          .then(output => {
                                              res.json({success: true, message: 'update rating'});                                          })
                       } else {
                           res.json({success: false, message: err.errmsg});
                       }
                   })

    
});

router.get('/user/:publisherId', checkAuth, (req, res) => {
    const publisherId = req.params.publisherId;
    const userId = req.userData.userId;
    Publisherrating.findOne({publisher: publisherId, user: userId})
                   .exec()
                   .then(result => {
                       res.json({success: true, result: result});

                   })
                   .catch(err => {
                       res.json({success: false, result: 'No data found'});
                   })

})





module.exports = router;