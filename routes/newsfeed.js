const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

const {
  getArticlesWithLimitedPreferencesAndLimitedKeywords,
  getKeywordsWithArticles,
  getNextArticles,
  getArticlesForMobile,
  getNextArticlesForMobile,
  getMediaForMobile,
  getNextMediaForMobile,
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
 * @description   this route is used to get articles for a specific keyword
 * @param keyword
 * @param articlePage
 * @param articleLimit
 * @route   GET      /api/newsfeed/mobile/getArticles/:keyword/:articlePage/:articleLimit
 * @access  Private
 */
router.get(
  "/mobile/getArticles/:keyword/:articlePage/:articleLimit",
  checkAuth,
  getNextArticlesForMobile
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

/**for mobile */

/**
 * @description   this route is used to get audios, videos for a specific keyword
 * @param keyword
 * @param articlePage
 * @param articleLimit
 * @route   GET      /api/newsfeed/mobile/mediaOnly/getNextMedia/:keyword/:articlePage/:articleLimit
 * @access  Private
 */
router.get(
  "/mobile/mediaOnly/getNextMedia/:keyword/:articlePage/:articleLimit",
  checkAuth,
  getNextMediaForMobile
);

/**
 * @description   this route is used to get  articles according to trending keywords 
                  and preferences of loggedin user
 * @param preferencePage
 * @param preferenceLimit
 * @param keywordPage
 * @param keywordLimit
 * @param articleLimit
 * @route   GET      /api/newsfeed/mobile/:preferencePage/:preferenceLimit/:keywordPage/:keywordLimit/:articleLimit
 * @access  Private
 */

router.get(
  "/mobile/:preferencePage/:preferenceLimit/:keywordPage/:keywordLimit/:articleLimit",
  checkAuth,
  getArticlesForMobile
);

/**
 * @description   this route is used to get  audio,video according to trending keywords 
                  and preferences of loggedin user
 * @param preferencePage
 * @param preferenceLimit
 * @param keywordPage
 * @param keywordLimit
 * @param articleLimit
 * @route   GET      /api/newsfeed/mobile/media/:preferencePage/:preferenceLimit/:keywordPage/:keywordLimit/:articleLimit
 * @access  Private
 */

router.get(
  "/mobile/media/:preferencePage/:preferenceLimit/:keywordPage/:keywordLimit/:articleLimit",
  checkAuth,
  getMediaForMobile
);

module.exports = router;
