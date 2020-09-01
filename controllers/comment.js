const Article = require("../models/article");
const Comment = require("../models/comment");
const ArticleCounterComment = require("../models/article_counter_comment");
const ArticleCommentVote = require("../models/article_comment_vote");
const User = require("../models/user");
const Publishernotification = require("../models/publishernotification");
const mongoose = require("mongoose");

const {
  ChangeInPublisherNotification,
} = require("../notification/collection-watch");

exports.getAllComments = async (req, res, next) => {
  try {
    let comments = await Comment.aggregate([
      {
        $project: {
          _id: 0,
          message: 1,
          user: 1,
          article: 1,
          id: "$_id",
          date: 1,
        },
      },
    ]);
    if (comments.length >= 0) {
      res
        .status(200)
        .json({ success: true, count: comments.length, data: comments });
    } else {
      res.status(404).json({ success: false, message: "No entries found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.saveComment = async (req, res, next) => {
  try {
    let result = await Article.findOne({ urlStr: req.body.urlStr }).populate(
      "publisher"
    );
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong article choosen" });
    }
    const comment = new Comment({
      message: req.body.message,
      user: req.userData.userId,
      article: result._id,
      date: Date.now(),
    });
    let savedComment = await comment.save();

    let userResult = await User.findOne({ _id: req.userData.userId });

    const publishernotification = new Publishernotification({
      notificationType: "comment-on-article",
      message: `${userResult.displayName} commented on Your Article`,
      sender: req.userData.userId,
      reciever: result.publisher.userId,
      article: result ? result._id : null,
      articleComment: savedComment ? savedComment._id : null,
      date: Date.now(),
    });
    let notification = await publishernotification.save();
    await ChangeInPublisherNotification(notification, "comment-on-article");

    let datas = JSON.parse(JSON.stringify(savedComment));
    datas.userData = userResult;

    res.status(201).json({ success: true, data: datas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.getCommentsByUrlStr = async (req, res, next) => {
  try {
    const urlStr = req.params.urlStr;
    Article.findOne({ urlStr: urlStr })
      .exec()
      .then((result) => {
        Comment.find({ article: result._id })
          .sort("-_id")
          .populate("user", "displayName thumbnail")
          .exec()
          .then((result) => {
            res.json({ success: true, data: result });
          });
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.getCommentsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let comments = await Comment.find({ user: userId }).populate("Article");
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, data: comments });
  }
};

exports.updateCommentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Comment.updateOne(
      { _id: id, user: req.userData.userId },
      { $set: req.body }
    );
    res.status(200).json({ success: true, message: "Comment updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteCommentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Promise.all([
      Comment.deleteOne({ _id: id }),
      ArticleCommentVote.deleteMany({ comment: id }),
      ArticleCounterComment.deleteMany({ parent_comment: id }),
    ]);
    res.json({ success: true, message: "message has been deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getCommentsInAggregateByArticles = async (req, res, next) => {
  try {
    let result = await Comment.aggregate([
      {
        $group: {
          _id: "$article",
          total: { $sum: 1 },
        },
      },
    ]);
    let comments = {};
    for (var i = 0; i < result.length; i++) {
      comments[result[i]._id] = result[i].total;
    }
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let comments = await Comment.find({ article: req.params.articleId })
      .sort({
        _id: -1,
      })
      .skip(page * limit)
      .limit(limit)
      .populate("user");
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getCommentsPagination = async (req, res, next) => {
  try {
    /**article id */
    let articleId = req.params.id;

    /**comment */
    let commentPage = parseInt(req.params.commentPage);
    let commentLimit = parseInt(req.params.commentLimit);

    /**counter comment */
    let counterCommentPage = parseInt(req.params.counterCommentPage);
    let counterCommentLimit = parseInt(req.params.counterCommentLimit);

    let articleComments = await Comment.aggregate([
      { $match: { article: mongoose.Types.ObjectId(articleId) } },
      { $sort: { _id: -1 } },
      { $skip: commentPage * commentLimit },
      { $limit: commentLimit },
      {
        $lookup: {
          from: User.collection.name,
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $lookup: {
          from: ArticleCounterComment.collection.name,
          let: { commentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$parent_comment", "$$commentId"] }],
                },
              },
            },
            { $sort: { _id: -1 } },
            { $skip: counterCommentPage * counterCommentLimit },
            { $limit: counterCommentLimit },
            {
              $lookup: {
                from: User.collection.name,
                localField: "user",
                foreignField: "_id",
                as: "userData",
              },
            },
            { $unwind: "$userData" },
          ],
          as: "counterComments",
        },
      },
      {
        $lookup: {
          from: ArticleCommentVote.collection.name,
          let: { commentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$comment", "$$commentId"] }],
                },
              },
            },
            {
              $lookup: {
                from: User.collection.name,
                localField: "user",
                foreignField: "_id",
                as: "userData",
              },
            },
            { $unwind: "$userData" },
          ],
          as: "commentVotes",
        },
      },
    ]);
    res.status(200).json({ success: true, data: articleComments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

exports.getCounterCommentsPagination = async (req, res, next) => {
  try {
    /**article id */
    let articleId = req.params.articleId;

    /**comment id */
    let commentId = req.params.commentId;

    /**counter comment */
    let counterCommentPage = parseInt(req.params.counterCommentPage);
    let counterCommentLimit = parseInt(req.params.counterCommentLimit);

    let articleCounterComments = await ArticleCounterComment.aggregate([
      {
        $match: {
          $and: [
            { article: mongoose.Types.ObjectId(articleId) },
            { parent_comment: mongoose.Types.ObjectId(commentId) },
          ],
        },
      },
      { $sort: { _id: -1 } },
      { $skip: counterCommentPage * counterCommentLimit },
      { $limit: counterCommentLimit },
      {
        $lookup: {
          from: User.collection.name,
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
    ]);

    res.status(200).json({ success: true, data: articleCounterComments });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};
