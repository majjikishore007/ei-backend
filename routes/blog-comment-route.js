const router = require("express").Router();
const authCheck = require("../middleware/check-auth");

/**controller files */
const {
  getBlogCommentWithId,
  addBlogComment,
  updateBlogCommentById,
  deleteBlogComment,
  getBlogCommentsForBlogId,
} = require("../controllers/blogcomment");

/**
 * @description   this route is used to get blogComment by Id
 * @route   GET      /api/blogComment/:id
 * @access  Public
 */
router.get("/:id", getBlogCommentWithId);

/**
 * @description   this route is used to add blogComment
 * @route   POST      /api/blogComment
 * @access  Private
 */
router.post("/", authCheck, addBlogComment);

/**
 * @description   this route is used to update blogComment by Id
 * @route   PATCH      /api/blogComment/:id
 * @access  Private
 */
router.patch("/:id", authCheck, updateBlogCommentById);

/**
 * @description   this route is used to delete blogComment by Id
 * @route   DELETE      /api/blogComment/:id
 * @access  Private
 */
router.delete("/:id", authCheck, deleteBlogComment);

/**
 * @description   this route is used to get blogComment by blogId
 * @route   GET      /api/blogComment/blog/:id/page/:page/limit/:limit
 * @access  Public
 */
router.get("/blog/:id/page/:page/limit/:limit", getBlogCommentsForBlogId);

module.exports = router;
