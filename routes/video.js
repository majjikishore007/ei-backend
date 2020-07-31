const router = require("express").Router();
const videos = require("../config/video-storage-setup");
const images = require("../config/cloud-storage-setup");

const checkAuthAuthorOrAdmin = require("../middleware/check-auth-authorOrAdmin");

/**
 * requiring controller functions from article controller
 */
const {
  getToptenVideos,
  uploadVideo,
  uploadVideoThumbnail,
  saveVideoPublisher,
  getVideosPageWiseLimitWise,
  getVideoById,
  getVideoByTitle,
  editVideoThumbnailByVideoId,
  editVideoById,
  deleteVideoById,
  getVideosByPublisherId,
  getNoOfVideoForPublisherId,
  getVideosByCategoryFilter,
  getVideosByPublisherIdAndCategory,
  getCountOfTotalVideos,
} = require("../controllers/video");

/**
 * @description   this route is used to save video by publisher
 * @validation validation fo required fields need to be done in frontend
 * @route   POST      /api/video/
 * @access  Private
 */
router.post("/", checkAuthAuthorOrAdmin, saveVideoPublisher);

/**
 * @description   this route is used to upload an video to google cloud by publisher
 * @route   POST      /api/video/uploadVideo
 * @access  Private
 */
router.post(
  "/uploadVideo",
  checkAuthAuthorOrAdmin,
  videos.sendUploadToGCS,
  uploadVideo
);

/**
 * @description   this route is used to upload an video to google cloud by publisher
 * @route   POST      /api/video/video/thumbnail
 * @access  Private
 */
router.post(
  "/video/thumbnail",
  checkAuthAuthorOrAdmin,
  images.multer.single("thumbnail"),
  images.sendUploadToGCS,
  uploadVideoThumbnail
);

/**
 * @description   this route is used to update an video by videoId
 * @route   PATCH      /api/video/:videoId
 * @access  Private
 */
router.patch("/:videoId", checkAuthAuthorOrAdmin, editVideoById);

/**
 * @description   this route is used to update an video by videoId
 * @route   PATCH      /api/video/:videoId
 * @access  Private
 */
router.patch(
  "/editThumbnail/:videoId",
  checkAuthAuthorOrAdmin,
  images.multer.single("thumbnail"),
  images.sendUploadToGCS,
  editVideoThumbnailByVideoId
);

/**
 * @description   this route is used to delete an video by videoId
 * @route   DELETE      /api/video/:videoId
 * @access  Private
 */
router.delete("/:videoId", checkAuthAuthorOrAdmin, deleteVideoById);

/**
 * @description   this route is used to get top 10 videos
 * @route   GET      /api/video/topten
 * @access  Public
 */
router.get("/topten", getToptenVideos);

/**
 * @description   this route is used to get an video by videoId
 * @route   POST      /api/video/:videoId
 * @access  Public
 */
router.get("/:videoId", getVideoById);

/**
 * @description   this route is used to get an video by title
 * @route   POST      /api/video/video/:title
 * @access  Public
 */
router.get("/video/:title", getVideoByTitle);

/**
 * @description   this route is used to get number of articles by publisherId
 * @route   GET      /api/video/noOfVideoForPublisher/:publisherId
 * @access  Public
 */
router.get("/noOfVideoForPublisher/:publisherId", getNoOfVideoForPublisherId);

/**
 * @description   this route is used to get list of articles by category filter
 * @route   GET      /api/video/category/:categorySearch
 * @access  Public
 */
router.get("/category/:categorySearch", getVideosByCategoryFilter);

/**
 * @description   this route is used to get list of articles by with given publisher and given category
 * @route   GET      /api/article/publisher/:publisherId/category/:categorySearch
 * @access  Public
 */
router.get(
  "/publisher/:publisherId/category/:categorySearch",
  getVideosByPublisherIdAndCategory
);

/**
 * @description   this route is used to get videos limitwise and paginationwise
 * @route   GET      /api/video/page/:page/limit/:limit
 * @access  Public
 */
router.get("/page/:page/limit/:limit", getVideosPageWiseLimitWise);

/**
 * @description   this route is used to get list of videos paginationwise by publisherId
 * @route   GET      /api/video/publisher/:publisherId/:page/:limit
 * @access  Public
 */
router.get("/publisher/:publisherId/:page/:limit", getVideosByPublisherId);

/**
 * @description   this route is used to get count of  all articles
 * @route   GET      /api/video/count/video
 * @access  Public
 */
router.get("/count/video", getCountOfTotalVideos);

module.exports = router;
