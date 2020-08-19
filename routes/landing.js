const router = require("express").Router();

/**controller functions for keyword */
const { getArticlesByCategoryGiven } = require("../controllers/landing");

/**
 * @description   this route is used to get top 10 latest articles for a category
 * @route   GET      /api/landing/category/:categorySearch
 * @access  Public
 */
router.get("/category/:categorySearch", getArticlesByCategoryGiven);

module.exports = router;
