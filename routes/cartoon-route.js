const router = require("express").Router();
const Cartoon = require("../models/cartoon");
const images = require("../config/cloud-storage-setup");
const checkAuthAuthorOrAdmin = require("../middleware/check-auth-authorOrAdmin");

/**controller fuctons for cartoons */
const {
  getInitialcartoons,
  getCartoonById,
  saveCartoon,
  editCartoonById,
  editCartoonCoverById,
  deleteCartoonById,
  getNextbatchCartoons,
} = require("../controllers/cartoon");

/**validation function */
const { validateOnSavecartoon } = require("./validation/cartoon");

/**
 * @description   this route is used to add new cartoon by admin or author/publisher
 * @route   POST      /api/cartoon/
 * @access  Private
 */
router.post(
  "/",
  checkAuthAuthorOrAdmin,
  images.multer.single("cover"),
  images.sendUploadToGCS,
  validateOnSavecartoon,
  saveCartoon
);

/**
 * @description   this route is used to get cartoon with cartoonId
 * @param cartoonId
 * @route   GET      /api/cartoon/:cartoonId
 * @access  Public
 */
router.get("/:cartoonId", getCartoonById);

/**
 * @description   this route is used to update cartoon with cartoonId
 * @param cartoonId
 * @route   PATCH      /api/cartoon/:cartoonId
 * @access  Private
 */
router.patch("/:cartoonId", checkAuthAuthorOrAdmin, editCartoonById);

/**
 * @description   this route is used to update cartoon cover image with cartoonId
 * @param cartoonId
 * @route   PATCH      /api/cartoon/image/:cartoonId
 * @access  Private
 */
router.patch(
  "/image/:cartoonId",
  checkAuthAuthorOrAdmin,
  images.multer.single("cover"),
  images.sendUploadToGCS,
  editCartoonCoverById
);

/**
 * @description   this route is used to delete cartoon with cartoonId
 * @param cartoonId
 * @route   DELETE      /api/cartoon/:cartoonId
 * @access  Private
 */
router.delete("/:cartoonId", checkAuthAuthorOrAdmin, deleteCartoonById);

/**
 * @description   this route is used to get all cartoons
 * @route   POST      /api/cartoon/
 * @access  Public
 */
router.get("/getInital/:limitCount", getInitialcartoons);

/**
 * @description   this route is used to get next batch limited cartoons with last fetched cartoonId
 * @param lastCartoonId
 * @route   GET      /api/cartoon/nextbatch/:lastCartoonId
 * @access  Public
 */
router.get("/nextbatch/:limitCount/:lastCartoonId", getNextbatchCartoons);

module.exports = router;
