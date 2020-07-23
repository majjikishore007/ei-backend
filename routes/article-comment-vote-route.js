const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

const { voteForArticleComment } = require("../controllers/articlecommentvote");

/**
 * @description   this route is used to add articleComment vote(upvote / downvote)
 * @route   POST      /api/articleCommentVote
 * @access  Private
 */
router.post("/", checkAuth, voteForArticleComment);

module.exports = router;
