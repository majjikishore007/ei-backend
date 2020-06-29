const router = require("express").Router();
const DebateCommentVote = require("../models/debate_comment_vote");
const checkAuth = require("../middleware/check-auth");

const { voteForComment } = require("../controllers/debatecommentvote");

router.get("/", (req, res) => {
  res.json("need to do this");
});

/**
 * @description   this route is used to add debateComment vote(upvote / downvote)
 * @route   POST      /api/debateCommentVote
 * @access  Private
 */
router.post("/", checkAuth, voteForComment);

router.get("/comment/:id", (req, res) => {});

module.exports = router;
