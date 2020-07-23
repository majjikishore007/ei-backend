const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller functions for user notification */
const {
  getAllUserNotifications,
  getAllUserNotificationsForUserIdPagination,
  getUnseenUserNotificationsForUserIdPagination,
  getUnreadUserNotificationsForUserIdPagination,
  updateNotificationById,
} = require("../controllers/usernotification");

/**
 * @description   this route is used to usernotifications
 * @route   GET      /api/usernotification
 * @access  Public
 */
router.get("/", getAllUserNotifications);

/**
 * @description   this route is used to get notification with followed publishers
 * @route   GET     /api/usernotification/all/:page/:limit
 * @access  Public
 */
router.get(
  "/all/:page/:limit",
  checkAuth,
  getAllUserNotificationsForUserIdPagination
);

/**
 * @description   this route is used to get unseen notification with followed publishers
 * @route   GET      /api/usernotification/unseen/:page/:limit
 * @access  Public
 */
router.get(
  "/unseen/:page/:limit",
  checkAuth,
  getUnseenUserNotificationsForUserIdPagination
);

/**
 * @description   this route is used to get unread notification with pagination
 * @route   GET      /api/usernotification/unread/:page/:limit
 * @access  Public
 */
router.get(
  "/unread/:page/:limit",
  checkAuth,
  getUnreadUserNotificationsForUserIdPagination
);

/**
 * @description   this route is used to update notification by id
 * @route   PATCH      /api/usernotification/:id
 * @access  Public
 */
router.patch("/:id", checkAuth, updateNotificationById);

module.exports = router;
