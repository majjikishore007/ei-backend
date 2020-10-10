const router = require("express").Router();

const checkAuthAdmin = require("../middleware/check-auth-admin");

/**controller functions */
const {
  getAllCuratorApplicationPagination,
  ApplyForCurator
} = require("../controllers/curatorapplication");


/**
 * @description   this route is used to get all comments
 * @route   POST      /api/curator-application/page/:page/limit/:limit
 * @access  Public
 */
router.get("/page/:page/limit/:limit",checkAuthAdmin, getAllCuratorApplicationPagination);

/**
 * @description   this route is used to post a comment
 * @route   POST      /api/curator-application/
 * @access  Private
 */
router.post("/", ApplyForCurator);


module.exports = router;
