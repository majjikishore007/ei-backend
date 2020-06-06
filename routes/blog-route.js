const router = require('express').Router();
const Blog = require('../models/blog');
const images = require('../config/cloud-storage-setup');
const checkAuth = require('../middleware/check-auth');

router.get('/', (req, res) => {
  Blog.find()
     .sort('-_id')
     .populate('author' , 'displayName')
      .exec()
      .then(result => {
          res.json({success: true, code: 200, result: result});
      })
      .catch(err => {
          res.json({success: false, code: 500, error: err});
      })
});

router.get('/category/:paramp', (req, res) => {
    const cat = req.params.paramp;
   Blog.find({category: new RegExp(cat, 'i') }).sort('-_id')
           .limit(10)
           .populate('author')
           .exec()
           .then(result => {
               res.json({success : true, result : result});
           })
           .catch(err => {
            res.json({success : false, message: err});
           })


});
router.get('/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .populate('author')
        .exec()
        .then(result => {
            res.json({success: true, code: 200, result: result});
        })
        .catch(err => {
            res.json({success: false, code: 500, error: err});
        })
});

router.get('/blog/:title', (req, res) => {
   const urlStr = req.params.title;
   Blog.findOne({urlStr: urlStr})
       .populate('author')
       .exec()
       .then(result => {
           res.json({success : true, code: 200, result: result});
       })
       .catch(err => {
            res.json({success: false, code: 500, error: err});
       })
});
 router.post('/',checkAuth, images.multer.single('cover'), images.sendUploadToGCS, (req, res) => {
   const blog = new Blog({
       title : req.body.title,
       description : req.body.description,
       cover : req.file.cloudStoragePublicUrl,
       author : req.userData.userId,
       content : req.body.content,
       category: req.body.category,
       created_at : Date.now(),
       updated_at : Date.now(),
       seo : {
           metaTitle : req.body.metaTitle,
           metaKeywords : req.body.metaKeywords,
           metaDescription : req.body.metaDescription
       },
       urlStr : req.body.title.trim().replace(/[&\/\\#, +()$~%.'":*?<>{}]+/ig, '-')

   });
   blog.save()
       .then(result => {
           res.json({success: true, code: 200, message: result});
       })
       .catch(err => {
           res.json({success: false, code: 500, error: err});
       })
 });

 router.patch('/:id', (req, res) => {
     const id = req.params.id;
     Blog.update({_id: id}, {$set: req.body})
         .exec()
         .then(result => {
             res.json({success: true, code: 200, message: 'update blog successfully'})
         })
         .catch(err => {
             res.json({success: true, code: 500, error: err})
         });
         
 });

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Blog.remove({_id: id})
        .exec()
        .then(result => {
            res.json({success: true, code: 200, message: result});
        })
        .catch(err => {
            res.json({success: false, code: 500, error: err});
        })
}) 
module.exports = router;