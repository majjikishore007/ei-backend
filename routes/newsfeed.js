const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

const {
  getArticlesWithLimitedPreferencesAndLimitedKeywords,
  getKeywordsWithArticles,
  getNextArticles,
} = require("../controllers/newsfeed");

/**
 * @description   this route is used to get articles, audios, videos for a specific keyword
 * @param keyword
 * @param articlePage
 * @param articleLimit
 * @route   GET      /api/newsfeed/getArticles/:keyword/:articlePage/:articleLimit
 * @access  Private
 */
router.get("/getArticles/:keyword/:articlePage/:articleLimit", getNextArticles);

/**
 * @description this route is used to get articles, audios, videos for limited keywords only after when prefernce count 0
 * @param keywordPage
 * @param keywordLimit
 * @param articleLimit
 * @route   GET      /api/newsfeed/getArticlesForOnlyKeywords/:lastKeywordFrequencyCount/:keywordLimit/:articleLimit
 * @access  Private
 */
router.get(
  "/getArticlesForOnlyKeywords/:keywordPage/:keywordLimit/:articleLimit",
  getKeywordsWithArticles
);

/**
 * @description   this route is used to get  articles, audios, videos according to trending keywords 
                  and preferences of loggedin user
 * @param preferencePage
 * @param preferenceLimit
 * @param keywordPage
 * @param keywordLimit
 * @param articleLimit
 * @route   GET      /api/newsfeed/:preferencePage/:preferenceLimit/:keywordPage/:keywordLimit/:articleLimit
 * @access  Private
 */
router.get(
  "/:preferencePage/:preferenceLimit/:keywordPage/:keywordLimit/:articleLimit",
  checkAuth,
  getArticlesWithLimitedPreferencesAndLimitedKeywords
);

module.exports = router;
