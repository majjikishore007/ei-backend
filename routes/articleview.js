const router = require('express').Router();
const Viewarticle = require('../models/articleview');

router.get('/', (req, res) => {
    Viewarticle.find()
       .sort('-_id')
       .populate('news')
       .populate('user')
       .exec()
        .then(result => {
            res.json({success: true, code: 200, result: result});
        })
        .catch(err => {
            res.json({success: false, code: 500, error: err});
        })
  });


  router.get('/byarticle/:articleId', (req, res) => {
    Viewarticle.find({news : req.params.articleId})
       .sort('-_id')
       .populate('news','title')
       .populate('user','displayName')
       .exec()
        .then(result => {
            res.json({success: true, code: 200, result: result});
        })
        .catch(err => {
            res.json({success: false, code: 500, error: err});
        })
  });

  router.get('/:id', (req, res) => {
    const id = req.params.id;
    Viewarticle.find({user:{
        _id:req.params.id
    }})
       .sort('-_id')
       .populate('news')
       .populate('user')
       .exec()
        .then(result => {
            
            res.json({success: true, code: 200, result: result});


        })
        .catch(err => {
            res.json({success: false, code: 500, error: err});
        })
  });

router.post('/', (req, res) => {

const view = new Viewarticle ({
    viewedAt : req.body.viewedAt,
    news : req.body.news,
    user : req.body.user
});

Viewarticle.findOne({news:{_id:req.body.news}},(err,data) => {
    if (err) {
        console.log(err)    
      } 
      else if (!data){

        view.save()
.then(result => {
    res.json({success: true, code: 200, message: result});
})
.catch(err => {
    res.json({success: false, code: 500, error: err});
})
  }
  else{
      console.log("the article you clicked exists!!")
  }


})

})

module.exports = router