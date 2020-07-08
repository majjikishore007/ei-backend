const router = require('express').Router();
const config = require('../config/database');
const razorpay = require('razorpay');
const mongoose = require('mongoose');
const Payment = require('../models/payment');
const User = require('../models/user');
const Credit = require('../models/credit');
const checkAuth = require('../middleware/check-auth');

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
router.post('/', checkAuth, (req, res) => {
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
        const payment = new Payment({
            order: order.id,
            amount: order.amount/100,
            capture: false,
            receipt: order.receipt,
            userId: req.userData.userId,
            created_at: order.created_at,
            
        });
        payment.save()
               .then(result => {
                
                   const credit = new Credit({
                       credit: order.amount*4/100,
                       amount: order.amount/100,
                       user: req.userData.userId,
                       raz_order_id: order.id,
                       raz_status: 'created',
                       created_at: Date.now(),
                   })
                   credit.save()
                         .then(data => {
                            res.json({success: true, code: 201,  order: result})
                         })
                         .catch(err2 => {
                            res.json({success: false, code: 501, error: err2 })
                         })
               })
               .catch(err1 => {
                    res.json({success: false, code: 502, error: err1 });
               })
        
    }
  });
});

router.get('/callback/:id',checkAuth, (req, res) => {
   const id  = req.params.id;
   instance.payments.fetch(id, (err, info) => {
       if(err) {
           return res.json({success: false, error: 'Inavlid callback url'});
       }else if(!info.order_id) {
           return res.json({success: false, error: 'Invalid orderId'});
       }else if(info.captured) {

        data = {
            capture: true,
            amount : info.amount/100,
            raz_payment_id: info.id,
            raz_status: info.status, 
            data:info
        }
        Payment.findOne({$and : [{order: info.order_id}, {capture: false}]})
            .exec()
            .then(result => {
                if(result) {
                    Payment.updateOne({order: info.order_id}, {$set: data}, {new: true , useFindAndModify: false})
                           .exec()
                           .then(ret => {
                               if(ret) {
                                   const credit_data = {
                                       credit : result.amount*4,
                                       amount: result.amount,
                                       raz_payment_id : info.id,
                                       raz_status : info.status,
                                       capture: true,
                                       
                                   };
                                   Credit.findOneAndUpdate({raz_order_id: info.order_id}, {$set: credit_data }).exec()
                                         .then((resul) => {
                                             console.log(resul)
                                             res.json({success: true, message: 'Credit has been added to your account'});
                                         })
                                         .catch(err => {
                                             res.json({success: false, error: err})
                                         })
                               }else {
                                 return  res.json({success: false, error: 'Document not found'})
                               }
                           }).catch(er1 => {
                               res.json({success: false, error: er1});
                           })
                }else {
                    res.json({success: false, error: 'Document not found'});
                }
            }).catch(err => {
                res.json({success: false, error: err})
            })
       }else {
           res.json({success: false, error: 'your order has not been captured '});
       }
   })
                 
});



module.exports = router;