const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller functions  */
const {
  getAllRatings,
  addRating,
  getRatingWithArticleIdForLoggedInUser,
  getAllRatingsAggregateWithArticleId,
  getAllRatingsInAggregate,
  getAllRatingsForUser,
} = require("../controllers/rating");

/**
 * @description   this route is used to get all ratings
 * @route   GET      /api/rating
 * @access  Public
 */
router.get("/", getAllRatings);

/**
 * @description   this route is used to add new rating
 * @route   POST      /api/rating
 * @access  Private
 */
router.post("/", checkAuth, addRating);

/**
 * @description   this route is used to get all rating with loggedin user
 * @param articleId
 * @route   GET      /api/rating/user/:articleId
 * @access  Private
 */
router.get(
  "/user/:articleId",
  checkAuth,
  getRatingWithArticleIdForLoggedInUser
);

/**
 * @description   this route is used to get all ratings for given userId
 * @param userId
 * @route   GET      /api/rating/:userId
 * @access  Public
 */
router.get("/:userId", getAllRatingsForUser);

/**
 * @description   this route is used to get all rating in aggregate
 * @route   GET      /api/rating/aggregate/all
 * @access  Public
 */
router.get("/aggregate/all", getAllRatingsInAggregate);

/**
 * @description   this route is used to get ratings with articleId
 * @param id
 * @route   GET      /api/rating/article/:id
 * @access  Public
 */
router.get("/article/:id", getAllRatingsAggregateWithArticleId);

module.exports = router;
