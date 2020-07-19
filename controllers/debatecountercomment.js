const DebateCounterComment = require("../models/debate_counter_comment");

exports.getCounterCommentWithparentComment = async (req, res, next) => {
  try {
    const parent_comment_id = req.params.id;
    let result = await DebateCounterComment.find({
      parent_comment: parent_comment_id,
    }).sort("-_id");
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
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
