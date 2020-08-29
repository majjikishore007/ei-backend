const ArticleCounterComment = require("../models/article_counter_comment");
const Comment = require("../models/comment");
const User = require("../models/user");
const Article = require("../models/article");
const PublisherNotification = require("../models/publishernotification");
const UserNotification = require("../models/usernotification");
const mongoose = require("mongoose");

const {
  ChangeInUserNotification,
} = require("../notification/collection-watch");

exports.getCounterCommentWithparentComment = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    const parent_comment_id = req.params.id;
    let result = await ArticleCounterComment.find({
      parent_comment: parent_comment_id,
    })
      .sort("-_id")
      .skip(page * limit)
      .limit(limit)
      .populate("article")
      .populate("user");
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.addCounterCommentForArticle = async (req, res, next) => {
  try {
    const articleCounterComment = new ArticleCounterComment({
      article: req.body.article,
      user: req.userData.userId,
      parent_comment: req.body.comment,
      message: req.body.message,
    });
    let result = await articleCounterComment.save();
    /************************************/

    let articleResult = await Article.findOne({
      _id: mongoose.Types.ObjectId(req.body.article),
    }).populate("publisher");

    let userResult = await User.findOne({ _id: req.userData.userId });

    let publishernotification = new PublisherNotification({
      notificationType: "comment-on-article",
      message: `${userResult.displayName} commented on your Article`,
      sender: req.userData.userId,
      reciever: articleResult.publisher.userId,
      article: req.body.article,
      articleComment: result._id,
      date: Date.now(),
    });

    await publishernotification.save();

    let originalComment = await Comment.findById(
      mongoose.Types.ObjectId(req.body.comment)
    );
    let usernotification = new UserNotification({
      notificationType: "counter-comment-on-article",
      message: `${userResult.displayName} replied to your comment`,
      sender: req.userData.userId,
      reciever: originalComment.user,
      article: req.body.article,
      articleComment: result ? result._id : null,
      articleParentComment: req.body.comment,
      date: Date.now(),
    });
    let notification = await usernotification.save();

    await ChangeInUserNotification(notification, "counter-comment-on-article");

    let datas = JSON.parse(JSON.stringify(result));
    datas.userData = userResult;
    res.status(201).json({ success: true, data: datas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.updateCounterCommentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await ArticleCounterComment.updateOne(
      { _id: id, user: req.userData.userId },
      { $set: req.body }
    );
    res
      .status(200)
      .json({ success: true, message: "Article counter comment updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteCommentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await ArticleCounterComment.deleteOne({
      _id: id,
      user: req.userData.userId,
    });
    res.json({ success: true, message: "message has been deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
