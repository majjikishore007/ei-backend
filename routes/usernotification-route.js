const router = require("express").Router();

/**controller functions for user notification */
const {
  getUserNotifications,
  getNotificationFollowedPublisher,
  getUnseenNotificationFollowed,
  getUnseenNotifications,
  getAllNotificationForUserId,
  updateNotificationById,
} = require("../controllers/usernotification");

/**
 * @description   this route is used to usernotifications
 * @route   GET      /usernotification
 * @access  Public
 */
router.get("/", getUserNotifications);

/**
 * @description   this route is used to get notification with followed publishers
 * @route   GET      /usernotification/followed/:userId
 * @access  Public
 */
router.get("/followed/:userId", getNotificationFollowedPublisher);

/**
 * @description   this route is used to get unseen notification with followed publishers
 * @route   GET      /usernotification/unseen/followed/:userId
 * @access  Public
 */
router.get("/unseen/followed/:userId", getUnseenNotificationFollowed);

/**
 * @description   this route is used to get unseen notification
 * @route   GET      /usernotification/unseen/:userId
 * @access  Public
 */
router.get("/unseen/:userId", getUnseenNotifications);

/**
 * @description   this route is used to get all notifications for a user
 * @route   GET      /usernotification/all/:userId
 * @access  Public
 */
router.get("/all/:userId", getAllNotificationForUserId);

/**
 * @description   this route is used to update notification by id
 * @route   PUT      /usernotification/:id
 * @access  Public
 */
router.put("/:id", updateNotificationById);

module.exports = router;
