const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

const {
   getNextMedia ,
   getMediaWithLimitedPreferencesAndLimitedKeywords
} = require("../controllers/media");



/**
 * @description   this route is used to get  audios, videos for a specific keyword
 * @param keyword
 * @param articlePage
 * @param articleLimit
 * @route   GET      /api/newsfeed/getArticles/:keyword/:articlePage/:articleLimit
 * @access  Private
 */
router.get(
  "/getArticles/:keyword/:articlePage/:articleLimit/device/:device",
  getNextMedia
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
  "/:preferencePage/:preferenceLimit/:keywordPage/:keywordLimit/:mediaLimit/device/:device",
  checkAuth,
  getMediaWithLimitedPreferencesAndLimitedKeywords
);


module.exports = router;
