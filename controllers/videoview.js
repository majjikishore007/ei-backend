const VideoView = require("../models/video-view");
const mongoose = require("mongoose");

exports.saveVideoViewTimeStamp = async (req, res, next) => {
  try {
    let videoViewObj = {
      user: req.userData.userId,
      video: req.body.video,
      viewedUpto: parseFloat(req.body.viewedUpto),
      videoLength: parseFloat(req.body.videoLength),
    };
    await new VideoView(videoViewObj).save();
    res
      .status(201)
      .json({ success: true, message: "Video viewed upto time is saved" });
  } catch (error) {
    if (error.code === 11000) {
      await VideoView.findOneAndUpdate(
        { video: req.body.video, user: req.userData.userId },
        { $set: req.body },
        { new: true }
      );
      return res
        .status(200)
        .json({ success: true, message: "Video viewed upto time is updated" });
    }
    res.status(500).json({ success: false, error });
  }
};

exports.getSingleVideoView = async (req, res, next) => {
  try {
    let video = mongoose.Types.ObjectId(req.params.video);
    let user = mongoose.Types.ObjectId(req.userData.userId);

    let videoView = await VideoView.findOne({ video, user });
    res.status(200).json({ success: true, data: videoView });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteSingleVideoView = async (req, res, next) => {
  try {
    let video = mongoose.Types.ObjectId(req.params.video);
    let user = mongoose.Types.ObjectId(req.userData.userId);
    await VideoView.findOneAndDelete({ video, user });
    res.status(200).json({ success: true, message: "Video view is deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
