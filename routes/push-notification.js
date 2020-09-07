const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller function */
const {
  getAllPushNotificationPagination,
  getAllUnReadPushNotificationPagination,
  getAllUnSeenPushNotificationPagination,
  updatePushNotificationById,
  deletePushNotificationById,
} = require("../controllers/pushnotification");

/**
 * @description   this route is used to get all push notification
 * @route   GET      /api/pushnotification/all/page/:page/limit/:limit
 * @access  Public
 */
router.get(
  "/all/page/:page/limit/:limit",
  checkAuth,
  getAllPushNotificationPagination
);

/**
 * @description   this route is used to get all unread pushnotifications
 * @route   GET      /api/pushnotification/unread/page/:page/limit/:limit
 * @access  Private
 */
router.get(
  "/unread/page/:page/limit/:limit",
  checkAuth,
  getAllUnReadPushNotificationPagination
);

/**
 * @description   this route is used to get all unseen notification
 * @route   GET      /api/pushnotification/unseen/page/:page/limit/:limit
 * @access  Private
 */
router.get(
  "/unseen/page/:page/limit/:limit",
  checkAuth,
  getAllUnSeenPushNotificationPagination
);

/**
 * @description   this route is used to update push notification
 * @route   patch      /api/pushnotification/:id
 * @access  Private
 */
router.patch("/:id", checkAuth, updatePushNotificationById);

/**
 * @description   this route is used to delete push notification
 * @route   DELETE      /api/pushnotification/:id
 * @access  Private
 */
router.delete("/:id", checkAuth, deletePushNotificationById);

module.exports = router;
