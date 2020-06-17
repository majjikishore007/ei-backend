const router = require("express").Router();

/**requiring articleview controller functions */
const {
  getAllArticleViews,
  getArticleViewByArticleId,
  getArticleViewByUserId,
  saveArticleView,
} = require("../controllers/articleview");

/**validation function for articleview */
const { validateOnSaveOfArticleView } = require("./validation/articleview");

/**
 * @description   this route is used to get all articleViews
 * @route   GET      /api/view/
 * @access  Public
 */
router.get("/", getAllArticleViews);

/**
 * @description   this route is used to get articleViews with articleId
 * @route   GET      /api/view/byarticle/:articleId
 * @access  Public
 */
router.get("/byarticle/:articleId", getArticleViewByArticleId);

/**
 * @description   this route is used to get articleViews with articleId
 * @route   GET      /api/view/:userId
 * @access  Public
 */
router.get("/:userId", getArticleViewByUserId);

/**
 * @description   this route is used to add a new articleView
 * @route   POST      /api/view/
 * @access  Public
 */
router.post("/", validateOnSaveOfArticleView, saveArticleView);

module.exports = router;
