const router = require("express").Router();

const checkAuth = require("../middleware/check-auth");

/**
 * requiring controller functions from article controller
 */
const {
  addVideoBookmark,
  getSingleVideoBookmark,
  deleteVideoBookmark,
} = require("../controllers/videobookmark");

/**validation functions */
const { validateOnSaveVideoBookmark } = require("./validation/videobookmark");

/**
 * @description   this route is used to add video to bookmark for loggedin user
 * @route   POST      /api/videobookmark/
 * @access  Private
 */
router.post("/", checkAuth, validateOnSaveVideoBookmark, addVideoBookmark);

/**
 * @description   this route is used to get bookmark status for a video for loggedin user
 * @param video - video Id
 * @route   GET      /api/videobookmark/:video
 * @access  Private
 */
router.get("/:video", checkAuth, getSingleVideoBookmark);

/**
 * @description   this route is used to delete view status by video Id
 * @param video - video Id
 * @route   DELETE      /api/videobookmark/:video
 * @access  Private
 */
router.delete("/:video", checkAuth, deleteVideoBookmark);

module.exports = router;
