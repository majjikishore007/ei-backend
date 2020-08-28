const router = require("express").Router();
const authCheck = require("../middleware/check-auth");

/**controller files */
const {
  getBlogCommentWithId,
  addBlogComment,
  updateBlogCommentById,
  deleteBlogComment,
  getBlogCommentsForBlogId,
  getAllCommentsForBlogId,
  getBlogCommentsPagination,
  getBlogCounterCommentsPagination,
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
 * @description   this route is used to get all blogComments with counter comments and upvotes by blogId
 * @route   GET      /api/blogComment/blogAggregate/:id
 * @access  Public
 */
router.get("/blogAggregate/:id", getAllCommentsForBlogId);

/**
 * @description   this route is used to get blogComment by blogId
 * @route   GET      /api/blogComment/blog/:id/page/:page/limit/:limit
 * @access  Public
 */
router.get("/blog/:id/page/:page/limit/:limit", getBlogCommentsForBlogId);

/**test */
/**
 * @description   this route is used to get blogComment with upvotec count and loggedin user upvote status
 *  with counter comments(pagination)
 * @route   GET      /api/blogComment/blog/:id/commentPage/:commentPage/commentLimit/:commentLimit/counterCommentPage/:counterCommentPage/counterCommentLimit/:counterCommentLimit
 * @access  Public
 */
router.get(
  "/blog/:id/commentPage/:commentPage/commentLimit/:commentLimit/counterCommentPage/:counterCommentPage/counterCommentLimit/:counterCommentLimit",
  getBlogCommentsPagination
);

/**
 * @description   this route is used to get blog counter Comments(pagination)
 * @route   GET      /api/blogComment/blog/:id/comment/:id/counterCommentPage/:counterCommentPage/counterCommentLimit/:counterCommentLimit
 * @access  Public
 */
router.get(
  "/blog/:blogId/comment/:commentId/counterCommentPage/:counterCommentPage/counterCommentLimit/:counterCommentLimit",
  getBlogCounterCommentsPagination
);

module.exports = router;
