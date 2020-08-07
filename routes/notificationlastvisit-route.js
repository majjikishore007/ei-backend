const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller function */
const {
  insertNotificationLastVisit,
  getLastvisitedNotificationDate,
} = require("../controllers/notificationlastvisit");

/**
 * @desc    Post last visited notification time with Loggedin UserId
 * @route   POST /api/notificationlastvisit
 * @access  Private
 */
router.post("/", checkAuth, insertNotificationLastVisit);

/**
 * @desc    Post last visited notification time with Loggedin UserId
 * @route   POST /api/notificationlastvisit
 * @access  Private
 */
router.get("/:id", getLastvisitedNotificationDate);
module.exports = router;
