const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

const {
  voteForComment,
  getAllVotesForDebateComment,
} = require("../controllers/debatecommentvote");

router.get("/", (req, res) => {
  res.json("need to do this");
});

/**
 * @description   this route is used to add debateComment vote(upvote / downvote)
 * @route   POST      /api/debateCommentVote
 * @access  Private
 */
router.post("/", checkAuth, voteForComment);

/**
 * @description   this route is used to get votes for comment
 * @route   POST      /api/debateCommentVote/page/:page/limit/:limit/:comment/:vote
 * @access  Public
 */
router.get(
  "/page/:page/limit/:limit/:comment/:vote",
  getAllVotesForDebateComment
);

router.get("/comment/:id", (req, res) => {});

module.exports = router;
