const router = require("express").Router();

/**controller functions for rss feeds */
const {
  getInitailRssFeeds,
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
 * @route GET /api/rss/
 * @access  Public
 */
router.get("/", getInitailRssFeeds);

/**
 * @desc  GET all rss feeds next batch
 * @route GET /api/rss/nextbatch/:lastRssFeedId
 * @access  Public
 */
router.get("/nextbatch/:lastRssFeedId", getNextbatchRssFeeds);

/**
 * @desc  GET all rss feeds count
 * @route GET /api/rss/getCount
 * @access  Public
 */
router.get("/getCount", getTotalCountRssFeeds);

/**
 * @desc  GET rss feeds with publisherId
 * @route GET /api/rss/publisher/:publisherId
 * @access  Public
 */
router.get(
  "/publisher/:publisherId/:limitcount",
  getRssFeedsFilteredByPublisherId
);

/**
 * @desc  GET single rss feed
 * @route GET /api/rss/:id
 * @access  Public
 */
router.get("/:id", getSingleRssFeedById);

/**
 * @desc  PATCH single rss feed viewed as true
 * @route PATCH /api/rss/:id
 * @access  Public
 */
router.patch("/:id", updateVisitedStatusOfRssfeed);

/**
 * @desc  delete single rss feed
 * @route DELETE /api/rss/:id
 * @access  Public
 */
router.delete("/:id", deleteSingleRssFeedById);

/**
 * @desc  delete all rss feeds
 * @route DELETE /api/rss/
 * @access  Public
 */
router.delete("/", deleteAllRssFeeds);

module.exports = router;
