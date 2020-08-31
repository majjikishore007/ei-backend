const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

const {
  getArticlesWithLimitedPreferencesAndLimitedKeywords,
  getKeywordsWithArticles,
  getNextArticles,
  getArticlesForMobile,
  getArticlesForMobileForKeywordOnly,
  getNextArticlesForMobile,
  getMediaForMobile,
  getNextMediaForMobile,
  getOnlyMediaForMobile,
  fetchFeedMobile,
  fetchFeedWebsite,
} = require("../controllers/newsfeed");

router.get("/mobile/feed", checkAuth, fetchFeedMobile);

router.get("/website/feed", checkAuth, fetchFeedWebsite);

/**
 * @description   this route is used to get articles, audios, videos for a specific keyword
 * @param keyword
 * @param articlePage
 * @param articleLimit
 * @route   GET      /api/newsfeed/getArticles/:keyword/:articlePage/:articleLimit
 * @access  Private
 */
router.get(
  "/getArticles/:keyword/:articlePage/:articleLimit/device/:device",
  getNextArticles
);

/**
 * @description this route is used to get articles, audios, videos for limited keywords only after when prefernce count 0
 * @param keywordPage
 * @param keywordLimit
 * @param articleLimit
 * @route   GET      /api/newsfeed/getArticlesForOnlyKeywords/:lastKeywordFrequencyCount/:keywordLimit/:articleLimit
 * @access  Private
 */
router.get(
  "/getArticlesForOnlyKeywords/:keywordPage/:keywordLimit/:articleLimit/device/:device",
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
  "/mobile/getArticles/:keyword/:articlePage/:articleLimit/device/:device",
  checkAuth,
  getNextArticlesForMobile
);

/**
 * @description   this route is used to get  articles according to trending keywords
 * @param keywordPage
 * @param keywordLimit
 * @param articleLimit
 * @route   GET      /api/newsfeed/mobile/onlykeyword/getArticles/:keywordPage/:keywordLimit/:articleLimit/device/:device
 * @access  Private
 */

router.get(
  "/mobile/onlykeyword/getArticles/:keywordPage/:keywordLimit/:articleLimit/device/:device",
  getArticlesForMobileForKeywordOnly
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
  "/:preferencePage/:preferenceLimit/:keywordPage/:keywordLimit/:articleLimit/device/:device",
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
  "/mobile/:preferencePage/:preferenceLimit/:keywordPage/:keywordLimit/:articleLimit/device/:device",
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

/**
 * @description   this route is used to get  audio,video paginationwise
 * @param page
 * @param limit
 * @route   GET      /api/newsfeed/mobile/getOnlyMediaForMobile/audio/video/page/:page/limit/:limit
 * @access  Public
 */
router.get(
  "/mobile/getOnlyMediaForMobile/audio/video/page/:page/limit/:limit",
  getOnlyMediaForMobile
);

module.exports = router;
