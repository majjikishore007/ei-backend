const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

const {
  voteForArticleComment,
  getarticlecommentvote,
  getarticlecommentvotecount,
  getAllVotesForArticleComment,
} = require("../controllers/articlecommentvote");

/**
 * @description   this route is used to add articleComment vote(upvote / downvote)
 * @route   POST      /api/articleCommentVote
 * @access  Private
 */
router.post("/", checkAuth, voteForArticleComment);


/**
 * @description   this route is used to get articleComment vote(upvote / downvote)
 * @route   get      /api/articleCommentVote/:commentid/:articleid
 * @access  Public
 */
router.get("/getvote/:commentid/:articleid",  getarticlecommentvote);

/**
 * @description   this route is used to get count of articleComment vote(upvote / downvote)
 * @route   get      /api/getvotecount/:commentid/:articleid
 * @access  Public
 */
router.get("/getnoofvotes/:commentid/:articleid",  getarticlecommentvotecount);

/**
 * @description   this route is used to get articleComment votes for comment
 * @route   POST      /api/articleCommentVote/page/:page/limit/:limit/:comment/:vote
 * @access  Public
 */
router.get(
  "/page/:page/limit/:limit/:comment/:vote",
  getAllVotesForArticleComment
);



module.exports = router;
