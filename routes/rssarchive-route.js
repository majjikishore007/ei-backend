const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller function */
const {
  addRssToArchive,
  getlatestRssArchive,
  getNextbatchRssArchive,
} = require("../controllers/rssarchive");

/**
 * @desc    Post last visited Rss feed Id with Loggedin UserId
 * @route   POST /api/rssarchive
 * @access  Private
 */

router.post("/", checkAuth, addRssToArchive);

/**
 * @desc    Get latest rss archives
 * @route   GET /api/rssarchive
 * @access  Private
 */

router.get("/", checkAuth, getlatestRssArchive);

/**
 * @desc  GET all archived rss feeds next batch
 * @route GET /api/rssarchive/nextbatch/:lastRssarchiveId
 * @access  Public
 */
router.get("/nextbatch/:lastRssarchiveId", checkAuth, getNextbatchRssArchive);

module.exports = router;
