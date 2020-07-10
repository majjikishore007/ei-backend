const router = require("express").Router();

const checkAuth = require("../middleware/check-auth");

/**
 * requiring controller functions from article controller
 */
const {
  saveVideoViewTimeStamp,
  getSingleVideoView,
  deleteSingleVideoView,
} = require("../controllers/videoview");

/**validation functions */
const { validateOnSaveVideoView } = require("./validation/videoview");

/**
 * @description   this route is used to save/update video view timeline for loggedin user
 * @route   POST      /api/videoview/
 * @access  Private
 */
router.post("/", checkAuth, validateOnSaveVideoView, saveVideoViewTimeStamp);

/**
 * @description   this route is used to get single view upto timestamp for a video for loggedin user
 * @param video - video Id
 * @route   GET      /api/videoview/:video
 * @access  Private
 */
router.get("/:video", checkAuth, getSingleVideoView);

/**
 * @description   this route is used to delete view status by video Id
 * @param video - video Id
 * @route   DELETE      /api/videoview/:video
 * @access  Private
 */
router.delete("/:video", checkAuth, deleteSingleVideoView);

module.exports = router;
