const Like = require("../models/like");
const mongoose = require("mongoose");
const Publisher = require("../models/publisher");

exports.getLikedForLoggedinUser = async (req, res, next) => {
  try {
    let likes = await Like.find({ user: req.userData.userId });
    res.status(200).json({ success: true, data: likes });
  } catch (error) {
    res.status(500).json({ success: true, error: error });
  }
};

exports.saveLike = async (req, res, next) => {
  try {
    if (!req.body.publisherId) {
      return res.status(400).json({
        success: false,
        message: "Please enter Publisher to whom You like",
      });
    }
    let isExist = await Publisher.findOne({
      _id: mongoose.Types.ObjectId(req.body.publisherId),
    });
    if (!isExist) {
      return res.status(400).json({
        success: false,
        message: "Please enter correct Publisher to whom You Following",
      });
    }
    const like = new Like({
      count: 1,
      publisher: req.body.publisherId,
      user: req.userData.userId,
      date: Date.now(),
    });
    await like.save();
    res.status(201).json({ success: true, message: "liked successfully" });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(500)
        .json({ success: false, message: "already liking this publisher" });
    } else {
      res.status(500).json({ success: true, error: error });
    }
  }
};

exports.getLikersForPublisher = async (req, res, next) => {
  try {
    const id = req.params.id;
    let likers = await Like.find({ publisher: id }).populate(
      "user",
      "displayName email thumbnail _id"
    );
    res.status(200).json({ success: true, data: likers });
  } catch (error) {
    res.status(500).json({ success: true, error: error });
  }
};

exports.getLikeWithPublisherForLoggedInUser = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const publisherId = req.params.id;
    let like = await Like.findOne({ user: userId, publisher: publisherId });
    res.status(200).json({ success: true, data: like });
  } catch (error) {
    res.status(500).json({ success: true, error: error });
  }
};

exports.unLikePublisherWithPublisherId = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const publisherId = req.params.id;
    await Like.remove({ user: userId, publisher: publisherId });
    res.status(200).json({
      success: true,
      message: "Unliked successfully, please email us why you don't like",
    });
  } catch (error) {
    res.status(500).json({ success: true, error: error });
  }
};
