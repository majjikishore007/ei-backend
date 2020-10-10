const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller functions for follow */
const {
  updateKeywordRankForPreferenceSelection,
  updateKeywordRankForArticleView,
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

module.exports = router;
