const Publishernotification = require("../models/publishernotification");
const mongoose = require("mongoose");

exports.getAllPublisherNotifications = async (req, res, next) => {
  try {
    let notifications = await Publishernotification.find()
      .sort({ _id: -1 })
      .populate("sender")
      .populate("reciever")
      .populate("article")
      .populate("publisher")
      .populate("articleComment")
      .populate("debate")
      .populate("debateComment");
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllPublisherNotificationsForUserIdPagination = async (
  req,
  res,
  next
) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    var data = await Publishernotification.find({
      reciever: mongoose.Types.ObjectId(req.userData.userId),
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("sender")
      .populate("reciever")
      .populate("article")
      .populate("publisher")
      .populate("articleComment")
      .populate("debate")
      .populate("debateComment");
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.getUnseenPublisherNotificationsForUserIdPagination = async (
  req,
  res,
  next
) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    var data = await Publishernotification.find({
      reciever: mongoose.Types.ObjectId(req.userData.userId),
      viewed: false,
      read: false,
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("sender")
      .populate("reciever")
      .populate("article")
      .populate("publisher")
      .populate("articleComment")
      .populate("debate")
      .populate("debateComment");
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getUnreadPublisherNotificationsForUserIdPagination = async (
  req,
  res,
  next
) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    var data = await Publishernotification.find({
      reciever: mongoose.Types.ObjectId(req.userData.userId),
      read: false,
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("sender")
      .populate("reciever")
      .populate("article")
      .populate("publisher")
      .populate("articleComment")
      .populate("debate")
      .populate("debateComment");

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.updatePublisherNotificationById = async (req, res, next) => {
  try {
    var data = await Publishernotification.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
        reciever: mongoose.Types.ObjectId(req.userData.userId),
      },
      {
        $set: req.body,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Notification updated", data });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
