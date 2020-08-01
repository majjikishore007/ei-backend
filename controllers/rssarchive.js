const RssArchive = require("../models/rssarchive");
const AllContent = require("../models/all-content");
const mongoose = require("mongoose");

exports.addRssToArchive = async (req, res, next) => {
  try {
    let rssFeed = await AllContent.findOne({
      _id: mongoose.Types.ObjectId(req.body.rssFeedId),
    });
    if (!rssFeed) {
      return res
        .status(400)
        .json({ success: false, message: "Please select correct Rss FeedId" });
    }

    let savedDoc = await RssArchive.create({
      rssFeedId: req.body.rssFeedId,
    });

    res.status(200).json({ success: true, data: savedDoc });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getRssArchivedPagination = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let rssArchives = await RssArchive.find({})
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("rssFeedId");

    res.status(200).json({ success: true, data: rssArchives });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
