const router = require('express').Router();
const DebateComment = require('../models/debate_comment');
const authCheck = require('../middleware/check-auth');

router.get('/', (req, res) => {
    
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    DebateComment.findById(id)
          .exec()
          .then(doc => {
              if(doc) {
                  res.json({success: true, result: doc});
              }else {
                  res.json({success: false, error: "No Valid entry found"});
              }
          })
          .catch(err => {
              res.json({success: false, error: err});
          })
});

router.post('/', authCheck, (req, res) => {
    const debateComment = new DebateComment({
        debate: req.body.debate,
        user: req.userData.userId,
        type: req.body.type,
        message: req.body.message
    });
    debateComment.save() 
          .then(result => {
              res.json({success:  true, result : result});
          })
          .catch(err => {
              res.json({success: false, error: err});
          })
});

router.patch('/:id', (req, res) => {
    const id = req.params.id;
    DebateComment.updateOne({_id: id}, {$set: req.body})
          .exec()
          .then(result => {
              res.json({success: true, message: "Debate updated"});
          })
          .catch(err => {
              res.json({success: false, error: err});
          })
});

router.delete('/:id', authCheck, (req, res) => {
    const id = req.params.id;
    const userId = req.userData.userId
    DebateComment.deleteOne({$and: [{_id: id}, {user: userId}]})
          .exec()
          .then(result => {
              res.json({success: true, message: 'Comment remove from debate'});
          })
          .catch(err => {
              res.json({success: false, error: err});
          })
})

router.get('/debate/:id', (req, res) => {
    const debate_id = req.params.id;
    DebateComment.find({debate: debate_id})
                 .sort('-_id')
                 .populate("user")
                 .exec()
                 .then(result => {
                     res.json({success: true, result: result});
                 })
                 .catch(err => {
                     res.json({success: false, error: err});
                 })

});
router.patch('/vote/:num/:id', (req, res) => {
    const n = req.params.num;
    const id = req.params.id;
    if(n===0){
        //upvote here
        DebateComment.update({_id: co})
    } else {
        // downvote here

    }

})

router.get('/amin/amin', (req, res) => {
    DebateComment.aggregate()
                 .exec()
                 .then(result => {
                     res.json(result)
                 })
                 .catch(err => {
                     res.json(err)
                 })
})

module.exports = router;