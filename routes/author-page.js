const router = require("express").Router();
const images = require("../config/cloud-storage-setup");

const checkAuthAdmin = require("../middleware/check-auth-admin");
const checkAuth = require("../middleware/check-auth");

/**
 * requiring controller functions from article controller
 */
const {
  createNewAuthorPage,
  getArticlesByAuthorFilter,
  uploadImage,
  updateInfoWithUrlStr,
  claimRequestAuthorPage,
  getAllAuthorPagePagination,
  getSingleAuthorPage,
  viewClaimsAuthorPagepagination,
  verifyClaimAuthorPage,
  checkIfAlreadyClaimed,
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
 * @access owner of the page
 * @route   PATCH      /api/authorpage/urlStr/:urlStr
 * @access  Private
 */
router.patch("/urlStr/:urlStr", checkAuth, updateInfoWithUrlStr);

/**
 * @description   this route is used to update author page
 * @route   PATCH      /api/authorpage/claimPage/urlStr/:urlStr
 * @access  Private
 */
router.patch("/claimPage/urlStr/:urlStr", checkAuth, claimRequestAuthorPage);

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
 * @description   this route is used to get author page by urlstr
 * @access all
 * @route   GET      /api/authorpage/:urlStr
 * @access  Public
 */
router.get(
  "/:urlStr",
  
  getSingleAuthorPage
);

/**
 * @description   this route is used to get articles by author filter
 * @access all
 * @route   GET      /api/authorpage/:authorSearch
 * @access  Public
 */
router.get(
  "/:authorSearch",
 
  getArticlesByAuthorFilter,
);

/**
 * @description   this route is used to update author page
 * @access admin or author
 * @route   GET      /api/authorpage/underClaim/page/:page/limit/:limit
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

/**
 * @description   this route is used to get author page claim status
 * @route   GET      /api/authorpage/claimStatus/urlStr/:urlStr
 * @access  Private
 */
router.get("/claimStatus/urlStr/:urlStr", checkAuth, checkIfAlreadyClaimed);

module.exports = router;
