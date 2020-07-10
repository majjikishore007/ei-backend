const router = require("express").Router();

const checkAuthAdmin = require("../middleware/check-auth-admin");

/**
 * requiring controller functions from article controller
 */
const {
  saveVideoTop,
  getAllVideoTops,
  deleteVideoTop,
} = require("../controllers/videotop");

/**
 * @description   this route is used to make a video display top
 * @route   POST      /api/videotop/
 * @access  Private
 */
router.post("/", checkAuthAdmin, saveVideoTop);

/**
 * @description   this route is used to get all displayed top videos
 * @param video - video Id
 * @route   GET      /api/videotop/:video
 * @access  Private
 */
router.get("/", checkAuthAdmin, getAllVideoTops);

/**
 * @description   this route is used to delete video display top
 * @param video - video Id
 * @route   DELETE      /api/videotop/:video
 * @access  Private
 */
router.delete("/:video", checkAuthAdmin, deleteVideoTop);

module.exports = router;
