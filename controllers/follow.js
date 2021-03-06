const Follow = require("../models/follow");
const User = require("../models/user");
const Subscriber = require("../models/notification_subscriber");
const PublisherNotification = require("../models/publishernotification");
const mongoose = require("mongoose");
const Publisher = require("../models/publisher");

const {
  ChangeInPublisherNotification,
} = require("../notification/collection-watch");

exports.getFollowForLoggedinUser = async (req, res, next) => {
  try {
    let follows = await Follow.find({ user: req.userData.userId });
    res.status(200).json({ success: true, data: follows });
  } catch (error) {
    res.status(500).json({ success: true, error: error });
  }
};

exports.saveFollow = async (req, res, next) => {
  try {
    if (!req.body.publisherId) {
      return res.status(400).json({
        success: false,
        message: "Please enter Publisher to whom You Following",
      });
    }
    let isExistPublisher = await Publisher.findOne({
      _id: mongoose.Types.ObjectId(req.body.publisherId),
    });
    if (!isExistPublisher) {
      return res.status(400).json({
        success: false,
        message: "Please enter correct Publisher to whom You Following",
      });
    }
    const follow = new Follow({
      count: 1,
      publisher: req.body.publisherId,
      user: req.userData.userId,
      date: Date.now(),
    });
    /**save notification for publisher */
    let userResult = await User.findOne({ _id: req.userData.userId });

    const publishernotification = new PublisherNotification({
      notificationType: "follow-publisher",
      message: `${userResult.displayName} Started Following You`,
      sender: req.userData.userId,
      reciever: isExistPublisher.userId,
      publisher: req.body.publisherId,
      date: Date.now(),
    });

    await follow.save();
    let notification = await publishernotification.save();
    await ChangeInPublisherNotification(notification, "follow-publisher");
    res.status(201).json({ success: true, message: "following successfully" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(500).json({ success: false, message: "already following" });
    } else {
      res.status(500).json({ success: true, error: error });
    }
  }
};

exports.getFollowersForPublisher = async (req, res, next) => {
  try {
    const id = req.params.id;
    let followers = await Follow.find({ publisher: id }).populate(
      "user",
      "displayName email thumbnail _id"
    );
    res.status(200).json({ success: true, data: followers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: true, error: error });
  }
};

exports.getFollowingPublishersForUserId = async (req, res, next) => {
  try {
    const id = req.params.userId;
    const publisher = await Publisher.find({ userId: id }).exec();
    pubdata = [];
    for (x of publisher) {
      data = {
        pubname: x.name,
        followers: await Follow.find({ publisher: x._id }),
      };
      await pubdata.push(data);
    }
    res.status(200).json({ success: true, data: pubdata });
  } catch (error) {
    res.status(500).json({ success: true, error: error });
  }
};

exports.getFollowWithPublisherForLoggedInUser = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const publisherId = req.params.id;
    let follow = await Follow.findOne({ user: userId, publisher: publisherId });
    res.status(200).json({ success: true, data: follow });
  } catch (error) {
    res.status(500).json({ success: true, error: error });
  }
};

exports.unFollowPublisherWithPublisherId = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const publisherId = req.params.id;
    await Follow.remove({ user: userId, publisher: publisherId });
    res.status(200).json({ success: true, message: "unfollow" });
  } catch (error) {
    res.status(500).json({ success: true, error: error });
  }
};

exports.aggregateFollowingForLoggedinUser = async (req, res, next) => {
  try {
    const id = req.userData.userId;
    let result = await Follow.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: "$publisher",
          total: { $sum: 1 },
        },
      },
    ]);
    let followers = {};
    for (var i = 0; i < result.length; i++) {
      followers[result[i]._id] = result[i].total;
    }
    res.status(200).json({ success: true, data: followers });
  } catch (error) {
    res.status(500).json({ success: true, error: error });
  }
};
