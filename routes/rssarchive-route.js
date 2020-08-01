const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller function */
const {
  addRssToArchive,
  getRssArchivedPagination,
} = require("../controllers/rssarchive");

/**
 * @desc    Post last visited Rss feed Id with Loggedin UserId
 * @route   POST /api/rssarchive
 * @access  Private
 */

router.post("/", checkAuth, addRssToArchive);

/**
 * @desc    Get latest rss archives
 * @route   GET /api/rssarchive/:page/:limit
 * @access  Private
 */

router.get("/:page/:limit", checkAuth, getRssArchivedPagination);

module.exports = router;
