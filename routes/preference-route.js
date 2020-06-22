const router = require("express").Router();
const images = require("../config/cloud-storage-setup");
const checkAuth = require("../middleware/check-auth");

/**controller function */
const {
  getAllPreferences,
  addPreferences,
} = require("../controllers/preference");

/**validation file */
const { validateOnPreferenceSave } = require("./validation/preference");

/**
 * @description   this route is used to get all preferences
 * @route   GET      /api/preference
 * @access  Public
 */
router.get("/", getAllPreferences);

/**
 * @description   this route is used to insert a new preferences
 * @route   GET      /api/preference
 * @access  Public
 */
router.post("/", validateOnPreferenceSave, addPreferences);

module.exports = router;
