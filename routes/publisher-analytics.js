const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller function */
const {
 getAnalytics
} = require("../controllers/publisher-analytics");

/**
 * @description   this route is used to get all publisher analytics
 * @route   GET      /api/publisher-analytics
 * @access  Public
 */
router.get("/:publisherId", getAnalytics);


module.exports = router;
