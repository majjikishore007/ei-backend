const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller functions  */
const {
  getSimilarArticles,
  getLatestArticles,
  getLastSevenDaysMostViewedArticles,
  getTopRatedArticles,
} = require("../controllers/recomendation");

/**
 * @description   this route is used to get top latest articles
 * @route   GET      /api/recomendation/getlatestArticles/limit/:limit/device/:device
 * @access  Public
 */
router.get("/getlatestArticles/limit/:limit/device/:device", getLatestArticles);

/**
 * @description   this route is used to get top 5 most viewed articles
 * @route   GET      /api/recomendation/getMostViewedArticles/limit/:limit/device/:device
 * @access  Public
 */
router.get(
  "/getMostViewedArticles/limit/:limit/device/:device",
  getLastSevenDaysMostViewedArticles
);

/**
 * @description   this route is used to get latest 10 top rated articles
 * @route   GET      /api/recomendation/getTopRatedArticles/limit/:limit/device/:device
 * @access  Public
 */
router.get(
  "/getTopRatedArticles/limit/:limit/device/:device",
  getTopRatedArticles
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
