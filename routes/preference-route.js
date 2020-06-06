const router = require('express').Router();
const Preference = require('../models/preference');
const images = require('../config/cloud-storage-setup');
const checkAuth = require('../middleware/check-auth');

router.get('/', (req, res) => {
   Preference.find()
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


 router.post('/',(req, res) => {
   const preference = new Preference({
       user :  req.body.user,
       category: req.body.category
   });
   preference.save()
       .then(result => {
           res.json({success: true, code: 200, message: result});
       })
       .catch(err => {
           res.json({success: false, code: 500, error: err});
       })
 });


module.exports = router;