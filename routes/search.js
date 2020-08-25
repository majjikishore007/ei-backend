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
 * @route   POST      /api/search/searchResult/page/:page/limit/:limit/device/:device
 * @access  Public
 */
router.post(
  "/searchResult/page/:page/limit/:limit/device/:device",
  getSearchResultForSearch
);

module.exports = router;
