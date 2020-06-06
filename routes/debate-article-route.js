const router = require('express').Router();
const DebateArticle = require('../models/debate_article');
const authCheck = require('../middleware/check-auth');

router.get('/', (req, res) => {
    
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    DebateArticle.findById(id)
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
router.get('/debatefor/:id/', (req, res) => {
    const debate_id = req.params.id;
    DebateArticle.find({$and: [{debate: debate_id}, {type: true}]})
                 .populate('article')
                 .exec()
                 .then(result => {
                     res.json({success: true, result: result});
                 })
                 .catch(err => {
                     res.json({success: false, error: err});
                 })
});
router.get('/debateagainst/:id/', (req, res) => {
    const debate_id = req.params.id;
    DebateArticle.find({$and: [{debate: debate_id}, {type: false}]})
                 .populate('article')
                 .exec()
                 .then(result => {
                     res.json({success: true, result: result});
                 })
                 .catch(err => {
                     res.json({success: false, error: err});
                 })
});

router.post('/', authCheck, (req, res) => {
    const debateArticle = new DebateArticle ({
        debate: req.body.debate,
        article: req.body.article,
        type: req.body.type,
        user: req.userData.userId
    });
    debateArticle.save() 
          .then(result => {
              res.json({success:  true, result : result});
          })
          .catch(err => {
              res.json({success: false, error: err});
          })
});

router.patch('/:id', (req, res) => {
    res.json("No need to patch rouetes")
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    DebateArticle.deleteOne({_id: id})
          .exec()
          .then(result => {
              res.json({success: true, message: 'Article remove from debate'});
          })
          .catch(err => {
              res.json({success: false, error: err});
          })
})

router.get('/debate/:id1/article/:id2', (req, res) => {
    const debate_id = req.params.id1;
    const article_id = req.params.id2
    DebateArticle.findOne({$and : [{debate: debate_id}, {article: article_id}]})
                 .exec()
                 .then(result => {
                     if(result) {
                     res.json({success: true, result: result})
                     }else{
                        res.json({success: false, error: "Np data found"})  
                     }
                 })
                 .catch(err =>{
                     res.json({success: false, error: err})
                 })
});

module.exports = router;