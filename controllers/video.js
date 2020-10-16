const Video = require("../models/video");
const Publisher = require("../models/publisher");
const mongoose = require("mongoose");
const { getVideoDurationInSeconds } = require("get-video-duration");

const { addToDatabase } = require("./keyword");
const urlify = require('../util/util')

exports.getVideosPageWiseLimitWise = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    let videos = await Video.find()
      .populate("publisher")
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit);
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getToptenVideos = async (req, res, next) => {
  try {
    let videos = await Video.find()
      .sort({ _id: -1 })
      .limit(10)
      .populate("publisher");
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.saveVideoPublisher = async (req, res, next) => {
  try {
    const video = new Video({
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.body.thumbnail,
      videoUrl: req.body.videoUrl,
      embeddUrl: req.body.embeddUrl,
      videoLength: req.body.videoLength,
      category: req.body.category,
      price: req.body.price,
      externalLink: req.body.externalLink,
      publisher: req.body.publisher,
      publishingDate: req.body.publishingDate,
      altImage: req.body.altImage ? req.body.altImage : req.body.title,
      seo: {
        metaTitle: req.body.metaTitle ? req.body.metaTitle : req.body.title,
        metaDescription: req.body.metaDescription
          ? req.body.metaDescription
          : req.body.description,
        metaKeywords: req.body.metaKeywords
          ? req.body.metaKeywords
          : req.body.category,
      },
      urlStr: urlify(req.body.title),
      public: true,
    });
    await video.save();
    if (req.body.category) {
      await addToDatabase(req.body.category);
    }
    res
      .status(201)
      .json({ success: true, message: "Video Saved Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getVideoDuration = async (req, res, next) => {
  try {
    let videoLength = await getVideoDurationInSeconds(req.body.videoUrl);
    res.status(201).json({ success: true, data: videoLength });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.uploadVideo = async (req, res, next) => {
  try {
    if (req.videoStoragePublicUrl) {
      res.status(200).json({
        success: true,
        message: "Video uploaded",
        videoUrl: req.videoStoragePublicUrl,
      });
    } else {
      res.status(500).json({
        success: false,
        messge: "Video can't upload due to server error",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.uploadVideoThumbnail = async (req, res, next) => {
  try {
    if (req.file.cloudStoragePublicUrl) {
      res.status(200).json({
        success: true,
        message: "Video thumbnail uploaded",
        thumbnail: req.file.cloudStoragePublicUrl,
      });
    } else {
      res.status(500).json({
        success: false,
        messge: "Video thumbnail can't upload due to server error",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getVideoById = async (req, res, next) => {
  try {
    let video = await Video.findById(
      mongoose.Types.ObjectId(req.params.videoId)
    ).populate("publisher");
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getVideoByTitle = async (req, res, next) => {
  try {
    let video = await Video.findOne({
      urlStr: req.params.title,
    }).populate("publisher");
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.editVideoById = async (req, res, next) => {
  try {
    const id = req.params.videoId;
    await Video.update({ _id: id }, { $set: req.body }, { $new: true });
    res.status(200).json({ success: true, message: "Video Details Updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.editVideoThumbnailByVideoId = async (req, res, next) => {
  try {
    const id = req.params.videoId;
    data = {
      thumbnail: req.file.cloudStoragePublicUrl,
    };
    await Video.findByIdAndUpdate(id, { $set: data });
    res.status(200).json({
      success: true,
      message: "Video Thumbnail updated",
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteVideoById = async (req, res, next) => {
  try {
    const id = req.params.videoId;
    await Video.remove({ _id: id });
    res.status(200).json({ success: true, message: "Video deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getVideosByPublisherId = async (req, res, next) => {
  try {
    const id = req.params.publisherId;
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    let videos = await Video.find({ publisher: id })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("publisher");
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getNoOfVideoForPublisherId = async (req, res, next) => {
  try {
    const id = req.params.publisherId;
    let videosCount = await Video.countDocuments({ publisher: id });
    res.status(200).json({ success: true, count: videosCount });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getVideosByCategoryFilter = async (req, res, next) => {
  try {
    let videos = await Video.find({
      category: new RegExp(req.params.categorySearch, "i"),
    }).populate("publisher");
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getVideosByPublisherIdAndCategory = async (req, res, next) => {
  try {
    let videos = await Video.find({
      publisher: req.params.publisherId,
      category: new RegExp(req.params.categorySearch, "i"),
    }).populate("publisher");

    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getCountOfTotalVideos = async (req, res, next) => {
  try {
    let videosCount = await Video.countDocuments({});
    res.status(200).json({ success: true, count: videosCount });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
