const Audio = require("../models/audio");
const Publisher = require("../models/publisher");
const mongoose = require("mongoose");

const { addToDatabase } = require("./keyword");

exports.getAudiosPageWiseLimitWise = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    let audios = await Audio.find()
      .populate("publisher")
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit);
    res.status(200).json({ success: true, data: audios });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getToptenAudios = async (req, res, next) => {
  try {
    let audios = await Audio.find()
      .sort({ _id: -1 })
      .limit(10)
      .populate("publisher");
    res.status(200).json({ success: true, data: audios });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.saveAudioPublisher = async (req, res, next) => {
  try {
    const audio = new Audio({
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.body.thumbnail,
      audioUrl: req.body.audioUrl,
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
      urlStr: req.body.title
        .trim()
        .replace(/[&\/\\#, +()$~%.'":;*?!<>{}]+/gi, "-"),
      public: true,
    });
    await audio.save();
    if (req.body.category) {
      await addToDatabase(req.body.category);
    }
    res
      .status(201)
      .json({ success: true, message: "Audio Saved Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.uploadAudio = async (req, res, next) => {
  try {
    if (req.audioStoragePublicUrl) {
      res.status(200).json({
        success: true,
        message: "Audio uploaded",
        audioUrl: req.audioStoragePublicUrl,
      });
    } else {
      res.status(500).json({
        success: false,
        messge: "Audio can't upload due to server error",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.uploadAudioThumbnail = async (req, res, next) => {
  try {
    if (req.file.cloudStoragePublicUrl) {
      res.status(200).json({
        success: true,
        messge: "Audio Thumbnail Uploaded",
        thumbnail: req.file.cloudStoragePublicUrl,
      });
    } else {
      res.status(500).json({
        success: false,
        messge: "Audio Thumbnail can't upload due to server error",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAudioById = async (req, res, next) => {
  try {
    let audio = await Audio.findById(
      mongoose.Types.ObjectId(req.params.audioId)
    ).populate("publisher");
    res.status(200).json({ success: true, data: audio });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAudioByTitle = async (req, res, next) => {
  try {
    let audio = await Audio.findOne({
      urlStr: req.params.title,
    }).populate("publisher");
    res.status(200).json({ success: true, data: audio });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.editAudioById = async (req, res, next) => {
  try {
    const id = req.params.audioId;
    await Audio.update({ _id: id }, { $set: req.body }, { $new: true });
    res.status(200).json({ success: true, message: "Audio Details Updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.editAudioThumbnailByAudioId = async (req, res, next) => {
  try {
    const id = req.params.audioId;
    data = {
      thumbnail: req.file.cloudStoragePublicUrl,
    };
    await Audio.findByIdAndUpdate(id, { $set: data });
    res.status(200).json({
      success: true,
      message: "Audio Thumbnail updated",
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteAudioById = async (req, res, next) => {
  try {
    const id = req.params.audioId;
    await Audio.remove({ _id: id });
    res.status(200).json({ success: true, message: "Audio deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAudiosByPublisherId = async (req, res, next) => {
  try {
    const id = req.params.publisherId;
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    let audios = await Audio.find({ publisher: id })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("publisher");
    res.status(200).json({ success: true, data: audios });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getNoOfAudioForPublisherId = async (req, res, next) => {
  try {
    const id = req.params.publisherId;
    let audiosCount = await Audio.countDocuments({ publisher: id });
    res.status(200).json({ success: true, count: audiosCount });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAudiosByCategoryFilter = async (req, res, next) => {
  try {
    let audios = await Audio.find({
      category: new RegExp(req.params.categorySearch, "i"),
    }).populate("publisher");
    res.status(200).json({ success: true, data: audios });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAudiosByPublisherIdAndCategory = async (req, res, next) => {
  try {
    let audios = await Audio.find({
      publisher: req.params.publisherId,
      category: new RegExp(req.params.categorySearch, "i"),
    }).populate("publisher");

    res.status(200).json({ success: true, data: audios });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getCountOfTotalAudios = async (req, res, next) => {
  try {
    let audiosCount = await Audio.countDocuments({});
    res.status(200).json({ success: true, count: audiosCount });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
