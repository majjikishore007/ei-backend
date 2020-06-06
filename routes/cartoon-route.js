const router = require('express').Router();
const Cartoon = require('../models/cartoon')
const images = require('../config/cloud-storage-setup');

router.get('/', (req, res) => {
    Cartoon.find()
           .sort('-_id')
           .exec()
           .then(result => {
               res.json({success : true, code: 200, result: result});
           })
           .catch(err => {
               res.json({success: false, code: 500, error: err});
           });
})

router.post('/', images.multer.single('cover'), images.sendUploadToGCS, (req, res) => {
   const cartoon = new Cartoon({
       title: req.body.title,
       description: req.body.description,
       cover : req.file.cloudStoragePublicUrl,
       author: req.body.author,
       category: req.body.category,
       date :  req.body.date,
       updated_at : Date.now(),
       created_at: Date.now(),
       urlStr : req.body.title.trim().replace(/[&\/\\#, +()$~%.'":*?<>{}]+/ig, '-') 
   });
   cartoon.save()
          .then(result => {
              res.json({success: true, code: 200, message:'cartoon has been uploaded'})
          })
          .catch(err => {
            res.json({success: false, code: 500, err: err});
          });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Cartoon.findById(id)
           .exec()
           .then(result => {
               res.json({success: true, code: 200, result: result});
           })
           .catch(err => {
               res.json({success: false, code: 500, error: err});
           });
});

router.patch('/:id', (req, res) => {
    const id = req.params.id;
    Cartoon.update({_id:id}, {$set: req.body})
           .exec()
           .then(result => {
               res.json({success: true, code: 200, message: 'data has been updated'});
           })
           .catch(err => {
               res.json({success: false, code: 500, error: err});
           })
});

router.patch('/image/:id', images.multer.single('cover'), images.sendUploadToGCS, (req, res) => {
    const id  = req.params.id;
    Cartoon.update({_id: id}, {$set : {'cover': req.file.cloudStoragePublicUrl}})
           .exec()
           .then(result => {
               res.json({success: true, code: 200, message: 'Updated Image'});
           })
           .catch(err => {
            res.json({success: false, code: 500, error: err}); 
           })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Cartoon.remove({_id: id})
           .exec()
           .then(result => {
               res.json({success: true, code: 200, message: 'data has been deleted'});
           })
           .catch(err => {
               res.json({success: false, code: 500, error: err});
           });
});



module.exports = router