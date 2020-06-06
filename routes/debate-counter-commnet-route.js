const router = require('express').Router();
const DebateCounterComment = require('../models/debate_counter_comment');
const authCheck = require('../middleware/check-auth');

router.get('/', (req, res) => {
   res.json("get All commnets");
})

router.get('parentComment/:id', (req, res) => {
    const parent_comment_id = req.params.id;
    DebateCounterComment.find({parent_comment : parent_comment_id})
                        .sort('-_id')
                        .exec()
                        .then(result => {
                            res.json({success: true, result: result})
                        })
                        .catch(err => {
                            res.json({success: false, error: err})
                        })
});

router.post('/', authCheck, (req, res) => {
    const debateCounterComment = new DebateCounterComment({
        debate :  req.body.debate,
        user : req.userData.userId,
        parent_comment: req.body.comment,
        message: req.body.message
    })
    debateCounterComment.save()
                        .then(result => {
                            res.json({success: true, result:result})
                        })
                        .catch(err => {
                            res.json({success: false, error: err})
                        })
})

module.exports = router;