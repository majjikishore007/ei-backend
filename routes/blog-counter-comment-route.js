const router = require("express").Router();
const authCheck = require("../middleware/check-auth");

/**controller functions */
const {
  getCounterCommentWithparentComment,
  addCounterCommentForBlog,
  deleteCommentById,
} = require("../controllers/blogcountercomment");

/**
 * @description   this route is used to get blog counter comment
 * @route   GET      /api/blogCounterComment/parentComment/:id/page/:page/limit/:limit
 * @access  Public
 */
router.get(
  "/parentComment/:id/page/:page/limit/:limit",
  getCounterCommentWithparentComment
);

/**
 * @description   this route is used to add counter comment to blog
 * @route   POST      /api/blogCounterComment
 * @access  Private
 */
router.post("/", authCheck, addCounterCommentForBlog);

/**
 * @description   this route is used to delete counter comment to blog
 * @route   POST      /api/blogCounterComment/:id
 * @access  Private
 */
router.delete("/:id", authCheck, deleteCommentById);

module.exports = router;
