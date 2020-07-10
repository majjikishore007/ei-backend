const VideoTop = require("../models/videotop");
const Video = require("../models/video");
const mongoose = require("mongoose");

exports.saveVideoTop = async (req, res, next) => {
  try {
    if (!req.body.video) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide video id" });
    }
    let exist = await Video.findOne({
      _id: mongoose.Types.ObjectId(req.body.video),
    });
    if (!exist) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide correct video" });
    }
    let videoTopObj = {
      video: req.body.video,
    };
    if (req.body.displayTop) {
      videoTopObj.displayTop = req.body.displayTop;
    }
    await new VideoTop(videoTopObj).save();
    res.status(201).json({ success: true, message: "Video Top is saved" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(200)
        .json({ success: true, message: "Video already in display top" });
    }
    res.status(500).json({ success: false, error });
  }
};

exports.getAllVideoTops = async (req, res, next) => {
  try {
    let videoTops = await VideoTop.find().sort({ _id: -1 }).populate("video");
    res.status(200).json({ success: true, data: videoTops });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteVideoTop = async (req, res, next) => {
  try {
    let video = mongoose.Types.ObjectId(req.params.video);
    await VideoTop.findOneAndDelete({ video });
    res.status(200).json({ success: true, message: "Video Top is deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
