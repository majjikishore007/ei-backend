const router = require('express').Router();
const config = require('../config/database');
const razorpay = require('razorpay');
const mongoose = require('mongoose');
const Payment = require('../models/payment');
const User = require('../models/user');

var instance = new razorpay({
    key_id: config.keys.razorpay.keyId,
    key_secret: config.keys.razorpay.keySecret,
});

router.get('/', (req, res) => {
    Payment.find()
           .exec()
           .then(docs => {
               res.json({success: true, code: 201, result: docs});

           })
           .catch(err => {
               res.json({success: false, code: 500, error: err});
           });
})
router.post('/order', (req, res) => {
    var options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "EI" + new Date().getTime(),
        payment_capture: '0'
   };
  instance.orders.create(options, function(err, order) {
    if(err) {
        console.log("error : " + err);
        res.json({sucess: false, err : err})
    } else {
        console.log("order : " + order);
        const payment = new Payment({
            _id: mongoose.Types.ObjectId(),
            order: order.id,
            amount: order.amount/100,
            capture: false,
            receipt: order.receipt,
            userId: req.session.user._id,
            created_at: order.created_at,
            
        });
        payment.save()
               .then(result => {
                res.json({success: true, code: 201,  order: result})
               })
               .catch(err1 => {
                    res.json({success: false, code: 500, error: err1 });
               })
        
    }
  });
});

router.get('/callback/:id', (req, res) => {
   const id  = req.params.id;
   data = {
       capture: true
   }
   Payment.findOneAndUpdate({order:id}, {$set: data}, {new: true , useFindAndModify: false})
          .exec()
          .then(result => {
              
            User.findByIdAndUpdate(result.userId, {$inc : {credits: result.amount*4 }}, {new: true, useFindAndModify: false})
                .exec()
                .then(doc => {
                   res.redirect('/');
                })
                .catch(e => {
                   return res.json({success : false, code: 500, err: e});
                })
            // res.json({success: true, code: 200, message: 'payment capture successfully'});

          })
          .catch(err => {
              res.json({success: false, code: 500, message: err.name});
          });
});



module.exports = router;