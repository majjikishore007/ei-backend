const router = require('express').Router();
const BookMark = require('../models/bookmark');
const Publisher = require('../models/publisher');
const checkAuth = require('../middleware/check-auth');

router.post('/', checkAuth, (req, res) => {
    const bookmark = new BookMark({
        user : req.userData.userId,
        article : req.body.articleId,
        paid : req.body.paid,
        date: Date.now()
    });
    bookmark.save()
            .then(result => {
                res.json({success: true, code: 201, message: 'Bookmark saved'});

            })
            .catch(err => {
                if (err.code === 11000) {
                    res.json({success : false, code: 500, message: 'Bookmarked alreday saved'});
                }else {
                    res.json({success : true, code: 500, message: err.errmsg});
                }
            })
});
router.get('/', checkAuth, (req, res) => {
    BookMark.find({user : req.userData.userId})
            .populate("article")
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
            
            
})

router.get('/update/update', (req, res) => {
BookMark.find()
        .exec()
        .then(result => {
            for(var i=0;i<result.length;i++) {
                BookMark.findByIdAndUpdate(result[i]._id,  {$set: {paid: !result[i].paid}}).exec()
                        .then(rrr => {
                            console.log(rrr);
                        })
            }
            res.json(result);
         })
        
})

router.get('/:articleId',checkAuth, (req, res) => {
    const articleId = req.params.articleId;
    BookMark.findOne({article: articleId, user: req.userData.userId})
            .exec()
            .then(result => {
                res.json({success: true, code: 200, result: result})
            })
            .catch(err => {
                res.json({success: false, code: 500, error: err});
            }) 
})

router.delete('/:id',checkAuth, (req, res) => {
    const id = req.params.id;
    BookMark.deleteOne({$and: [{user: req.userData.userId, article: id}]})
            .exec()
            .then(result => {
                res.json({success : true, code: 200, message: 'deleted'});
            })
            .catch(err => {
                res.json({success : true, code: 200, error: err});
            })
});
module.exports = router