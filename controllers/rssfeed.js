const Publisher = require("../models/publisher");
const Parser = require("rss-parser");
const parser = new Parser();
const RssFeedstructure = require("../models/rss-feed-structure");
const AllContent = require("../models/all-content");
const mongoose = require("mongoose");

exports.insertRssIntoAllContent = async (req, res, next) => {
  let publishers = await Publisher.find({});

  publishers.map(async (publisher) => {
    /**check whether structure exist or not for publisherId */
    let structure = await RssFeedstructure.findOne({
      publisherId: publisher._id,
    });
    if (structure) {
      /**structure present */
      /**loop through feedUrl array   */
      if (publisher.feedurl) {
        for (
          let urlIndex = 0;
          urlIndex < publisher.feedurl.length;
          urlIndex++
        ) {
          try {
            let feed = await parser.parseURL(publisher.feedurl[urlIndex]);
            let feedList = feed.items;
            let insertPromiseArr = [];
            for (let i = 0; i < feedList.length; i++) {
              let data = {};
              data.title = feedList[i][structure.titleField];
              data.content = feedList[i][structure.contentField];
              data.website = feedList[i][structure.linkField];
              data.publishingDate = feedList[i][structure.pubDateField];
              data.publisher = structure.publisherId;
              if (
                structure.authorField &&
                feedList[i][structure.authorField] != undefined
              ) {
                data.author = feedList[i][structure.authorField];
              }
              if (
                structure.imageField &&
                feedList[i][structure.imageField] != undefined
              ) {
                data.cover = feedList[i][structure.imageField];
              }
              if (
                structure.categoryField &&
                feedList[i][structure.categoryField] != undefined
              ) {
                data.category = feedList[i][structure.categoryField].join(",");
              }
              let exist = await AllContent.findOne({ website: data.website });

              if (!exist) {
                let insertedFeedPromise = AllContent.create(data);
                insertPromiseArr.push(insertedFeedPromise);
              }
            }
            await Promise.all(insertPromiseArr);
          } catch (error) {
            return;
          }
        }
      }
    }
  });
};

exports.getInitailRssFeeds = async (req, res, next) => {
  try {
    let rssFeeds = await AllContent.find({ viewed: false })
      .sort({ _id: -1 })
      .populate("publisher", "name")
      .limit(20);
    res.status(200).json({ success: true, count: rssFeeds.length, rssFeeds });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getNextbatchRssFeeds = async (req, res, next) => {
  try {
    let lastRssFeedId = mongoose.Types.ObjectId(req.params.lastRssFeedId);
    let rssFeeds = await AllContent.find({
      _id: { $lt: lastRssFeedId },
    })
      .sort({ _id: -1 })
      .populate("publisher", "name")
      .limit(20);
    res.status(200).json({ success: true, data: rssFeeds });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.getTotalCountRssFeeds = async (req, res, next) => {
  try {
    let rssFeedsCount = await AllContent.countDocuments();
    res.status(200).json({ success: true, data: rssFeedsCount });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getRssFeedsFilteredByPublisherId = async (req, res, next) => {
  try {
    let rssFeeds = await AllContent.find({ publisher: req.params.publisherId })
      .sort({ _id: -1 })
      .populate("publisher", "name")
      .limit(+req.params.limitcount);
    res
      .status(200)
      .json({ success: true, count: rssFeeds.length, data: rssFeeds });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getSingleRssFeedById = async (req, res, next) => {
  try {
    let rssFeed = await AllContent.findOne({ _id: req.params.id });
    res.status(200).json({ success: true, data: rssFeed });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.updateVisitedStatusOfRssfeed = async (req, res, next) => {
  try {
    await AllContent.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json({ success: true, message: "Rss feed visited marked" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteSingleRssFeedById = async (req, res, next) => {
  try {
    await AllContent.remove({ _id: req.params.id });
    res.status(200).json({ success: true, message: "deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteAllRssFeeds = async (req, res, next) => {
  try {
    await AllContent.remove();
    res.status(200).json({ success: true, message: "deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
