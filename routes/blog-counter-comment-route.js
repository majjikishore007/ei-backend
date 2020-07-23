const router = require("express").Router();
const authCheck = require("../middleware/check-auth");

/**controller functions */
const {
  getCounterCommentWithparentComment,
  addCounterCommentForBlog,
} = require("../controllers/blogcountercomment");

/**
 * @description   this route is used to get blog counter comment
 * @route   GET      /api/blogCounterComment/parentComment/:id
 * @access  Public
 */
router.get("/parentComment/:id", getCounterCommentWithparentComment);

/**
 * @description   this route is used to add counter comment to blog
 * @route   POST      /api/blogCounterComment
 * @access  Private
 */
router.post("/", authCheck, addCounterCommentForBlog);

module.exports = router;
