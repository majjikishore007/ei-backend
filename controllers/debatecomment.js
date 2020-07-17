const DebateComment = require("../models/debate_comment");

exports.getDebateCommentWithId = async (req, res, next) => {
  try {
    const id = req.params.id;
    let doc = await DebateComment.findById(id);
    if (doc) {
      res.status(200).json({ success: true, data: doc });
    } else {
      res.status(200).json({ success: false, message: "No Valid entry found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.addDebateComment = async (req, res, next) => {
  try {
    const debateComment = new DebateComment({
      debate: req.body.debate,
      user: req.userData.userId,
      type: req.body.type,
      message: req.body.message,
    });
    let result = await debateComment.save();
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.updateDebateCommentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await DebateComment.updateOne({ _id: id }, { $set: req.body });
    res.status(200).json({ success: true, message: "Debate updated" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deleteDebateComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.userData.userId;
    await DebateComment.deleteOne({ $and: [{ _id: id }, { user: userId }] });
    res
      .status(200)
      .json({ success: true, message: "Comment remove from debate" });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.getDebateCommentsForDebateId = async (req, res, next) => {
  try {
    const debate_id = req.params.id;
    let result = await DebateComment.find({ debate: debate_id })
      .sort("-_id")
      .populate("user");

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.fun = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};
