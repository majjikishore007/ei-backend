const router = require("express").Router();
const Topic = require("../models/topic");
const authCheck = require("../middleware/check-auth");
const Article = require("../models/article");
const images = require("../config/cloud-storage-setup");
const {
  getAllTopics,
  getTopicDetailsById,
  addNewTopic,
  updateTopicById,
  deleteTopicById,
} = require("../controllers/topic");

/**
 * @description   this route is used to get all topics
 * @route   GET      /api/topic
 * @access  Public
 */
router.get("/", getAllTopics);

/**
 * @description   this route is used to get topic detail by id
 * @param id
 * @route   GET      /api/topic/:id
 * @access  Public
 */
router.get("/:id", getTopicDetailsById);

/**
 * @description   this route is used to add new topic
 * @route   POST      /api/topic
 * @access  Private
 */
router.post(
  "/",
  authCheck,
  images.multer.single("cover"),
  images.sendUploadToGCS,
  addNewTopic
);

/**
 * @description   this route is used to update topic by id
 * @route   PATCH      /api/topic/:id
 * @access  Public
 */
router.patch("/:id", authCheck, updateTopicById);

/**
 * @description   this route is used to delete a topic by id
 * @route   DELETE      /api/topic/:id
 * @access  Public
 */
router.delete("/:id", authCheck, deleteTopicById);

module.exports = router;
