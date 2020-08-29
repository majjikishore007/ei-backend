const ArticleCommentVote = require("../models/article_comment_vote");
const Comment = require("../models/comment");
const User = require("../models/user");
const UserNotification = require("../models/usernotification");
const mongoose = require("mongoose");

const {
  ChangeInUserNotification,
} = require("../notification/collection-watch");

exports.voteForArticleComment = async (req, res, next) => {
  try {
    let exist = await ArticleCommentVote.findOne({
      comment: req.body.comment,
      user: req.userData.userId,
    });
    if (exist) {
      let resultUpdated = await ArticleCommentVote.findOneAndUpdate(
        { comment: req.body.comment, user: req.userData.userId },
        { $set: req.body },
        { new: true }
      );
      return res
        .status(200)
        .json({ success: true, voteGiven: true, vote: resultUpdated.vote });
    }

    const articleCommentVote = new ArticleCommentVote({
      article: req.body.article,
      user: req.userData.userId,
      comment: req.body.comment,
      vote: true, // true = upvote , false = downvote
    });

    let result = await articleCommentVote.save();

    let userResult = await User.findOne({ _id: req.userData.userId });

    let originalComment = await Comment.findById(
      mongoose.Types.ObjectId(req.body.comment)
    );

    let usernotification = new UserNotification({
      notificationType: "upvote-comment-on-article",
      message: `${userResult.displayName} Upvoted your comment`,
      sender: req.userData.userId,
      reciever: originalComment.user,
      article: req.body.article,
      articleComment: req.body.comment,
      date: Date.now(),
    });

    let notification = await usernotification.save();

    await ChangeInUserNotification(notification, "upvote-comment-on-article");

    res.status(201).json({ success: true, voteGiven: true, vote: result.vote });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getarticlecommentvote = async (req, res, next) => {
  try {
    const parent_comment_id = req.params.commentid;
    const article_id = req.params.articleid;
    let result = await ArticleCommentVote.find({
      comment: parent_comment_id,
      article: article_id,
    }).sort("-_id");
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    // console.log(error)
    res.status(500).json({ success: false, error });
  }
};

exports.getarticlecommentvotecount = async (req, res, next) => {
  try {
    const parent_comment_id = req.params.commentid;
    const article_id = req.params.articleid;

    let upvote = await ArticleCommentVote.find({
      comment: parent_comment_id,
      article: article_id,
      vote: true,
    }).sort("-_id");
    let downvote = await ArticleCommentVote.find({
      comment: parent_comment_id,
      article: article_id,
      vote: false,
    }).sort("-_id");
    res.status(200).json({
      success: true,
      data: { upvotecount: upvote.length, downvotecount: downvote.length },
    });
  } catch (error) {
    // console.log(error)
    res.status(500).json({ success: false, error });
  }
};

exports.getAllVotesForArticleComment = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    let vote = req.params.vote;

    let comment = mongoose.Types.ObjectId(req.params.comment);

    const articleCommentVotes = await ArticleCommentVote.find({
      comment,
      vote,
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("article")
      .populate("user");

    res.status(201).json({ success: true, data: articleCommentVotes });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getVoteStatusForArticleComment = async (req, res, next) => {
  try {
    const comment_id = req.params.commentid;
    let result = await ArticleCommentVote.findOne({
      comment: comment_id,
      user: req.userData.userId,
    });
    let response = {};
    if (result) {
      response = {
        success: true,
        voteGiven: true,
        vote: result.vote,
      };
    } else {
      response = {
        success: true,
        voteGiven: false,
      };
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getVotes = async (req, res, next) => {
  try {
    let comment = mongoose.Types.ObjectId(req.params.comment);

    const upvoteCount = await ArticleCommentVote.countDocuments({
      comment,
      vote: true,
    });
    const downvoteCount = await ArticleCommentVote.countDocuments({
      comment,
      vote: false,
    });
    res
      .status(200)
      .json({ success: true, data: { upvoteCount, downvoteCount } });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
