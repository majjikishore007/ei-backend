const router = require("express").Router();
const checkAuthAdmin = require("../middleware/check-auth-admin");

const {
  saveNewTimeline,
  editTimelineTopicDetails,
  editTimelineForDateWithTimeineTopicId,
  deleteTimelineTopic,
  deleteTimelineDate,
  getSingleTimelinedetails,
  getSingleTimelineData,
  getTimelinesForAdminPaginationWise,
  getAllTimelinesForAdminPaginationWise,
  getNextbatchArticles,
  getArticlesfromGivenDate,
  getTimelineDataPagewiseLimitwise,
} = require("../controllers/timeline");

const { validateOnsaveNewTimeline } = require("./validation/timeline");

/**api endpoints for admin management of timeline */

/**
 * @description   this route is used to add new timeline
 * @route   POST      /api/timeline/
 * @access  Private
 */
router.post("/", checkAuthAdmin,  saveNewTimeline);

/**
 * @description   this route is used to edit timeline topic info
 * @route   PATCH      /api/timeline/:timelineTopicId
 * @access  Private
 */
router.patch("/:timelineTopicId", checkAuthAdmin, editTimelineTopicDetails);

/**
 * @description   this route is used to update timeline date info
 * @route   PATCH      /api/timeline/:timelineTopicId/:date
 * @access  Private
 */
router.patch(
  "/:timelineTopicId/:date",
  checkAuthAdmin,
  editTimelineForDateWithTimeineTopicId
);

/**
 * @description   this route is used to delete a whole timeline topic and related dates
 * @route   DELETE      /api/timeline/:timelineTopicId
 * @access  Private
 */
router.delete("/:timelineTopicId", checkAuthAdmin, deleteTimelineTopic);

/**
 * @description   this route is used to delete a specific date for a timeline topic
 * @route   DELETE      /api/timeline/:timelineTopicId/:date
 * @access  Private
 */
router.delete("/:timelineTopicId/:date", checkAuthAdmin, deleteTimelineDate);

/**
 * @description   this route is used to get single timeline  details
 * @param timelineTopic - timelineTopicId
 * @route   GET      /api/timeline/:timelineTopic
 * @access  Private(admin)
 */
router.get("/:timelineTopic", checkAuthAdmin, getSingleTimelinedetails);

/**
 * @description   this route is used to get single timeline topic with timeline dates
 * @param timelineTopic - timelineTopicId
 * @route   GET      /api/timeline/admin/:timelineTopic
 * @access  Private(admin)
 */
router.get("/admin/:timelineTopic", checkAuthAdmin, getSingleTimelineData);

/**
 * @description   this route is used to get timelines with pagination from topic
 * @param page
 * @param limit
 * @route   GET      /api/timeline/admin/:page/:limit
 * @access  Private(admin)
 */
router.get(
  "/admin/:page/:limit",
  checkAuthAdmin,
  getTimelinesForAdminPaginationWise
);

/**
 * @description   this route is used to get all timelines with pagination
 * @param page
 * @param limit
 * @route   GET      /alltimeline/:page/:limit
 * @access  Private(admin)
 */
router.get(
  "/alltimeline/:page/:limit",
  checkAuthAdmin,
  getAllTimelinesForAdminPaginationWise
);


/***api endpoints for newsfeed page */

/**
 * @description   this route is used to get articles list for a timelineTopic paginationwise
 * @param articlepage
 * @param articlelimit
 * @param timelineTopic
 * @route   GET      /api/timeline/:articlepage/:articlelimit/:timelineTopic
 * @access  Private
 */
router.get("/:articlepage/:articlelimit/:timelineTopic", getNextbatchArticles);

/**
 * @description   this route is used to get timeline articles sorted by dates after a certain date
 * @route   GET      /api/timeline/articlepage/:articlelimit/:timelineTopic/:givenDate
 * @access  Private
 */
router.get(
  "/:articlepage/:articlelimit/:timelineTopic/:givenDate",
  getArticlesfromGivenDate
);

/**
 * @description   this route is used to get timelines articles  paginationwise
 * @route   GET      /api/timeline/:timelinepage/:timelinelimit/:articlepage/:articlelimit/:carouselSize
 * @access  Private
 */
router.get(
  "/:timelinepage/:timelinelimit/:articlepage/:articlelimit/:carouselSize",
  getTimelineDataPagewiseLimitwise
);

module.exports = router;