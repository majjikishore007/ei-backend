const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller function */
const {
  // getAllPreferences,
  addPreferences,
  getAllPreferencesForLoggedinUser,
  getPeferencesPaginationwise,
  deleteUserPreferencesByKeywordId,
  getPreferenceSearchingSuggestions,
} = require("../controllers/preference");

/**validation file */
const { validateOnPreferenceSave } = require("./validation/preference");

/**
 * @description   this route is used to get all preferences
 * @route   GET      /api/preference
 * @access  Public
 */
// router.get("/", getAllPreferences);

/**
 * @description   this route is used to get all preferences for loggedin user
 * @route   GET      /api/preference/getpreferences
 * @access  Private
 */
router.get("/getpreferences", checkAuth, getAllPreferencesForLoggedinUser);

/**
 * @description   this route is used to get all searching keywords for searched text similar
 * @route   GET      /api/preference/search/:searchPreference
 * @access  Private
 */
router.get(
  "/search/:searchPreference",
  checkAuth,
  getPreferenceSearchingSuggestions
);

/**
 * @description   this route is used to get preferences paginationwise for loggedin user
 * @route   GET      /api/preference/page/:page/limit/:limit
 * @access  Private
 */
router.get("/page/:page/limit/:limit", checkAuth, getPeferencesPaginationwise);

/**
 * @description   this route is used to add a keyword in preferences for loggedin user
 * @route   POST      /api/preference
 * @access  Private
 */
router.post("/", validateOnPreferenceSave, checkAuth, addPreferences);

/**
 * @description   this route is used to delete keyword from preferences for loggedin user
 * @param keywordId - keyword id
 * @route   DELETE      /api/preference/:keywordId
 * @access  Private
 */
router.delete("/:keywordId", checkAuth, deleteUserPreferencesByKeywordId);

module.exports = router;
