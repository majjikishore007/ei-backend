const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller functions for payments */
const {
  addNotificationSubscriber,
  removeNotoficationSubscriber,
  sharedArticleNotify,
  getNotificationSubscriber
} = require("../controllers/subscribernotification");

/**
 * @description   this route is used to add notification subscribe to database with userId
 * @route   POST      /api/notification/subscribe
 * @access  Private
 */
router.post("/subscribe", checkAuth, addNotificationSubscriber);

/**
 * @description   this route is used to delete notification subscribe to database with userId and token
 * @route   DELETE      /api/notification/unsubscribe
 * @access  Private
 */
router.post("/unsubscribe", checkAuth, removeNotoficationSubscriber);

/**
 * @description   this route is used to test push notification if working or not
 * @route   GET      /api/notification/testPush
 * @access  Private
 */

router.get("/status/:token", checkAuth, getNotificationSubscriber);

/**
 * @description   this route is used to test push notification if working or not
 * @route   GET      /api/notification/testPush
 * @access  Private
 */



router.get("/testPush", addNotificationSubscriber);

/**
 * @description   this route is used to send notification after article shared by loggedin user
 * @route   GET      /api/notification/sharearticle
 * @access  Private
 */
router.post("/sharearticle/article", checkAuth, sharedArticleNotify);

module.exports = router;
