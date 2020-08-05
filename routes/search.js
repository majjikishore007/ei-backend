const router = require("express").Router();
const authCheck = require("../middleware/check-auth");
const {
  getSuggestionsForSearch,
  getSearchResultForSearch,
} = require("../controllers/search");

/**
 * @description   this route is used to get suggestions of searching while typing
 * @route   POST      /api/search
 * @access  Public
 */
router.post("/", getSuggestionsForSearch);

/**
 * @description   this route is used to get searched results
 * @route   POST      /api/search/searchResult
 * @access  Public
 */
router.post("/searchResult/page/:page/limit/:limit", getSearchResultForSearch);

module.exports = router;
