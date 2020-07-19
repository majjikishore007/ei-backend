const router = require("express").Router();
const chekAuth = require("../middleware/check-auth");

/**controller functions for keyword */
const {
  getAllKeywords,
  getInitalKeywords,
  getNextbatchKeywords,
  getkeywordswithSkippingKeywords,
} = require("../controllers/keyword");
const checkAuth = require("../middleware/check-auth");

/**
 * @description   this route is used to get all keywords from keyward collections
 * @route   GET      /api/keyword
 * @access  Public
 */
router.get("/", getAllKeywords);

/**
 * @description   this route is used to get all keywords from keyward collections
 * @route   GET      /api/keyword/:limitCount
 * @access  Public
 */
router.get("/:limitCount", getInitalKeywords);

/**
 * @description   this route is used to get all keywords from keyward collections
 * @route   GET      /api/keyword/:limitCount/:lastKeywordCount
 * @access  Public
 */
router.get("/:limitCount/:lastKeywordCount", getNextbatchKeywords);

/**
 * @description   this route is used to get keywords with skipping certain number of documents with information
 * if it is added in preference or not
 * @route   GET      /api/keyword/page/:page/limit/:limit
 * @access  Private
 */
router.get(
  "/page/:page/limit/:limit",
  checkAuth,
  getkeywordswithSkippingKeywords
);

module.exports = router;
