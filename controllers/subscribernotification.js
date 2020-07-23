const NotificationSubscriber = require("../models/notification_subscriber");
const Article = require("../models/article");
const User = require("../models/user");
const PublisherNotification = require("../models/publishernotification");

const mongoose = require("mongoose");

exports.addNotificationSubscriber = async (req, res, next) => {
  try {
    let exist = await NotificationSubscriber.findOne({
      device: req.body.device,
    });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Device already registered for push notification",
      });
    }
    let notificationSubscriber = new NotificationSubscriber({
      device: req.body.device,
      user: req.userData.userId,
    });
    await notificationSubscriber.save();
    res
      .status(201)
      .json({ success: true, message: "Push Notification Subscribed" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.sharedArticleNotify = async (req, res, next) => {
  try {
    let article = mongoose.Types.ObjectId(req.body.article);
    let userResult = await User.findOne({ _id: req.userData.userId });
    let sharedMedium = req.body.sharedMedium;
    let result = await Article.findOne({ _id: article }).populate("publisher");
    let pubNotification = new PublisherNotification({
      notificationType: "share-article",
      article: article,
      sender: req.userData.userId,
      reciever: result.publisher.userId,
      sharedMedium: sharedMedium,
      message: `${userResult.displayName} shared your Article on ${sharedMedium}`,
      date: Date.now(),
    });

    await pubNotification.save();
    res
      .status(200)
      .json({ success: true, message: "Publisher Notification Saved" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};
