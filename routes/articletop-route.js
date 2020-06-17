const router = require("express").Router();
const ArticleTop = require("../models/article-top");
const Rating = require("../models/rating");
const images = require("../config/cloud-storage-setup");
const Usernotification = require("../models/usernotification");

/**requiring articletop controller functions */
const {
  getAllArticleTop,
  getAllArticleTopForMobile,
  saveArticleTop,
  deleteArticleTopWithId,
} = require("../controllers/articletop");

const { validateOnSaveArticleTop } = require("./validation/articletop");

/**
 * @description   this route is used to get all article tops
 * @route   GET      /api/articletop/
 * @access  Public
 */
router.get("/", getAllArticleTop);

/**
 * @description   this route is used to get all article tops for mobile
 * @route   GET      /api/articletop/mobile
 * @access  Public
 */
router.get("/mobile", getAllArticleTopForMobile);

/**
 * @description   this route is used to save article top with given article
 * @route   GET      /api/articletop/
 * @access  Public
 */
router.post("/", validateOnSaveArticleTop, saveArticleTop);

/**
 * @description   this route is used to delete articleTop with Id
 * @route   GET      /api/articletop/:articletopId
 * @access  Public
 */
router.delete("/:articletopId", deleteArticleTopWithId);

module.exports = router;
