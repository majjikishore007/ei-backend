const router = require("express").Router();
const Article = require("../models/article");
const Publisher = require("../models/publisher");
const Comment = require("../models/comment");
const Publishernotification = require("../models/publishernotification");
const checkAuth = require("../middleware/check-auth");

router.get("/", (req, res) => {
  Publishernotification.find()
    .populate("sender")
    .populate("reciever")
    .populate("article")
    .exec()
    .then((response) => {
      res.json(response);
    });
});

router.get("/unseen/:userId", async (req, res) => {
  // var result = await Publisher.find({ userId: req.params.userid }).exec();
  //var publisherid = result[0]._id;

  var data = await Publishernotification.find({
    viewed: false,
    read: false,
  })
    .populate("sender")
    .populate("reciever")
    .populate("article")
    .exec();
  function getData(n) {
    if (n.reciever.userId == req.params.userId) return true;
  }
  result = await data.filter(getData);
  res.json(result);
  // console.log(result);
});

router.get("/all/:userId", async (req, res) => {
  var data = await Publishernotification.find({
    read: false,
  })
    .populate("sender")
    .populate("reciever")
    .populate("article")
    .exec();
  function getData(n) {
    if (n.reciever.userId == req.params.userId) return true;
  }
  result = await data.filter(getData);
  res.json(result);
});

router.put("/:id", async (req, res) => {
  try {
    var notification = await Publishernotification.findById(
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
