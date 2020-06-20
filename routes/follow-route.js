const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller functions for follow */
const {
  getFollowForLoggedinUser,
  saveFollow,
  getFollowersForPublisher,
  getFollowingPublishersForUserId,
  getFollowWithPublisherForLoggedInUser,
  unFollowPublisherWithPublisherId,
  aggregateFollowingForLoggedinUser,
} = require("../controllers/follow");

/**
 * @description   this route is used to get follows for loggedin user
 * @route   GET      /api/follow
 * @access  Private
 */
router.get("/", checkAuth, getFollowForLoggedinUser);

/**
 * @description   this route is used to follow a publisher
 * @route   POST      /api/follow
 * @access  Private
 */
router.post("/", checkAuth, saveFollow);

//  Data according to publisher ID
/**
 * @description   this route is used to get follow for a publisher
 * @param id - publisherId
 * @route   GET      /api/follow/:id
 * @access  Public
 */
router.get("/:id", getFollowersForPublisher);

// Data according to userId

/**
 * @description   this route is used to get following publishers list with all followings for given userId
 * @param userId - userId
 * @route   GET      /api/follow/listofpub/:userId
 * @access  Public
 */
router.get("/listofpub/:userId", getFollowingPublishersForUserId);

/**
 * @description   this route is used to get details with given publisherId and loggedin user
 * @param id - publisherId
 * @route   GET      /api/follow/user/publisher/:id
 * @access  Private
 */
router.get(
  "/user/publisher/:id",
  checkAuth,
  getFollowWithPublisherForLoggedInUser
);

/**
 * @description   this route is used to unfollow a publisherId with loggedin user
 * @param id - publisherId
 * @route   DELETE      /api/follow/user/publisher/:id
 * @access  Private
 */
router.delete(
  "/user/publisher/:id",
  checkAuth,
  unFollowPublisherWithPublisherId
);

/**
 * @description   this route is used to get followers for all publishers
 * @route   GET      /api/follow/aggregate/all
 * @access  Private
 */
router.get("/aggregate/all", checkAuth, aggregateFollowingForLoggedinUser);

module.exports = router;
