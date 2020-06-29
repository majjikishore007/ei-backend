const DebateCommentVote = require("../models/debate_comment_vote");

exports.voteForComment = async (req, res, next) => {
  try {
    const debateCommentVote = new DebateCommentVote({
      debate: req.body.debate,
      user: req.userData.userId,
      comment: req.body.comment,
      vote: true, // true = upvote , false = downvote
    });
    let result = await debateCommentVote.save();

    res
      .status(201)
      .json({ success: true, message: "vote has been adeed", data: result });
  } catch (error) {
    res.status(500).json({ error });
  }
};
