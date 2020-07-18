const router = require("express").Router();
const RssFeedStructure = require("../models/rss-feed-structure");

/**controller functions for rss feeds */
const {
  getAllRssFeedStructures,
  getSingleRssFeedStructure,
  getSingleRssFeedStructureWithPublisherId,
  AddRssFeedStructure,
  updateRssFeedStructureWithId,
  deleteRssFeedStructureWithId,
} = require("../controllers/rssfeedstructure");

/**validation files */
const { validateRssStructure } = require("./validation/validateRssStructure");

/**
 * @desc    GET all Rss feed structure list
 * @route   Get /api/rssfeedstructure
 * @access  Public
 */
router.get("/", getAllRssFeedStructures);

/**
 * @desc    GET Single rss feed structure with its id
 * @route   Get /api/rssfeedstructure/:id
 * @access  Public
 */
router.get("/:id", getSingleRssFeedStructure);

/**
 * @desc   GET single rss feed structure for a particular publisher with publisherId
 * @route  Get /api/rssfeedstructure/publisher/:publisherId
 * @access Public
 */
router.get("/publisher/:publisherId", getSingleRssFeedStructureWithPublisherId);

/**
 * @desc POST inserting a specific format of rss feed for a specific publisherId
 * @route Post /api/rssfeedstructure
 * @access Private
 */
/**access should be private */

router.post("/", AddRssFeedStructure);

/**
 * @desc    PATCH updating rss structure for a specific id
 * @route   Patch /api/rssfeedstructure/:id   (using patch instead of put because don't want to mention every field while updating)
 * @access Private
 */
router.patch("/:id", updateRssFeedStructureWithId);

/**
 * @desc   DELETE delete a rss structure with its Id
 * @route  Delete  /api/rssfeedstructure/:id
 * @access Private
 */

router.delete("/:id", deleteRssFeedStructureWithId);

module.exports = router;
