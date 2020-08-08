const router = require("express").Router();
const authCheck = require("../middleware/check-auth");

/**controller functions */
const {
  getCounterCommentWithparentComment,
  addCounterCommentForArticle,
  deleteCommentById,
} = require("../controllers/articlecountercomment");

/**
 * @description   this route is used to get article counter comment
 * @route   GET      /api/articleCounterComment/parentComment/:id/page/:page/limit/:limit
 * @access  Public
 */
router.get(
  "/parentComment/:id/page/:page/limit/:limit",
  getCounterCommentWithparentComment
);

/**
 * @description   this route is used to add counter comment to article
 * @route   POST      /api/articleCounterComment
 * @access  Private
 */
router.post("/", authCheck, addCounterCommentForArticle);

/**
 * @description   this route is used to delete counter comment to article
 * @route   POST      /api/articleCounterComment/:id
 * @access  Private
 */
router.delete("/:id", authCheck, deleteCommentById);

module.exports = router;
