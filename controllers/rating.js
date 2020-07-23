const Rating = require("../models/rating");
const PublisherNotification = require("../models/publishernotification");
const User = require("../models/user");
const Article = require("../models/article");
const mongoose = require("mongoose");

exports.getAllRatings = async (req, res, next) => {
  try {
    let ratings = await Rating.find();
    res.status(200).json({ success: true, data: ratings });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.addRating = async (req, res, next) => {
  try {
    await new Rating({
      value: req.body.ratingValue,
      article: req.body.articleId,
      user: req.userData.userId,
      date: Date.now(),
    }).save();
    /**save notification for publisher */
    let userResult = await User.findOne({ _id: req.userData.userId });

    let publisherExist = await Article.findOne({
      _id: mongoose.Types.ObjectId(req.body.articleId),
    }).populate("publisher");

    const publishernotification = new PublisherNotification({
      notificationType: "rate-article",
      message: `${userResult.displayName} gives ${req.body.ratingValue} Stars rating to your article`,
      sender: req.userData.userId,
      reciever: publisherExist.publisher.userId,
      article: req.body.articleId,
      date: Date.now(),
    });
    await publishernotification.save();
    res.status(201).json({ success: true, message: "rate successfully" });
  } catch (error) {
    if (error.code == 11000) {
      let prevData = await Rating.findOne({
        article: req.body.articleId,
        user: req.userData.userId,
      });
      await Rating.updateOne(
        { article: req.body.articleId, user: req.userData.userId },
        { $set: { value: req.body.ratingValue } }
      );
      const publishernotification = new PublisherNotification({
        notificationType: "rate-article",
        message: `${userResult.displayName} Updated their rating on your article from ${prevData.value} Stars to ${req.body.ratingValue} Stars`,
        sender: req.userData.userId,
        reciever: publisherExist.publisher.userId,
        article: req.body.articleId,
        date: Date.now(),
      });
      await publishernotification.save();
      res.status(200).json({ success: true, message: "update rating" });
    } else {
      res.status(500).json({ success: false, error });
    }
  }
};

exports.getRatingWithArticleIdForLoggedInUser = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const userId = req.userData.userId;
    let result = await Rating.findOne({ article: articleId, user: userId });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllRatingsForUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let result = await Rating.find({ user: userId });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllRatingsInAggregate = async (req, res, next) => {
  try {
    let result = await Rating.aggregate([
      {
        $group: {
          _id: "$article",
          average: { $avg: "$value" },
          total: { $sum: 1 },
        },
      },
    ]);
    let ratings = {};
    for (var i = 0; i < result.length; i++) {
      ratings[result[i]._id] = {
        avg: result[i].average,
        total: result[i].total,
      };
    }
    res.status(200).json({ success: true, data: ratings });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllRatingsAggregateWithArticleId = async (req, res, next) => {
  try {
    const articleId = req.params.id;
    let result = await Rating.aggregate([
      { $match: { article: mongoose.Types.ObjectId(articleId) } },
      {
        $group: {
          _id: "$article",
          average: { $avg: "$value" },
          total: { $sum: 1 },
        },
      },
    ]);
    if (result.length > 0) {
      res.status(200).json({ success: true, data: result[0] });
    } else {
      res.status(200).json({ success: false, data: 0 });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "data error" });
  }
};
