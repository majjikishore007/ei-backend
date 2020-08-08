const DebateComment = require("../models/debate_comment");
const DebateArticle = require("../models/debate_article");
const User = require("../models/user");
const PublisherNotification = require("../models/publishernotification");
const mongoose = require("mongoose");

exports.getDebateCommentWithId = async (req, res, next) => {
  try {
    const id = req.params.id;
    let doc = await DebateComment.findById(id)
      .populate("user")
      .populate("debate");
    if (doc) {
      res.status(200).json({ success: true, data: doc });
    } else {
      res.status(200).json({ success: false, message: "No Valid entry found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.addDebateComment = async (req, res, next) => {
  try {
    const debateComment = new DebateComment({
      debate: req.body.debate,
      user: req.userData.userId,
      type: req.body.type,
      message: req.body.message,
    });
    let result = await debateComment.save();

    /**aggregate the debatearticles and get articles-> publisher.userId -> create Notification For each */

    let debateArticles = await DebateArticle.find({
      debate: mongoose.Types.ObjectId(req.body.debate),
    }).populate([
      {
        path: "article",
        model: "Article",
        populate: {
          path: "publisher",
          model: "Publisher",
          select: "userId",
        },
      },
    ]);

    let userResult = await User.findOne({ _id: req.userData.userId });

    let prm = [];
    debateArticles.forEach((debateArticle) => {
      let publishernotification = {
        notificationType: "comment-on-debate",
        message: `${userResult.displayName} commented on a Debate featuring your Article`,
        sender: req.userData.userId,
        reciever:
          debateArticle.article &&
          debateArticle.article.publisher &&
          debateArticle.article.publisher.userId
            ? debateArticle.article.publisher.userId
            : null,
        debate: req.body.debate,
        debateComment: result ? result._id : null,
        date: Date.now(),
      };
      prm.push(publishernotification);
    });
    await PublisherNotification.insertMany(prm);

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.updateDebateCommentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await DebateComment.updateOne(
      { _id: id, user: req.userData.userId },
      { $set: req.body }
    );
    res.status(200).json({ success: true, message: "Debate updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteDebateComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.userData.userId;
    await DebateComment.deleteOne({ $and: [{ _id: id }, { user: userId }] });
    res
      .status(200)
      .json({ success: true, message: "Comment remove from debate" });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.getDebateCommentsForDebateId = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    const debate_id = req.params.id;
    let result = await DebateComment.find({ debate: debate_id })
      .sort("-_id")
      .skip(page * limit)
      .limit(limit)
      .populate("user");

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};
