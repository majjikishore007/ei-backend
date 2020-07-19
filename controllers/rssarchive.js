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
      price: rssFeed.price,
      viewed: rssFeed.viewed,
      public: rssFeed.public,
      title: rssFeed.title,
      content: rssFeed.content,
      website: rssFeed.website,
      publishingDate: rssFeed.publishingDate,
      publisher: rssFeed.publisher,
      author: rssFeed.author,
      category: rssFeed.category,
    });
    await AllContent.findOneAndDelete({ _id: req.body.rssFeedId });

    res.status(200).json({ success: true, data: savedDoc });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getlatestRssArchive = async (req, res, next) => {
  try {
    let rssArchives = await RssArchive.find({
      viewed: false,
    })
      .sort({ _id: -1 })
      .populate("publisher", "name")
      .limit(20);
    res.status(200).json({ success: true, data: rssArchives });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getNextbatchRssArchive = async (req, res, next) => {
  try {
    let lastRssarchiveId = mongoose.Types.ObjectId(req.params.lastRssarchiveId);
    let rssArchives = await RssArchive.find({
      _id: { $lt: lastRssarchiveId },
      viewed: false,
    })
      .sort({ _id: -1 })
      .populate("publisher", "name")
      .limit(20);
    res.status(200).json({ success: true, data: rssArchives });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
