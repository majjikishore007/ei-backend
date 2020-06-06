const router = require('express').Router();
const ArticleTop = require('../models/article-top');
const Rating = require('../models/rating');
const images = require('../config/cloud-storage-setup');
const Usernotification = require("../models/usernotification");

router.get('/', (req, res) => {
   ArticleTop.find()
      .sort('-_id')
      .populate('article')
       .exec()
       .then(result => {
           res.json({success: true, code: 200, result: result});
       })
       .catch(err => {
           res.json({success: false, code: 500, error: err});
       })
 });

 router.post('', (req, res, next) => {
   const articleTop = new ArticleTop({
      article:req.body.article, 
    
   });
   articleTop.save()
          .then(result => {
              //console.log(result);
              res.json({ success : true , code : 201, message : 'article has been submitted', result: result});
              
         
           })
          .catch(err => {
              console.log(err);

              res.json({success : false, code: 500, message : err});
          })
})


router.delete('/:id', (req, res) => {
   const id = req.params.id;
   ArticleTop.remove({_id: id})
       .exec()
       .then(result => {
           res.json({success: true, code: 200, message: result});
       })
       .catch(err => {
           res.json({success: false, code: 500, error: err});
       })
}) 







module.exports = router;