const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

const {
  getArticlesWithLimitedPreferencesAndLimitedKeywords,
  getNextbatchArticlesWithLimitedPreferencesAndLimitedKeywords,
  getNextArticlesForkeyword,
  getNextArticlesForKeywords,
} = require("../controllers/newsfeed");

/**
 * @description   this route is used to get articles according to trending keywords 
                  and preferences of loggedin user
 * @param preferenceLimit
 * @param keywordLimit
 * @param articleLimit
 * @route   GET      /api/newsfeed/:preferenceLimit/:keywordLimit/:articleLimit
 * @access  Private
 */
router.get(
  "/:preferenceLimit/:keywordLimit/:articleLimit",
  checkAuth,
  getArticlesWithLimitedPreferencesAndLimitedKeywords
);

/**
 * @description   this route is used to get next batch articles according to preferences and keywords
 * @param lastPreferenceId
 * @param preferenceLimit
 * @param lastKeywordFrequencyCount
 * @param keywordLimit
 * @param articleLimit
 * @route   GET      /api/newsfeed/:lastPreferenceId/:preferenceLimit/:lastKeywordFrequencyCount/:keywordLimit/:articleLimit
 * @access  Private
 */
router.get(
  "/:lastPreferenceId/:preferenceLimit/:lastKeywordFrequencyCount/:keywordLimit/:articleLimit",
  checkAuth,
  getNextbatchArticlesWithLimitedPreferencesAndLimitedKeywords
);

/**
 * @description   this route is used to get next batch of articles for a specific keyword
 * @param keyword
 * @param lastArticleId
 * @param articleLimit
 * @route   GET      /api/newsfeed/getArticles/:keyword/:lastArticleId/:articleLimit
 * @access  Private
 */
router.get(
  "/getArticles/:keyword/:lastArticleId/:articleLimit",
  getNextArticlesForkeyword
);

/**
 * @description   this route is used to get articles for limited keywords only
 * @param lastKeywordFrequencyCount
 * @param keywordLimit
 * @param articleLimit
 * @route   GET      /api/newsfeed/getArticlesForOnlyKeywords/:lastKeywordFrequencyCount/:keywordLimit/:articleLimit
 * @access  Private
 */
router.get(
  "/getArticlesForOnlyKeywords/:lastKeywordFrequencyCount/:keywordLimit/:articleLimit",
  getNextArticlesForKeywords
);

module.exports = router;
