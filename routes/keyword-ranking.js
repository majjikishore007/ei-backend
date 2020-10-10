const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller functions for follow */
const {
  updateKeywordRankForPreferenceSelection,
  updateKeywordRankForArticleView,
  updateKeywordRankForArticleRead,
  updateKeywordRankForPublisherVote
} = require("../controllers/keywordranking");

/**
 * @description   this route is used to update ranking for keyword while selection keyword
 * @route   POST      /api/keyword-ranking
 * @access  Private
 */
router.post(
  "/preference-selection",
  checkAuth,
  updateKeywordRankForPreferenceSelection
);

/**
 * @description   this route is used to update ranking for keyword while opening a article page
 * @route   POST      /api/keyword-ranking
 * @access  Private
 */
router.post("/article-view", checkAuth, updateKeywordRankForArticleView);

/**
 * @description   this route is used to update ranking for keyword while reading a article
 * @route   POST      /api/keyword-ranking
 * @access  Private
 */
router.post("/article-read", checkAuth, updateKeywordRankForArticleRead);

/**
 * @description   this route is used to update ranking for keyword while vote for a publisher
 * @route   POST      /api/keyword-ranking
 * @access  Private
 */
router.post("/vote-for-publisher", checkAuth, updateKeywordRankForPublisherVote);

module.exports = router;
