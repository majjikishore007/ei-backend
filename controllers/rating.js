const Rating = require("../models/rating");
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
    res.status(201).json({ success: true, message: "rate successfully" });
  } catch (error) {
    if (err.code === 11000) {
      await Rating.updateOne(
        { article: req.body.articleId, user: req.userData.userId },
        { $set: { value: req.body.ratingValue } }
      );
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
