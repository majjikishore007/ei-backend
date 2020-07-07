const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

const Parser = require("rss-parser");
const parser = new Parser();

/**controller functions for rss feeds */
const {
  getInitialRssFeeds,
  getNextbatchRssFeeds,
  getTotalCountRssFeeds,
  getRssFeedsFilteredByPublisherId,
  getSingleRssFeedById,
  updateVisitedStatusOfRssfeed,
  deleteSingleRssFeedById,
  deleteAllRssFeeds,
} = require("../controllers/rssfeed");

/**
 * @desc  GET all rss feeds
 * @route GET /api/rss/:rssFeedLimit
 * @access  Public
 */
router.get("/:rssFeedLimit", checkAuth, getInitialRssFeeds);

/**
 * @desc  GET single rss feed
 * @route GET /api/rss/getRssbyId/:id
 * @access  Public
 */
router.get("/getRssbyId/:id", getSingleRssFeedById);

/**
 * @desc  GET all rss feeds next batch
 * @route GET /api/rss/nextbatch/:rssFeedLimit/:lastRssFeedId
 * @access  Public
 */
router.get(
  "/nextbatch/:rssFeedLimit/:lastRssFeedId",
  checkAuth,
  getNextbatchRssFeeds
);

/**
 * @desc  GET all rss feeds count
 * @route GET /api/rss/getCount
 * @access  Public
 */
// router.get("/getCount", checkAuth, getTotalCountRssFeeds);

/**
 * @desc  GET rss feeds with publisherId
 * @route GET /api/rss/getbyPublisherId/publisher/:publisherId
 * @access  Public
 */
router.get(
  "/getbyPublisherId/publisher/:publisherId/:limitcount",
  getRssFeedsFilteredByPublisherId
);

/**
 * @desc  PATCH single rss feed viewed as true
 * @route PATCH /api/rss/:id
 * @access  Public
 */
router.patch("/:id", checkAuth, updateVisitedStatusOfRssfeed);

/**
 * @desc  delete single rss feed
 * @route DELETE /api/rss/:id
 * @access  Public
 */
router.delete("/:id", checkAuth, deleteSingleRssFeedById);

/**
 * @desc  delete all rss feeds
 * @route DELETE /api/rss/
 * @access  Public
 */
router.delete("/", deleteAllRssFeeds);

module.exports = router;
