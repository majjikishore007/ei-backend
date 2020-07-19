const Publishernotification = require("../models/publishernotification");

exports.getAllPublisherNotifications = async (req, res, next) => {
  try {
    let notifications = await Publishernotification.find()
      .populate("sender")
      .populate("reciever")
      .populate("article");
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getUnseenPublisherNotificationsForUserId = async (req, res, next) => {
  try {
    var data = await Publishernotification.find({
      viewed: false,
      read: false,
    })
      .populate("sender")
      .populate("reciever")
      .populate("article");
    function getData(n) {
      if (n.reciever.userId == req.params.userId) return true;
    }
    let result = data.filter(getData);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllPublisherNotificationsForUserId = async (req, res, next) => {
  try {
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
    let result = data.filter(getData);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updatePublisherNotificationById = async (req, res, next) => {
  try {
    var notification = await Publishernotification.findById(req.params.id);
    notification.set(req.body);
    var result = await notification.save();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
