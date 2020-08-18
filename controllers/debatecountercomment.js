const DebateCounterComment = require("../models/debate_counter_comment");
const DebateArticle = require("../models/debate_article");
const DebateComment = require("../models/debate_comment");
const User = require("../models/user");
const PublisherNotification = require("../models/publishernotification");
const UserNotification = require("../models/usernotification");
const mongoose = require("mongoose");

exports.getCounterCommentWithparentComment = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    const parent_comment_id = req.params.id;
    let result = await DebateCounterComment.find({
      parent_comment: parent_comment_id,
    })
      .sort("-_id")
      .skip(page * limit)
      .limit(limit)
      .populate("debate")
      .populate("user");
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.addCounterComment = async (req, res, next) => {
  try {
    const debateCounterComment = new DebateCounterComment({
      debate: req.body.debate,
      user: req.userData.userId,
      parent_comment: req.body.comment,
      message: req.body.message,
    });
    let result = await debateCounterComment.save();
    /************************************/
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
    let originalComment = await DebateComment.findById(
      mongoose.Types.ObjectId(req.body.comment)
    );
    let usernotification = new UserNotification({
      notificationType: "counter-comment-on-debate",
      message: `${userResult.displayName} replied to your comment`,
      sender: req.userData.userId,
      reciever: originalComment.user,
      debate: req.body.debate,
      debateParentComment: req.body.comment,
      debateComment: result ? result._id : null,
      date: Date.now(),
    });
    await usernotification.save();

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updateDebateCounterCommentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await DebateCounterComment.updateOne(
      { _id: id, user: req.userData.userId },
      { $set: req.body }
    );
    res
      .status(200)
      .json({ success: true, message: "Debate counter comment updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteCommentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await DebateCounterComment.deleteOne({
      _id: id,
      user: req.userData.userId,
    });
    res.json({ success: true, message: "message has been deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
