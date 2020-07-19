const Feedback = require("../models/feedback");

exports.getAllFeedbacks = async (req, res, next) => {
  try {
    let feedbacks = await Feedback.find().sort({ _id: -1 });
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.saveFeedback = async (req, res, next) => {
  try {
    const feedback = new Feedback({
      user: req.body.user,
      like: req.body.like,
      ease: req.body.ease,
      addonNote: req.body.addonNote,
      refused: req.body.refused,
    });
    await feedback.save();
    res.status(201).json({ success: true, message: "feed back saved" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
