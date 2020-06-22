const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller function for publisher rating */
const {
  getAllPublisherRatings,
  savePublisherRating,
  getRatingForPublisherId,
} = require("../controllers/publisherrating");

/**validation for publisher rating route */
const {
  validateOnSavePublisherRating,
} = require("./validation/publisherrating");

/**
 * @description   this route is used to get all preferences
 * @route   GET      /api/publisherrating
 * @access  Public
 */
router.get("/", getAllPublisherRatings);

/**
 * @description   this route is used to get all preferences
 * @route   POST      /api/publisherrating
 * @access  Private
 */
router.post("/", checkAuth, validateOnSavePublisherRating, savePublisherRating);

/**
 * @description   this route is used to get all preferences
 * @param - publisherId
 * @route   GET      /api/publisherrating/:user/:publisherId
 * @access  Private
 */
router.get("/user/:publisherId", checkAuth, getRatingForPublisherId);

module.exports = router;
