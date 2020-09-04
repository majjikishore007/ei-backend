const router = require("express").Router();

const images = require("../config/cloud-storage-setup");
const checkAuth = require("../middleware/check-auth");

/**controller function for publisher route */
const {
  getPublishers,
  createNewPublisher,
  getPublisherById,
  getPublisherByUrlStr,
  getPublisherByUserId,
  updatePublisherById,
  deletePublisherById,
  updatePublisherLogo,
  getPublisherByAggregate,
  getPublisherByAggregatePagination,
} = require("../controllers/publisher");

/**validation */
const { validateCreatePublisher } = require("./validation/publisher");

/**
 * @description   this route is used to get all publishers
 * @route   GET      /api/publisher
 * @access  Public
 */
router.get("/", getPublishers);

/**
 * @description   this route is used to add a new publisher
 * @route   POST      /api/publisher
 * @access  Private
 */
router.post(
  "/",
  checkAuth,
  images.multer.single("logo"),
  images.sendUploadToGCS,
  validateCreatePublisher,
  createNewPublisher
);

/**
 * @description   this route is used to get publisher by its Id
 * @param id - publisherId
 * @route   GET      /api/publisher/:id
 * @access  Public
 */
router.get("/:id", getPublisherById);

/**
 * @description   this route is used to get publisher by urlstr
 * @param urlStr
 * @route   GET      /api/publisher/title/:urlStr
 * @access  Public
 */
router.get("/title/:urlStr", getPublisherByUrlStr);

/**
 * @description   this route is used to get publishers by loggedin user
 * @route   GET      /api/publisher/user/publisher
 * @access  Private
 */
router.get("/user/publisher", checkAuth, getPublisherByUserId);

/**
 * @description   this route is used to update publisher by its Id
 * @param id
 * @route   PATCH      /api/publisher/:id
 * @access  Private
 */
router.patch("/:id", checkAuth, updatePublisherById);

/**
 * @description   this route is used to delete publisher by its Id
 * @param id
 * @route   DELETE      /api/publisher/:id
 * @access  Private
 */
router.delete("/:id", checkAuth, deletePublisherById);

/**
 * @description   this route is used to change logo of publisher by its Id
 * @param id - publisherId
 * @route   PATCH      /api/publisher/:id
 * @access  Private
 */
router.patch(
  "/changelogo/:id",
  checkAuth,
  images.multer.single("logo"),
  images.sendUploadToGCS,
  updatePublisherLogo
);

/**
 * @description   this route is used to get all publishers logo of publisher by its Id
 * @param id - publisherId
 * @route   GET      /api/publisher/fullDetails/publishersInfoWithArticleCount
 * @access  Public
 */
router.get(
  "/fullDetails/publishersInfoWithArticleCount",
  getPublisherByAggregate
);

/**
 * @description   this route is used to get all publishers logo of publisher by its Id with pagination
 * @param id - publisherId
 * @route   GET      /api/publisher/fullDetails/publishersInfoWithArticleCount
 * @access  Public
 */
router.get(
  "/fullDetails/publishersInfoWithArticleCount/page/:page/limit/:limit",
  checkAuth,
  getPublisherByAggregatePagination
);

module.exports = router;
