const router = require('express').Router();
const Publisher = require('../models/publisher');
const mongoose = require('mongoose');
const Article = require('../models/article');
const images = require('../config/cloud-storage-setup');
const checkAuth = require('../middleware/check-auth');

router.get('/',  (req,res) => {
    Publisher.find().sort('name')
             .exec()
             .then(docs => {
                 
                 const response = {
                     count: docs.length,
                     publishers : docs.map(
                         doc => {
                           
                             return {
                                 name : doc.name,
                                 email : doc.email,
                                 about : doc.about,
                                 website : doc.website,
                                 address : doc.address,
                                 logo  : doc.logo,
                                 userId  : doc.userId,
                                 verified : doc.verified,
                                 urlStr : doc.urlStr,
                                 id: doc.id,
                                
                             };
                         }
                     )
                 };
                 if(docs.length >= 0) {
                     res.json(response);
                 } else {
                     res.json({ success: false, code: 404, message : 'No entries found'});
                 }
             })
             .catch(err => {
                 res.json({error: err});
             })
})

router.post('/', checkAuth, images.multer.single('logo'), images.sendUploadToGCS, (req, res) => {
    
    const publisher = new Publisher({
        name : req.body.name,
        email : req.body.email,
        about : req.body.about,
        website : req.body.website,
        address : req.body.address,
        city : req.body.city,
        zip : req.body.zip,
        logo : req.file.cloudStoragePublicUrl,
        userId: req.userData.userId
    });
   publisher.save()
            .then(result => {
                res.json({success :  true, code: 201, message: 'publisher page created'});
            })
            .catch(err => {
                res.json({ success: false, code: 500, message: err});
            })
});

router.get('/:id', (req, res) => {
    const id =  req.params.id;
    Publisher.findById(id)
             .exec()
             .then(doc => {
                 if(doc){
                     res.json({ success : true, code: 200, publisher : doc});
                 } else {
                     res.json({success: false, code: 404, message: "No valid entery"});
                 }
             })
             .catch(err => {
                 res.json({success : false, code: 500, message: err})
             })
});

router.get('/title/:urlStr', (req, res) => {
    const urlStr =  req.params.urlStr
    Publisher.find({urlStr: urlStr})
             .exec()
             .then(doc => {
                 if(doc){
                     res.json({ success : true, code: 200, publisher : doc});
                 } else {
                     res.json({success: false, code: 404, message: "No valid entery"});
                 }
             })
             .catch(err => {
                 res.json({success : false, code: 500, message: err})
             })
});

router.get('/user/publisher', checkAuth,  (req, res) => {
    const id = req.userData.userId;
    Publisher.find({userId: id})
             .exec()
             .then(doc => {
                 if(doc) {
                     res.json({success:true, code: 201, publisher :doc});
                 }else{
                     res.json({success : false, code: 500, message: 'No publisher'});
                 }
             })
             .catch(err => {
                 res.json({success : false, code: 500, message: err.name});
             })
})
router.patch('/:id', (req, res) => {
    const id = req.params.id;
    
    Publisher.update({_id: id}, {$set: req.body})
             .exec()
             .then(result => {
                 res.json({success: true, code: 200, message: 'Publisher page updated'});
             })
             .catch(err => {
                 res.json({ success : false, code: 500, message: err.name});
             })
});
 
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Publisher.remove({_id: id})
             .exec()
             .then(result => {
                 res.json({success:  true, message: 'Publisher page removed'});
             })
             .catch(err => {
                 res.json({success: false, code: 500, message:err.name})
             })
})

//change logo

router.patch('/changelogo/:id', images.multer.single('logo'), images.sendUploadToGCS, (req, res) => {
    const id = req.params.id;
    data = {
        logo: req.file.cloudStoragePublicUrl
    }
    Publisher.findByIdAndUpdate(id, {$set: data})
             .exec()
             .then(result => {
                res.json({success: true, code: 200, message: 'Publisher logo has been updated'});
             })
             .catch(err => {
                res.json({ success : false, code: 500, message: err.name});
             })
});

router.get('/fullDeatils/everythings' , (req, res) => {
    var cursor = Publisher.find();
    var publishers;
    cursor.exec().then(result => {
        publishers = result
        Article.aggregate([
            { 
                $group : 
                    { _id : '$publisher', total: { $sum: 1 }}
            }
        ]).exec().then(result1 => {
             output = {};
             for(var i=0; i<result1.length;i++) {
                 
                 output[result1[i]._id] = result1[i].total;
             }
             res.json({success: true, publishers: publishers , counts: output});
        })
        
    })
});





module.exports = router;