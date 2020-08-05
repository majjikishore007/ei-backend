const router = require("express").Router();

const checkAuth = require("../middleware/check-auth");

/**controller function for publisher route */
const {
  addSubscriber,
  getNewsletterSubscribersPaginationwise,
} = require("../controllers/newslettersubscriber");

/**
 * @description   this route is used to get all newsletter subscriber email
 * @route   GET      /api/newslettersubscribe/page/:page/limit/:limit
 * @access  Public
 */
router.get("/page/:page/limit/:limit", getNewsletterSubscribersPaginationwise);

/**
 * @description   this route is used to add a new publisher
 * @route   POST      /api/newslettersubscribe
 * @access  Private
 */
router.post("/", addSubscriber);

module.exports = router;
