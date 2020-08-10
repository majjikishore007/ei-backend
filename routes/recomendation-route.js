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
 * @route   GET      /api/recomendation/getlatestArticles
 * @access  Public
 */
router.get("/getlatestArticles", getTopFiveLatestArticles);

/**
 * @description   this route is used to get top 5 most viewed articles
 * @route   GET      /api/recomendation/getMostViewedArticles
 * @access  Public
 */
router.get("/getMostViewedArticles", getLastSevenDaysTopFiveMostViewedArticles);

/**
 * @description   this route is used to get latest 10 top rated articles
 * @route   GET      /api/recomendation/getToptenTopRatedArticles
 * @access  Public
 */
router.get("/getToptenTopRatedArticles", getToptenTopRatedArticles);

/**
 * @description   this route is used to get all ratings
 * @route   GET      /api/recomendation/similararticles/:article/limit/:limit
 * @access  Public
 */
router.get(
  "/similararticles/:article/limit/:limit",
  checkAuth,
  getSimilarArticles
);

module.exports = router;
