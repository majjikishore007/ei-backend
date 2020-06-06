const router = require('express').Router();
const Follow = require('../models/follow');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const Publisher = require('../models/publisher');
router.get('/', checkAuth, (req, res) => {
    Follow.find({user: req.userData.userId})
          .exec()
          .then(result => {
              res.json({success: true, code: 200, result : result});
          })
          .catch(err => {
              res.json({success: false, code: 500, error: err});
          })
});

router.post('/', checkAuth, (req, res) => {
    const follow = new Follow({
        count:1,
        publisher: req.body.publisherId,
        user : req.userData.userId,
        date : Date.now()
    });
    follow.save()
          .then(result => {
              res.json({success: true, code: 200, message: 'following successfully'});
          })
          .catch(err => {
              if(err.code === 11000) {
                  res.json({success: false, code: 500, message: 'alreday follow'});

              } else {
                res.json({success: false, code: 500, message: err.errmsg});
              }
          })
});

//  Data according to publisher ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  Follow.find({publisher: id})
        .populate('user', 'displayName email thumbnail _id')
        .exec()
        .then(result => {
             res.json({success: true, code: 200, result: result, });
        })
        .catch(err => {
            res.json({success: false, code: 500, result: err});
        })

});

// Data according to userId
router.get('/user/publisher/:userId', (req, res) => {
    const id = req.params.userId;
    Follow.find({user: id})
          .populate('publisher name')
          
          .exec()
          .then(result => {
              res.json({success: true, code:200, result:result});
          })
          .catch(err => {
              res.json({success: false, code: 500, error: err});
          })
});

router.get('/listofpub/:userId', async (req, res) => {
    const id = req.params.userId;
  
    const publisher =  await Publisher.find({userId:req.params.userId}).exec()
    pubdata = []
    for(x of publisher){
        data = {
            pubname : x.name,
            followers : await Follow.find({publisher:x._id})
        }
       await pubdata.push(data)
    }
  // console.log(pu)
    await res.json(pubdata)
});

router.get('/user/publisher/:id', checkAuth, (req, res) => {
    const userId = req.userData.userId;
    const publisherId = req.params.id;
    Follow.findOne({user: userId, publisher: publisherId})
          .exec()
          .then(result => {
              res.json({success: true, result: result})             
           })
           .catch(err => {
               res.json({success: false, result: result})
           })
});

router.delete('/user/publisher/:id',checkAuth, (req, res) => {
    const userId = req.userData.userId;
    const publisherId =  req.params.id;
    Follow.remove({user: userId, publisher: publisherId})
          .exec()
          .then(result => {
            res.json({success: true, message: 'unfollow'});
          })
          .catch(err => {
            res.json({ success : false, code: 500, message: err.name})
          })
});

router.get('/aggregate/all', checkAuth, (req, res) => {
    const id = req.userData.userId;
    Follow.aggregate([
        {$match : {
            user: mongoose.Types.ObjectId(id)
        }},
        {
        $group : {
            _id : '$publisher',  total : { $sum: 1 }
        }
    }]).exec()
      .then(result => {
          followers = {};
          for(var i=0;i<result.length;i++) {
              followers[result[i]._id] =  result[i].total
          }
          res.json(followers);
      })
})



module.exports = router;