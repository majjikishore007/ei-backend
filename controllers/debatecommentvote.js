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
      .json({ success: true, message: "vote has been adeed", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};
