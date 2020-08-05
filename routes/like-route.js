const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller functions for follow */
const {
  getLikedForLoggedinUser,
  saveLike,
  getLikersForPublisher,
  getLikeWithPublisherForLoggedInUser,
  unLikePublisherWithPublisherId,
} = require("../controllers/like");

/**
 * @description   this route is used to get likes for loggedin user
 * @route   GET      /api/like
 * @access  Private
 */
router.get("/", checkAuth, getLikedForLoggedinUser);

/**
 * @description   this route is used to like a publisher
 * @route   POST      /api/like
 * @access  Private
 */
router.post("/", checkAuth, saveLike);

//  Data according to publisher ID
/**
 * @description   this route is used to get likers for a publisher
 * @param id - publisherId
 * @route   GET      /api/like/:id
 * @access  Public
 */
router.get("/:id", getLikersForPublisher);

/**
 * @description   this route is used to get details
 *                 with given publisherId and loggedin user
 * @param id - publisherId
 * @route   GET      /api/like/user/publisher/:id
 * @access  Private
 */
router.get(
  "/user/publisher/:id",
  checkAuth,
  getLikeWithPublisherForLoggedInUser
);

/**
 * @description   this route is used to unlike a publisherId with loggedin user
 * @param id - publisherId
 * @route   DELETE      /api/like/user/publisher/:id
 * @access  Private
 */
router.delete("/user/publisher/:id", checkAuth, unLikePublisherWithPublisherId);
module.exports = router;
