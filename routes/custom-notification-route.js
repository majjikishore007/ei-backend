const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const checkAuthAdmin = require("../middleware/check-auth-admin");
const images = require("../config/cloud-storage-setup");

/**controller functions for custom notification */
const {
  getAllCustomNotificationsPagination,
  getAllCustomNotificationsForUserIdPagination,
  //   getUnseenCustomNotificationForUserIdPagination,
  //   getUnreadCustomNotificationForUserIdPagination,
  getSingleNotification,
  createNotification,
  uploadThumbnail,
  pushExistingNotification,
  updateNotificationById,
  deleteNotificationById,
} = require("../controllers/customnotification");

/**
 * @description   this route is used to fetch custom notification for admin
 * @route   GET      /api/customnotification/page/:page/limit/:limit
 * @access  Private
 */
router.get(
  "/page/:page/limit/:limit",
  checkAuthAdmin,
  getAllCustomNotificationsPagination
);

/**
 * @description   this route is used to fetch custom notification for loggedin user
 * @route   GET      /api/customnotification/user/page/:page/limit/:limit
 * @access  Private
 */
router.get(
  "/user/page/:page/limit/:limit",
  checkAuth,
  getAllCustomNotificationsForUserIdPagination
);

/**
 * @description   this route is used to fetch unseen custom notification for loggedin user
 * @route   GET      /api/customnotification/user/unseen/page/:page/limit/:limit
 * @access  Private
 */
// router.get("/user/unseen/page/:page/limit/:limit",checkAuth, getUnseenCustomNotificationForUserIdPagination);

/**
 * @description   this route is used to fetch unread custom notification for loggedin user
 * @route   GET      /api/customnotification/user/unread/page/:page/limit/:limit
 * @access  Private
 */
// router.get("/user/unread/page/:page/limit/:limit",checkAuth, getUnreadCustomNotificationForUserIdPagination);

/**
 * @description   this route is used to fetch unread custom notification for loggedin user
 * @route   GET      /api/customnotification/notificationId/:id
 * @access  Private
 */
router.get("/notificationId/:id", checkAuth, getSingleNotification);

/**
 * @description   this route is used to create custom notification and push that notification
 * @route   POST      /api/customnotification
 * @access admin
 * @access  Private
 */
router.post("/", checkAuthAdmin, createNotification);

/**
 * @description   this route is used to upload custom notification thumbnail
 * @route   POST      /api/customnotification/uploadThumbnail
 * @access admin
 * @access  Private
 */
router.post(
  "/uploadThumbnail",
  checkAuthAdmin,
  images.multer.single("thumbnail"),
  images.sendUploadToGCS,
  uploadThumbnail
);

/**
 * @description   this route is used to push existing custom notification
 * @route   POST      /api/customnotification/notificationId/:id
 * @access admin
 * @access  Private
 */
router.post("/notificationId/:id", checkAuthAdmin, pushExistingNotification);

/**
 * @description   this route is used to update notification by id
 * @route   PATCH      /api/customnotification/notificationId/:id
 * @access admin
 * @access  Private
 */
router.patch("/notificationId/:id", checkAuthAdmin, updateNotificationById);

/**
 * @description   this route is used to update notification by id
 * @route   DELETE      /api/customnotification/notificationId/:id
 * @access admin
 * @access  Private
 */
router.delete("/notificationId/:id", checkAuthAdmin, deleteNotificationById);

module.exports = router;
