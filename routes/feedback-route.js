const router = require("express").Router();
const Feedback = require("../models/feedback");


router.get('/', (req, res) => {
   Feedback.find()
          .sort('-_id')
          .exec()
          .then(result => {
              res.json({success : true, code: 200, result: result});
          })
          .catch(err => {
              res.json({success: false, code: 500, error: err});
          });
})

router.post('/',  (req, res) => {
   const feedback = new Feedback({
      user:req.body.user,
      like : req.body.like,
     ease: req.body.ease,
     addonNote:req.body.addonNote,
     refused: req.body.refused,
   });
   feedback.save()
          .then(result => {
              res.json({success: true, code: 200, message:'feed back saved'})
          })
          .catch(err => {
            res.json({success: false, code: 500, err: err});
          });
});

module.exports = router