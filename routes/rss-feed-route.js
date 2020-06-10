const router = require("express").Router();
const Parser = require("rss-parser");
const parser = new Parser();
const RssFeedstructure = require("../models/rss-feed-structure");
const AllContent = require("../models/all-content");

/**
 *  @desc  POST all rss feeds
 * @route POST /api/rss/
 * @access  Public
 */

router.post("/", async (req, res) => {
  try {
    let structure = await RssFeedstructure.findOne({
      publisherId: req.body.publisherId,
    });
    if (!structure) {
      return res.status(401).json({
        success: false,
        message: "Rss feed structure for this pubisher not found",
      });
    }
    let feed = await parser.parseURL(req.body.url);

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
    let rssFeeds = await Promise.all(insertPromiseArr);
    res.json({ success: true, insertRssFeedList: rssFeeds });
  } catch (err) {
    res.json({
      error: err,
      message: "unable to insert due to corrupt xml file",
    });
  }
});

/**
 * @desc  GET all rss feeds
 * @route GET /api/rss/
 * @access  Public
 */
router.get("/limit/:limitcount", async (req, res) => {
  try {
    let rssFeeds = await AllContent.find()
      .populate("publisher", "name")
      .limit(+req.params.limitcount);
    res.status(200).json({ success: true, count: rssFeeds.length, rssFeeds });
  } catch (err) {
    res.json({ error: err });
  }
});

/**
 * @desc  GET all rss feeds count
 * @route GET /api/rss/getCount
 * @access  Public
 */
router.get("/getCount", async (req, res) => {
  try {
    let rssFeedsCount = await AllContent.countDocuments();
    res.status(200).json({ success: true, count: rssFeedsCount });
  } catch (err) {
    res.json({ error: err });
  }
});

/**
 * @desc  GET rss feeds with publisherId
 * @route GET /api/rss/publisher/:publisherId
 * @access  Public
 */
router.get("/publisher/:publisherId/:limitcount", async (req, res) => {
  try {
    let rssFeeds = await AllContent.find({ publisher: req.params.publisherId })
      .populate("publisher", "name")
      .limit(+req.params.limitcount);
    res.status(200).json({ success: true, count: rssFeeds.length, rssFeeds });
  } catch (err) {
    res.json({ error: err });
  }
});

/**
 * @desc  GET single rss feed
 * @route GET /api/rss/:id
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    let rssFeed = await AllContent.findOne({ _id: req.params.id });
    res.status(200).json({ success: true, rssFeed });
  } catch (err) {
    res.json({ error: err });
  }
});

/**
 * @desc  delete single rss feed
 * @route DELETE /api/rss/:id
 * @access  Public
 */
router.delete("/:id", async (req, res) => {
  try {
    await AllContent.remove({ _id: req.params.id });
    res.status(200).json({ success: true, message: "deleted" });
  } catch (err) {
    res.json({ error: err });
  }
});

/**
 * @desc  delete all rss feeds
 * @route DELETE /api/rss/
 * @access  Public
 */
router.delete("/", async (req, res) => {
  try {
    await AllContent.remove();
    res.status(200).json({ success: true, message: "deleted" });
  } catch (err) {
    res.json({ error: err });
  }
});

module.exports = router;
