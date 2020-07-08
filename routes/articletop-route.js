const router = require('express').Router();
const ArticleTop = require('../models/article-top');
const Rating = require('../models/rating');
const images = require('../config/cloud-storage-setup');
const Usernotification = require("../models/usernotification");
const Publisher = require('../models/publisher');
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

 router.get('/mobile', (req, res) => {
    ArticleTop.find()
       .sort('-_id')
       .populate('article')
       .exec((err, publisher) => {
           Publisher.populate(publisher, {
               path: 'article.publisher'
           })
           .then(docs => {
               const response = {
                   count: docs.length,
                   articles : docs.map(
                       doc => {
                           return {
                            title: doc.article.title,
                            description:  doc.article.description,
                            price: doc.article.price,
                            author: doc.article.author,
                            cover: doc.article.cover,
                            publisher: doc.article.publisher,
                            website: doc.article.website,
                            category: doc.article.category,
                            time: doc.article.time,
                            date:doc.article.publishingDate,
                            id: doc.article.id,
                            lan : doc.article.lan,
                            urlStr: doc.article.urlStr
                           }
                       }
                   )
               }
               res.json({success: true, articles: response.articles })
           })
           .catch(err => {
               res.json({success: false, error: err})
           })
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