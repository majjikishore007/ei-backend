const router = require('express').Router();
const Article = require('../models/article');
const Rating = require('../models/rating');
const Usernotification = require("../models/usernotification");



router.get("/", (req, res) => {
   Usernotification.find()
     .populate("sender")
     .populate("article")
     .exec()
     .then((response) => {
       res.json(response);
     });
 });
 
 router.get("/followed/:userId", async (req, res) => {
 const notification = await Usernotification.find().exec()
 const id = req.params.userId;
  const publisher = await Follow.find({user: id}).exec().populate("sender")

          const filteredData = []
          notification.forEach((e1)=>publisher.forEach((e2)=>{
            if(e1.sender._id == e2.publisher){
              filteredData.push(e1)
            }
          }))
          await res.json(filteredData)
        });

        router.get("/unseen/followed/:userId", async (req, res) => {
          const notification = await Usernotification.find({ viewed: false,read: false,})
          .populate('article')
          .exec()
          const id = req.params.userId;
           const publisher = await Follow.find({user: id}).exec().populate("sender")
         
                   const filteredData = []
                   notification.forEach((e1)=>publisher.forEach((e2)=>{
                     if(e1.sender._id == e2.publisher){
                       filteredData.push(e1)
                     }
                   }))
                   await res.json(filteredData)
                 });

 router.get("/unseen/:userId", async (req, res) => {
   // var result = await Publisher.find({ userId: req.params.userid }).exec();
   //var publisherid = result[0]._id;
 
   var data = await Usernotification.find({
     viewed: false,
     read: false,
   })
     .populate("sender")
     .exec();
   function getData(n) {
     if (n.reciever.userId == req.params.userId) return true;
   }
   result = await data.filter(getData);
   res.json(result);
   // console.log(result);
 });
 
 router.get("/all/:userId", async (req, res) => {
   var data = await Usernotification.find({
     read: false,
   })
     .populate("sender")
     
     .exec();
   function getData(n) {
     if (n.reciever.userId == req.params.userId) return true;
   }
   result = await data.filter(getData);
   res.json(result);
 });
 
 router.put("/:id", async (req, res) => {
   try {
     var notification = await Usernotification.findById(
       req.params.id
     ).exec();
     notification.set(req.body);
     var result = await notification.save();
     res.send(result);
   } catch (error) {
     res.status(500).send(error);
   }
 });
 
 module.exports = router;