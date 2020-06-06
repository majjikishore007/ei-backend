const express = require('express');
const router =  express.Router();

const Order = require('../models/order');
const Article = require('../models/article');


router.get('/', (req, res, next) => {

});

router.post('/', (req, res, next) => {
    Article.findById(req.body.articleId)
           .then(article => {
               if(!article) {
                   return res.json({ success: false, code: 404, message: "Product not found"});
               }else if(!req.session.user) {
                   return res.json({success : false, code : 500, message: "user not loediN"})
               }
               const order  = new Order({
                   article:  req.body.articleId,
                   user : req.session.user._id
               });
               return order.save();     
        })
        .then(result => {
            console.log(result);
            res.json({success : true, code: 201, message:"Order created"})
        }).catch(err => {
            console.log(err);
            res.json({success: false, code: 500, message: err.name});
        });
    
});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
         .populate('article')
         .exec()
         .then(order => {
             if(!order) {
                 return res.json({success: false, code : 404, message : "Order not found"})
             }
             res.json({
                 success : true, code : 200, order: order
             });
         })
         .catch(err => {
             res.json({success :  false, code: 500, message: err.name });
         });
})
module.exports = router;

