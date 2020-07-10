const Video = require("../../models/video");
const mongoose = require("mongoose");
exports.validateOnSaveVideoBookmark = async (req, res, next) => {
  try {
    if (!req.body.video) {
      return res
        .status(400)
        .json({ success: false, message: "Please select video" });
    }
    if (!req.body.date) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide bookmark adding date",
        });
    }
    let exist = await Video.findOne({
      _id: mongoose.Types.ObjectId(req.body.video),
    });
    if (!exist) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide Correct video" });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
