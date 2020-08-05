const router = require("express").Router();

const checkAuth = require("../middleware/check-auth");

/**controller function for publisher route */
const {
  getNominatedPublishersAggregate,
  addPublisher,
  getNominatedPublishersPaginationwise,
} = require("../controllers/nominatepublisher");

/**validation */
const { validateNominatePublisher } = require("./validation/nominatepublisher");

/**
 * @description   this route is used to get all nominated publisher with grouped by and with count
 * @route   GET      /api/nominatepublisher/
 * @access  Public
 */
router.get("/", getNominatedPublishersAggregate);

/**
 * @description   this route is used to get all nominated publisher list with users who nominted them
 * @route   GET      /api/nominatepublisher/page/:page/limit/:limit
 * @access  Public
 */
router.get("/page/:page/limit/:limit", getNominatedPublishersPaginationwise);

/**
 * @description   this route is used to add a new publisher
 * @route   POST      /api/nominatepublisher
 * @access  Private
 */
router.post("/", checkAuth, validateNominatePublisher, addPublisher);

module.exports = router;
