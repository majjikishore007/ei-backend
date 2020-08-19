const BlogCommentVote = require("../models/blog_comment_vote");
const BlogComment = require("../models/blog_comment");
const User = require("../models/user");
const UserNotification = require("../models/usernotification");
const mongoose = require("mongoose");

exports.voteForBlogComment = async (req, res, next) => {
  try {
    const blogCommentVote = new BlogCommentVote({
      blog: req.body.blog,
      user: req.userData.userId,
      comment: req.body.comment,
      vote: true, // true = upvote , false = downvote
    });

    let result = await blogCommentVote.save();

    let userResult = await User.findOne({ _id: req.userData.userId });

    let originalComment = await BlogComment.findById(
      mongoose.Types.ObjectId(req.body.comment)
    );

    let usernotification = new UserNotification({
      notificationType: "upvote-comment-on-blog",
      message: `${userResult.displayName} Upvoted your comment`,
      sender: req.userData.userId,
      reciever: originalComment.user,
      blog: req.body.blog,
      blogComment: req.body.comment,
      date: Date.now(),
    });

    await usernotification.save();

    res
      .status(201)
      .json({ success: true, message: "vote has been adeed", data: result });
  } catch (error) {
    console.log(error);
    if (error.code == 11000) {
      await BlogCommentVote.findOneAndUpdate(
        { blog: req.body.blog, user: req.userData.userId },
        { $set: req.body }
      );
      return res
        .status(200)
        .json({ success: true, message: "vote has been updated" });
    }
    res.status(500).json({ success: false, error });
  }
};

exports.getAllVotesForBlogComment = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    let vote = req.params.vote;

    let comment = mongoose.Types.ObjectId(req.params.comment);

    const blogCommentVotes = await BlogCommentVote.find({
      comment,
      vote,
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("blog")
      .populate("user");

    res.status(201).json({ success: true, data: blogCommentVotes });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getblogcommentvotecount = async (req, res, next) => {
  try {
    const parent_comment_id = req.params.commentid;
    const blog_id = req.params.blogid;

    let upvote = await BlogCommentVote.find({
      comment: parent_comment_id,
      blog: blog_id,
      vote: true,
    }).sort("-_id");
    let downvote = await BlogCommentVote.find({
      comment: parent_comment_id,
      blog: blog_id,
      vote: false,
    }).sort("-_id");
    res
      .status(200)
      .json({
        success: true,
        data: { upvotecount: upvote.length, downvotecount: downvote.length },
      });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getVoteStatusForBlogComment = async (req, res, next) => {
  try {
    const comment_id = req.params.commentid;
    let result = await BlogCommentVote.findOne({
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
