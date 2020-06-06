const router = require('express').Router();
const Topic = require('../models/topic');
const authCheck = require('../middleware/check-auth');
const Article = require('../models/article');
const images = require('../config/cloud-storage-setup');

router.get('/', (req, res) => {
    Topic.find()
          .exec()
          .then(docs => {
              const response = {
                  success: true,
                  count: docs.length,
                  debates: docs.map(doc => {
                      return {
                          title: doc.title,
                          description: doc.description,
                          cover: doc.cover,
                          keywords:  doc.keywords.split(','),
                          user : doc.user,
                          id : doc._id
                      }
                  })
              };
              res.json(response);
          }).catch(err => {
              res.json({success: false, error: err});
          })
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Topic.findById(id)
          .exec()
          .then(doc => {
              if(doc) {
                  const data = doc.keywords.split(',');
                  keywords = [];
                  for(i=0;i<data.length;i++) {
                      keywords.push({category: new RegExp(data[i], "i")})
                  }
                  Article.find({$or : keywords})
                         .exec()
                         .then(result => {
                             res.json({success: true, topic: doc, articles : result});
                         }).catch(err1 => {
                             res.json({success: false, error: err1})
                         })
                
              }else {
                  res.json({success: false, error: "No Valid entry found"});
              }
          })
          .catch(err => {
              res.json({success: false, error: err});
          })
});

router.post('/', authCheck , images.multer.single('cover'), images.sendUploadToGCS, (req, res) => {
    const topic = new Topic({
        title: req.body.title,
        description : req.body.description,
        cover : req.file.cloudStoragePublicUrl,
        keywords : req.body.keywords,
        user: req.userData.userId,
        urlStr: req.body.title.trim().replace(/[&\/\\#=, +()$~%.'":;*?<>{}]+/ig, '-')
    });
    topic.save() 
          .then(result => {
              res.json({success:  true, result : result});
          })
          .catch(err => {
              res.json({success: false, error: err});
          })
});

router.patch('/:id', (req, res) => {
    const id = req.params.id;
    Topic.updateOne({_id: id}, {$set: req.body})
          .exec()
          .then(result => {
              res.json({success: true, message: "Debate updated"});
          })
          .catch(err => {
              res.json({success: false, error: err});
          })
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Topic.deleteOne({_id: id})
          .exec()
          .then(result => {
              res.json({success: true, message: 'Debate delated'});
          })
          .catch(err => {
              res.json({success: false, error: err});
          })
})

module.exports = router;