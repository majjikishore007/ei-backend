const router = require("express").Router();
const Article = require("../models/article");
const Publisher = require("../models/publisher");
const Comment = require("../models/comment");
const Publishernotification = require("../models/publishernotification");
const checkAuth = require("../middleware/check-auth");

/**controller functions for publisher notification */
const {
  getAllPublisherNotifications,
  getUnseenPublisherNotificationsForUserId,
  getAllPublisherNotificationsForUserId,
  updatePublisherNotificationById,
} = require("../controllers/publishernotification");

/**
 * @description   this route is used to get all notifications
 * @route   GET      /api/notification
 * @access  Public
 */
router.get("/", getAllPublisherNotifications);

/**
 * @description   this route is used to get all unseen notification of publisher
 * @param userId
 * @route   GET      /api/notification/unseen/:userId
 * @access  Public
 */
router.get("/unseen/:userId", getUnseenPublisherNotificationsForUserId);

/**
 * @description   this route is used to get all publishers
 * @param userId
 * @route   GET      /api/publisher/all/:userId
 * @access  Public
 */
router.get("/all/:userId", getAllPublisherNotificationsForUserId);

/**
 * @description   this route is used to update notification by Id
 * @param id
 * @route   PUT      /api/notification/:id
 * @access  Public
 */
router.put("/:id", updatePublisherNotificationById);

module.exports = router;
