const ArticleCommentVote = require("../models/article_comment_vote");
const Comment = require("../models/comment");
const User = require("../models/user");
const UserNotification = require("../models/usernotification");
const mongoose = require("mongoose");

exports.voteForArticleComment = async (req, res, next) => {
  try {
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

    await usernotification.save();

    res
      .status(201)
      .json({ success: true, message: "vote has been adeed", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};
