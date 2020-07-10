const VideoBookmark = require("../models/videobookmark");
const mongoose = require("mongoose");

exports.addVideoBookmark = async (req, res, next) => {
  try {
    let videoBookmarkObj = {
      user: req.userData.userId,
      video: req.body.video,
      date: req.body.date,
    };
    await new VideoBookmark(videoBookmarkObj).save();
    res.status(201).json({ success: true, message: "Video added to Bookmark" });
  } catch (error) {
    if (error.code === 11000) {
      await VideoBookmark.findOneAndUpdate(
        { video: req.body.video, user: req.userData.userId },
        { $set: req.body },
        { new: true }
      );
      return res
        .status(200)
        .json({ success: true, message: "Video already in bookmark" });
    }
    res.status(500).json({ success: false, error });
  }
};

exports.getSingleVideoBookmark = async (req, res, next) => {
  try {
    let video = mongoose.Types.ObjectId(req.params.video);
    let user = mongoose.Types.ObjectId(req.userData.userId);

    let videoBookmark = await VideoBookmark.findOne({ video, user });
    res.status(200).json({ success: true, data: videoBookmark });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteVideoBookmark = async (req, res, next) => {
  try {
    let video = mongoose.Types.ObjectId(req.params.video);
    let user = mongoose.Types.ObjectId(req.userData.userId);
    await VideoBookmark.findOneAndDelete({ video, user });
    res
      .status(200)
      .json({ success: true, message: "Video removed from Bookmark" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
