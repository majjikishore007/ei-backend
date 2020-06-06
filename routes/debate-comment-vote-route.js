const router = require('express').Router();
const DebateCommentVote = require('../models/debate_comment_vote');
const checkAuth = require('../middleware/check-auth');

router.get('/', (req, res) => {
    res.json("need to do this");
});

router.post('/', checkAuth, (req, res) => {
    const debateCommentVote = new DebateCommentVote({
        debate : req.body.debate,
        user : req.userData.userId,
        comment : req.body.comment,
        vote : true   // true = upvote , false = downvote 
    });
    debateCommentVote.save()
                     .then(result => {
                         res.json({success: true, message: 'vote has been adeed', result : result});
                     })
                     .catch(err => {
                         res.json({success: false, error: err})
                     })
})

router.get('commnet/:id', (req, res) => {
    
})

module.exports = router;