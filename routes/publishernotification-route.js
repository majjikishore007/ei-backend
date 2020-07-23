const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller functions for publisher notification */
const {
  getAllPublisherNotifications,
  getAllPublisherNotificationsForUserIdPagination,
  getUnseenPublisherNotificationsForUserIdPagination,
  getUnreadPublisherNotificationsForUserIdPagination,
  updatePublisherNotificationById,
} = require("../controllers/publishernotification");

/**
 * @description   this route is used to get all publisher notifications
 * @route   GET      /api/publishernotification
 * @access  Public
 */
router.get("/", getAllPublisherNotifications);

/**
 * @description   this route is used to get all notification of loggedin user as publisher with pagination
 * @param userId
 * @route   GET      /api/publishernotification/all/:page/:limit
 * @access  Private
 */
router.get(
  "/all/:page/:limit",
  checkAuth,
  getAllPublisherNotificationsForUserIdPagination
);

/**
 * @description   this route is used to get all unseen notification of loggedin user as publisher
 * @param userId
 * @route   GET      /api/publishernotification/unseen/:page/:limit
 * @access  Private
 */
router.get(
  "/unseen/:page/:limit",
  checkAuth,
  getUnseenPublisherNotificationsForUserIdPagination
);

/**
 * @description   this route is used to get all unread notification of loggedin user as publisher
 * @param userId
 * @route   GET      /api/publishernotification/unread/:page/:limit
 * @access  Private
 */
router.get(
  "/unread/:page/:limit",
  checkAuth,
  getUnreadPublisherNotificationsForUserIdPagination
);

/**
 * @description   this route is used to update notification by Id
 * @param id
 * @route   PUT      /api/publishernotification/:id
 * @access  Private
 */
router.patch("/:id", checkAuth, updatePublisherNotificationById);

module.exports = router;
