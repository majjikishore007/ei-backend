const router = require("express").Router();
const authCheck = require("../middleware/check-auth");
const images = require("../config/cloud-storage-setup");

/**controller functions */

const {
  getAllDebates,
  getDebateById,
  getDebateWithArticles,
  addNewDebate,
  updateDebate,
  updateDebateImage,
  deleteDebate,
} = require("../controllers/debate");

/**
 * @description   this route is used to get all debates
 * @route   GET      /api/debate
 * @access  Public
 */
router.get("/", getAllDebates);

/**
 * @description   this route is used to get a debate by Id
 * @param id
 * @route   GET      /api/debate/debate/:id
 * @access  Public
 */
router.get("/debate/:id", getDebateById);

/**
 * @description   this route is used to get a debate with articles list
 * @param id
 * @route   GET      /api/debate/:id
 * @access  Public
 */
router.get("/:id", getDebateWithArticles);

/**
 * @description   this route is used to post a debate
 * @route   POST      /api/debate/
 * @access  Private
 */
router.post(
  "/",
  authCheck,
  images.multer.single("cover"),
  images.sendUploadToGCS,
  addNewDebate
);

/**
 * @description   this route is used to update a debate
 * @route   PATCH      /api/debate/:id
 * @access  Private
 */
router.patch("/:id", authCheck, updateDebate);

/**
 * @description   this route is used to update a debate cover image
 * @route   PATCH      /api/debate/updateImage/:id
 * @access  Private
 */
router.patch(
  "/updateImage/:id",
  authCheck,
  images.multer.single("cover"),
  images.sendUploadToGCS,
  updateDebateImage
);

/**
 * @description   this route is used to delete a debate
 * @route   DELETE      /api/debate/:id
 * @access  Private
 */
router.delete("/:id", authCheck, deleteDebate);

module.exports = router;
