const router = require("express").Router();
const authCheck = require("../middleware/check-auth");

/**controller functions */
const {
  getCounterCommentWithparentComment,
  addCounterCommentForArticle,
} = require("../controllers/articlecountercomment");

/**
 * @description   this route is used to get article counter comment
 * @route   GET      /api/articleCounterComment/parentComment/:id
 * @access  Public
 */
router.get("/parentComment/:id", getCounterCommentWithparentComment);

/**
 * @description   this route is used to add counter comment to article
 * @route   POST      /api/articleCounterComment
 * @access  Private
 */
router.post("/", authCheck, addCounterCommentForArticle);

module.exports = router;
