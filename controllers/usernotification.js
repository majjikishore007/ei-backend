const Usernotification = require("../models/usernotification");
const Follow = require("../models/follow");

exports.getUserNotifications = async (req, res, next) => {
  try {
    let result = await Usernotification.find()
      .populate("sender")
      .populate("article");
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status().json({ error });
  }
};

exports.getNotificationFollowedPublisher = async (req, res, next) => {
  try {
    const notification = await Usernotification.find();
    const id = req.params.userId;
    const publisher = await Follow.find({ user: id }).populate("sender");
    let filteredData = [];
    notification.forEach((e1) =>
      publisher.forEach((e2) => {
        if (e1.sender._id == e2.publisher) {
          filteredData.push(e1);
        }
      })
    );
    res.status(200).json({ success: true, data: filteredData });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getUnseenNotificationFollowed = async (req, res, next) => {
  try {
    const notification = await Usernotification.find({
      viewed: false,
      read: false,
    }).populate("article");
    const id = req.params.userId;
    const publisher = await Follow.find({ user: id }).populate("sender");

    const filteredData = [];
    notification.forEach((e1) =>
      publisher.forEach((e2) => {
        if (e1.sender._id == e2.publisher) {
          filteredData.push(e1);
        }
      })
    );
    res.status(200).json({ success: true, data: filteredData });
  } catch (error) {
    res.status().json({ error });
  }
};

exports.getUnseenNotifications = async (req, res, next) => {
  try {
    let data = await Usernotification.find({
      viewed: false,
      read: false,
    }).populate("sender");

    function getData(n) {
      if (n.reciever.userId == req.params.userId) return true;
    }
    let result = data.filter(getData);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status().json({ error });
  }
};

exports.getAllNotificationForUserId = async (req, res, next) => {
  try {
    var data = await Usernotification.find({
      read: false,
    }).populate("sender");

    function getData(n) {
      if (n.reciever.userId == req.params.userId) return true;
    }
    let result = data.filter(getData);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status().json({ error });
  }
};

exports.updateNotificationById = async (req, res, next) => {
  try {
    let notification = await Usernotification.findById(req.params.id).exec();
    notification.set(req.body);
    let result = await notification.save();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error });
  }
};
