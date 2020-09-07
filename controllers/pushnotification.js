const PushNotification = require("../models/push-notification");
const NotificationSubscriber = require("../models/notification_subscriber");
const mongoose = require("mongoose");

exports.getAllPushNotificationPagination = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let deviceResult = await NotificationSubscriber.findOne({
      user: req.userData.userId,
    });
    if (!deviceResult) {
      return res.status(200).json({ success: true, data: null });
    }
    let notifications = await PushNotification.find({
      device: deviceResult.device,
      viewed: false,
      read: false,
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllUnSeenPushNotificationPagination = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let deviceResult = await NotificationSubscriber.findOne({
      user: req.userData.userId,
    });
    if (!deviceResult) {
      return res.status(200).json({ success: true, data: null });
    }
    let notifications = await PushNotification.find({
      device: deviceResult.device,
      viewed: false,
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllUnReadPushNotificationPagination = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let deviceResult = await NotificationSubscriber.findOne({
      user: req.userData.userId,
    });
    if (!deviceResult) {
      return res.status(200).json({ success: true, data: null });
    }
    let notifications = await PushNotification.find({
      device: deviceResult.device,
      viewed: true,
      read: false,
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updatePushNotificationById = async (req, res, next) => {
  try {
    let deviceResult = await NotificationSubscriber.findOne({
      user: req.userData.userId,
    });
    if (!deviceResult) {
      return res.status(200).json({ success: true, data: null });
    }
    var data = await PushNotification.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
        device: deviceResult.device,
      },
      {
        $set: req.body,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Push Notification updated", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};
exports.deletePushNotificationById = async (req, res, next) => {
  try {
    let deviceResult = await NotificationSubscriber.findOne({
      user: req.userData.userId,
    });
    if (!deviceResult) {
      return res.status(200).json({ success: true, data: null });
    }
    var data = await PushNotification.findOneAndDelete({
      _id: mongoose.Types.ObjectId(req.params.id),
      device: deviceResult.device,
    });
    res
      .status(200)
      .json({ success: true, message: "Push Notification deleted", data });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
