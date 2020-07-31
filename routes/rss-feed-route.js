const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

const Parser = require("rss-parser");
const parser = new Parser();

/**controller functions for rss feeds */
const {
  getSingleRssFeedById,
  updateVisitedStatusOfRssfeed,
  deleteSingleRssFeedById,
  deleteAllRssFeeds,
  getRssfeedsWithPageAndLimit,

  getOlderRssFeedsPagination,
  getLatestRssFeedsPagination,

  getOlderRssFeedsPaginationWithPublisherId,
  getLatestRssFeedsPaginationWithPublisherId,
} = require("../controllers/rssfeed");

/**
 * @desc  GET all older rss feeds pagination wise
 * @route GET /api/rss/older/:rssFeedPage/:rssFeedLimit
 * @access  Private
 */
router.get(
  "/older/:rssFeedPage/:rssFeedLimit",
  checkAuth,
  getOlderRssFeedsPagination
);

/**
 * @desc  GET all latest rss feeds pagination wise
 * @route GET /api/rss/latest/:rssFeedPage/:rssFeedLimit
 * @access  Private
 */
router.get(
  "/latest/:rssFeedPage/:rssFeedLimit",
  checkAuth,
  getLatestRssFeedsPagination
);

/**** */

/**
 * @desc  GET all older rss feeds pagination wise with publisher filter
 * @route GET /api/rss/older/:rssFeedPage/:rssFeedLimit/:publisherId
 * @access  Private
 */
router.get(
  "/older/:rssFeedPage/:rssFeedLimit/:publisherId",
  checkAuth,
  getOlderRssFeedsPaginationWithPublisherId
);

/**
 * @desc  GET all latest rss feeds pagination wise with publisher filter
 * @route GET /api/rss/latest/:rssFeedPage/:rssFeedLimit/:publisherId
 * @access  Private
 */
router.get(
  "/latest/:rssFeedPage/:rssFeedLimit/:publisherId",
  checkAuth,
  getLatestRssFeedsPaginationWithPublisherId
);

/***** */

/**
 * @desc  GET single rss feed
 * @route GET /api/rss/getRssbyId/:id
 * @access  Public
 */
router.get("/getRssbyId/:id", getSingleRssFeedById);

/**
 * @desc  POST passing baseUrl in reg.body and getting rss feeds with pagination limit
 * @route POST /api/rss/page/:page/limit/:limit/:publisherId
 * @access  Public
 */

router.post(
  "/page/:page/limit/:limit/:publisherId",
  getRssfeedsWithPageAndLimit
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
