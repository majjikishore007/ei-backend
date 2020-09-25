const router = require("express").Router();
const images = require("../config/cloud-storage-setup");

const checkAuthAdmin = require("../middleware/check-auth-admin");

/**
 * requiring controller functions from article controller
 */
const {
  createNewAuthorPage,
  uploadImage,
  updateInfoWithUrlStr,
  claimRequestAuthorPage,
  getAllAuthorPagePagination,
  viewClaimsAuthorPagepagination,
  verifyClaimAuthorPage,
} = require("../controllers/authorpage");
const checkAuthAuthorOrAdmin = require("../middleware/check-auth-authorOrAdmin");

/**
 * @description   this route is used to save audio by publisher
 * @access admin
 * @route   POST      /api/authorpage/
 * @access  Private
 */
router.post("/", checkAuthAdmin, createNewAuthorPage);

/**
 * @description   this route is used to save audio by publisher
 * @access author or admin
 * @route   POST      /api/authorpage/uploadImage
 * @access  Private
 */
router.post(
  "/uploadImage",
  checkAuthAuthorOrAdmin,
  images.multer.single("image"),
  images.sendUploadToGCS,
  uploadImage
);

/**
 * @description   this route is used to update author page
 * @access admin or author
 * @route   PATCH      /api/authorpage/urlStr/:urlStr
 * @access  Private
 */
router.patch("/urlStr/:urlStr", checkAuthAuthorOrAdmin, updateInfoWithUrlStr);

/**
 * @description   this route is used to update author page
 * @access admin or author
 * @route   PATCH      /api/authorpage/urlStr/:urlStr
 * @access  Private
 */
router.patch(
  "/claimPage/urlStr/:urlStr",
  checkAuthAuthorOrAdmin,
  claimRequestAuthorPage
);

/**
 * @description   this route is used to update author page
 * @access admin or author
 * @route   GET      /api/authorpage/all/page/:page/limit/:limit
 * @access  Private
 */
router.get(
  "/all/page/:page/limit/:limit",
  checkAuthAdmin,
  getAllAuthorPagePagination
);

/**
 * @description   this route is used to update author page
 * @access admin or author
 * @route   GET      /api/authorpage/all/page/:page/limit/:limit
 * @access  Private
 */
router.get(
  "/underClaim/page/:page/limit/:limit",
  checkAuthAdmin,
  viewClaimsAuthorPagepagination
);

/**
 * @description   this route is used to update author page
 * @access admin or author
 * @route   PATCH      /api/authorpage/verified/urlStr/:urlStr
 * @access  Private
 */
router.patch("/verified/urlStr/:urlStr", checkAuthAdmin, verifyClaimAuthorPage);

module.exports = router;
