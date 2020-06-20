const router = require("express").Router();

/**controller functions for feedback */
const { getAllFeedbacks, saveFeedback } = require("../controllers/feedback");

/**
 * @description   this route is used to get all feedbacks from different users
 * @route   GET      /api/feedback
 * @access  Public
 */
router.get("/", getAllFeedbacks);

/**
 * @description   this route is used to add a feedback for a user
 * @route   GET      /api/feedback
 * @access  Public
 */
router.post("/", saveFeedback);

module.exports = router;
