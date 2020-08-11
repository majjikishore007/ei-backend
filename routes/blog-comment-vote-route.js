const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

const {
  voteForBlogComment,
  getAllVotesForBlogComment,
  getblogcommentvotecount
} = require("../controllers/blogcommentvote");

/**
 * @description   this route is used to add blogComment vote(upvote / downvote)
 * @route   POST      /api/blogCommentVote
 * @access  Private
 */
router.post("/", checkAuth, voteForBlogComment);

/**
 * @description   this route is used to get votes for comment
 * @route   POST      /api/blogCommentVote/page/:page/limit/:limit/:comment/:vote
 * @access  Public
 */
router.get(
  "/page/:page/limit/:limit/:comment/:vote",
  getAllVotesForBlogComment
);
/**
 * @description   this route is used to get count of blogComment vote(upvote / downvote)
 * @route   get      /api/getvotecount/:commentid/:blogid
 * @access  Public
 */
router.get("/getnoofvotes/:commentid/:blogid",  getblogcommentvotecount);
module.exports = router;
