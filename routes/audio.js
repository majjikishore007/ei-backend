const router = require("express").Router();
const audios = require("../config/audio-storage-setup");
const images = require("../config/cloud-storage-setup");

const checkAuthAuthorOrAdmin = require("../middleware/check-auth-authorOrAdmin");

/**
 * requiring controller functions from article controller
 */
const {
  getToptenAudios,
  uploadAudio,
  saveAudioPublisher,
  getAudiosPageWiseLimitWise,
  getAudioById,
  getAudioByTitle,
  editAudioThumbnailByAudioId,
  editAudioById,
  deleteAudioById,
  getAudiosByPublisherId,
  getNoOfAudioForPublisherId,
  getAudiosByCategoryFilter,
  getAudiosByPublisherIdAndCategory,
  getCountOfTotalAudios,
} = require("../controllers/audio");

/**
 * @description   this route is used to save audio by publisher
 * @validation validation fo required fields need to be done in frontend
 * @route   POST      /api/audio/
 * @access  Private
 */
router.post(
  "/",
  checkAuthAuthorOrAdmin,
  images.multer.single("thumbnail"),
  images.sendUploadToGCS,
  saveAudioPublisher
);

/**
 * @description   this route is used to upload an audio to google cloud by publisher
 * @route   POST      /api/audio/uploadAudio
 * @access  Private
 */
router.post(
  "/uploadAudio",
  checkAuthAuthorOrAdmin,
  audios.sendUploadToGCS,
  uploadAudio
);

/**
 * @description   this route is used to update an audio by audioId
 * @route   PATCH      /api/audio/:audioId
 * @access  Private
 */
router.patch("/:audioId", checkAuthAuthorOrAdmin, editAudioById);

/**
 * @description   this route is used to update an audio by audioId
 * @route   PATCH      /api/audio/:audioId
 * @access  Private
 */
router.patch(
  "/editThumbnail/:audioId",
  checkAuthAuthorOrAdmin,
  images.multer.single("thumbnail"),
  images.sendUploadToGCS,
  editAudioThumbnailByAudioId
);

/**
 * @description   this route is used to delete an audio by audioId
 * @route   DELETE      /api/audio/:audioId
 * @access  Private
 */
router.delete("/:audioId", checkAuthAuthorOrAdmin, deleteAudioById);

/**
 * @description   this route is used to get top 10 audios
 * @route   GET      /api/audio/topten
 * @access  Public
 */
router.get("/topten", getToptenAudios);

/**
 * @description   this route is used to get an audio by audioId
 * @route   POST      /api/audio/:audioId
 * @access  Public
 */
router.get("/:audioId", getAudioById);

/**
 * @description   this route is used to get an audio by title
 * @route   POST      /api/audio/audio/:title
 * @access  Public
 */
router.get("/audio/:title", getAudioByTitle);

/**
 * @description   this route is used to get number of audios by publisherId
 * @route   GET      /api/audio/noOfAudioForPublisher/:publisherId
 * @access  Public
 */
router.get("/noOfAudioForPublisher/:publisherId", getNoOfAudioForPublisherId);

/**
 * @description   this route is used to get list of audios by category filter
 * @route   GET      /api/audio/category/:categorySearch
 * @access  Public
 */
router.get("/category/:categorySearch", getAudiosByCategoryFilter);

/**
 * @description   this route is used to get list of audios by with given publisher and given category
 * @route   GET      /api/audio/publisher/:publisherId/category/:categorySearch
 * @access  Public
 */
router.get(
  "/publisher/:publisherId/category/:categorySearch",
  getAudiosByPublisherIdAndCategory
);

/**
 * @description   this route is used to get audios limitwise and paginationwise
 * @route   GET      /api/audio/page/:page/limit/:limit
 * @access  Public
 */
router.get("/page/:page/limit/:limit", getAudiosPageWiseLimitWise);

/**
 * @description   this route is used to get list of audios paginationwise by publisherId
 * @route   GET      /api/audio/publisher/:publisherId
 * @access  Public
 */
router.get("/publisher/:publisherId/:page/:limit", getAudiosByPublisherId);

/**
 * @description   this route is used to get count of  all articles
 * @route   GET      /api/audio/count/audio
 * @access  Public
 */
router.get("/count/audio", getCountOfTotalAudios);

module.exports = router;
