const router = require("express").Router();
const chekAuth = require("../middleware/check-auth");

/**controller functions for keyword */
const { getAllKeywords, saveKeywords } = require("../controllers/keyword");

/**
 * @description   this route is used to get all categories from article and stor them to keyward collections
 * @route   GET      /api/keyword
 * @access  Public
 */
router.post("/", saveKeywords);

/**
 * @description   this route is used to get all keywords from keyward collections
 * @route   GET      /api/keyword
 * @access  Public
 */
router.get("/", getAllKeywords);

module.exports = router;
