const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

const { voteForBlogComment } = require("../controllers/blogcommentvote");

/**
 * @description   this route is used to add blogComment vote(upvote / downvote)
 * @route   POST      /api/blogCommentVote
 * @access  Private
 */
router.post("/", checkAuth, voteForBlogComment);

module.exports = router;
