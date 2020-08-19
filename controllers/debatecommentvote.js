const DebateCommentVote = require("../models/debate_comment_vote");
const DebateComment = require("../models/debate_comment");
const User = require("../models/user");
const UserNotification = require("../models/usernotification");
const mongoose = require("mongoose");

exports.voteForComment = async (req, res, next) => {
  try {
    const debateCommentVote = new DebateCommentVote({
      debate: req.body.debate,
      user: req.userData.userId,
      comment: req.body.comment,
      vote: true, // true = upvote , false = downvote
    });
    let result = await debateCommentVote.save();

    let userResult = await User.findOne({ _id: req.userData.userId });
    let originalComment = await DebateComment.findById(
      mongoose.Types.ObjectId(req.body.comment)
    );

    let usernotification = new UserNotification({
      notificationType: "upvote-comment-on-debate",
      message: `${userResult.displayName} Upvoted your comment`,
      sender: req.userData.userId,
      reciever: originalComment.user,
      debate: req.body.debate,
      debateComment: req.body.comment,
      date: Date.now(),
    });

    await usernotification.save();

    res
      .status(201)
      .json({ success: true, message: "vote has been added", data: result });
  } catch (error) {
    if (error.code == 11000) {
      await DebateCommentVote.findOneAndUpdate(
        { debate: req.body.debate, user: req.userData.userId },
        { $set: req.body }
      );
      return res
        .status(200)
        .json({ success: true, message: "vote has been updated" });
    }
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.getAllVotesForDebateComment = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    let vote = req.params.vote;

    let comment = mongoose.Types.ObjectId(req.params.comment);

    const debateCommentVotes = await DebateCommentVote.find({
      comment,
      vote,
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("debate")
      .populate("user");

    res.status(201).json({ success: true, data: debateCommentVotes });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getVoteStatusForDebateComment = async (req, res, next) => {
  try {
    const comment_id = req.params.commentid;
    let result = await DebateCommentVote.findOne({
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
