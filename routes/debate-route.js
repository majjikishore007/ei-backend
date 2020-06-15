const router = require('express').Router();
const Debate = require('../models/debate');
const authCheck = require('../middleware/check-auth');
const Article = require('../models/article');
const images = require('../config/cloud-storage-setup');

router.get('/', (req, res) => {
    Debate.find()
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
                          moderator : doc.moderator,
                          start_date : doc.start_date,
                          end_date: doc.end_date,
                          id : doc._id
                      }
                  })
              };
              res.json(response);
          }).catch(err => {
              res.json({success: false, error: err});
          })
});
router.get('/debate/:id', (req, res) => {
    const id = req.params.id;
    Debate.findById(id)
          .exec()
          .then(result => {
              res.json({success : true, result: result})
          })
          .catch(err => {
              res.json({success: false, error: err});
          })
})
router.get('/:id', (req, res) => {
    const id = req.params.id;
    Debate.findById(id)
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
                             res.json({success: true, debate: doc, articles : result});
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
    const debate = new Debate({
        title: req.body.title,
        description : req.body.description,
        cover : req.file.cloudStoragePublicUrl,
        keywords : req.body.keywords,
        moderator: req.userData.userId,
        start_date : req.body.start_date,
        end_date: req.body.end_date,
        urlStr: req.body.title.trim().replace(/[&\/\\#=, +()$~%.'":;*?<>{}]+/ig, '-')
    });
    debate.save() 
          .then(result => {
              res.json({success:  true, result : result});
          })
          .catch(err => {
              res.json({success: false, error: err});
          })
});

router.patch('/:id', authCheck, (req, res) => {
    const id = req.params.id;
    Debate.updateOne({_id: id}, {$set: req.body})
          .exec()
          .then(result => {
              res.json({success: true, message: "Debate updated"});
          })
          .catch(err => {
              res.json({success: false, error: err});
          })
});

router.patch('/updateImage/:id', authCheck , images.multer.single('cover'), images.sendUploadToGCS, (req, res) => {
    const id  = req.params.id;
    const data = {
        cover : req.file.cloudStoragePublicUrl
    };
    Debate.updateOne({_id: id}, {$set:  data})
          .exec()
          .then(result => {
              res.json({success: true, message: "Image has been updated"})
          })
          .catch(err => {
              res.json({success: false, error: err})
          })
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Debate.deleteOne({_id: id})
          .exec()
          .then(result => {
              res.json({success: true, message: 'Debate delated'});
          })
          .catch(err => {
              res.json({success: false, error: err});
          })
})

module.exports = router;