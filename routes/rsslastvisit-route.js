const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller function */
const { insertRssLastVisit , getLastvisitedRssFeedId } = require("../controllers/rsslastvisit");

/**
 * @desc    Post last visited Rss feed Id with Loggedin UserId
 * @route   POST /api/rsslastvisit
 * @access  Private
 */

router.post("/", checkAuth, insertRssLastVisit);

router.get("/:id" , getLastvisitedRssFeedId)
module.exports = router;
