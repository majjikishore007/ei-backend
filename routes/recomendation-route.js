const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller functions  */
const {
  getSimilarArticles,
  getTopFiveLatestArticles,
  getLastSevenDaysTopFiveMostViewedArticles,
  getToptenTopRatedArticles,
} = require("../controllers/recomendation");

/**
 * @description   this route is used to get top latest articles
 * @route   GET      /api/recomendation/getlatestArticles/device/:device
 * @access  Public
 */
router.get("/getlatestArticles/device/:device", getTopFiveLatestArticles);

/**
 * @description   this route is used to get top 5 most viewed articles
 * @route   GET      /api/recomendation/getMostViewedArticles/device/:device
 * @access  Public
 */
router.get(
  "/getMostViewedArticles/device/:device",
  getLastSevenDaysTopFiveMostViewedArticles
);

/**
 * @description   this route is used to get latest 10 top rated articles
 * @route   GET      /api/recomendation/getToptenTopRatedArticles/device/:device
 * @access  Public
 */
router.get(
  "/getToptenTopRatedArticles/device/:device",
  getToptenTopRatedArticles
);

/**
 * @description   this route is used to get all ratings
 * @route   GET      /api/recomendation/similararticles/:article/limit/:limit/device/:device
 * @access  Public
 */
router.get(
  "/similararticles/:article/limit/:limit/device/:device",
  checkAuth,
  getSimilarArticles
);

module.exports = router;
