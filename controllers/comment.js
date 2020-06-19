const Article = require("../models/article");
const Comment = require("../models/comment");
const Publishernotification = require("../models/publishernotification");

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
    res.status(500).json({ error });
  }
};

exports.saveComment = async (req, res, next) => {
  try {
    let result = await Article.findOne({ urlStr: req.body.urlStr });
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
    const publishernotification = new Publishernotification({
      message: req.body.message,
      sender: req.userData.userId,
      reciever: result.publisher,
      article: result._id,
      date: Date.now(),
    });
    await Promise.all([comment.save(), publishernotification.save()]);
    res.status(201).json({ success: true, message: "Comment added" });
  } catch (error) {
    res.status(500).json({ error });
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
    res.status(500).json({ error });
  }
};

exports.getCommentsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let comments = await Comment.find({ user: userId }).populate("Article");
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deleteCommentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Comment.deleteOne({ _id: id });
    res.json({ success: true, message: "message has been deleted" });
  } catch (error) {
    res.status(500).json({ error });
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
    res.status(500).json({ error });
  }
};

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    let comments = await Comment.find({ article: req.params.articleId }).sort({
      _id: -1,
    });
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status().json({ error });
  }
};
