const router = require("express").Router();
const DebateComment = require("../models/debate_comment");
const authCheck = require("../middleware/check-auth");

/**controller files */
const {
  getDebateCommentWithId,
  addDebateComment,
  updateDebateCommentById,
  deleteDebateComment,
  getDebateCommentsForDebateId,
  getDebateCommentsPagination,
  getDebateCounterCommentsPagination,
} = require("../controllers/debatecomment");

/**
 * @description   this route is used to get debateComment by Id
 * @route   GET      /api/debateComment/:id
 * @access  Public
 */
router.get("/:id", getDebateCommentWithId);

/**
 * @description   this route is used to add debateComment
 * @route   POST      /api/debateComment
 * @access  Private
 */
router.post("/", authCheck, addDebateComment);

/**
 * @description   this route is used to update debateComment by Id
 * @route   PATCH      /api/debateComment/:id
 * @access  Private
 */
router.patch("/:id", authCheck, updateDebateCommentById);

/**
 * @description   this route is used to delete debateComment by Id
 * @route   DELETE      /api/debateComment/:id
 * @access  Private
 */
router.delete("/:id", authCheck, deleteDebateComment);

/**
 * @description   this route is used to get debateComment by debateId
 * @route   GET      /api/debateComment/debate/:id/page/:page/limit/:limit
 * @access  Public
 */
router.get("/debate/:id/page/:page/limit/:limit", getDebateCommentsForDebateId);

router.patch("/vote/:num/:id", (req, res) => {
  const n = req.params.num;
  const id = req.params.id;
  if (n === 0) {
    //upvote here
    DebateComment.update({ _id: co });
  } else {
    // downvote here
  }
});

router.get("/amin/amin", (req, res) => {
  DebateComment.aggregate()
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});

/**test */
/**
 * @description   this route is used to get debateComment with upvotec count and loggedin user upvote status
 *  with counter comments(pagination)
 * @route   GET      /api/debateComment/debate/:id/commentPage/:commentPage/commentLimit/:commentLimit/counterCommentPage/:counterCommentPage/counterCommentLimit/:counterCommentLimit
 * @access  Public
 */
router.get(
  "/debate/:id/commentPage/:commentPage/commentLimit/:commentLimit/counterCommentPage/:counterCommentPage/counterCommentLimit/:counterCommentLimit",
  getDebateCommentsPagination
);

/**
 * @description   this route is used to get debate counter Comments(pagination)
 * @route   GET      /api/debateComment/debate/:id/comment/:id/counterCommentPage/:counterCommentPage/counterCommentLimit/:counterCommentLimit
 * @access  Public
 */
router.get(
  "/debate/:debateId/comment/:commentId/counterCommentPage/:counterCommentPage/counterCommentLimit/:counterCommentLimit",
  getDebateCounterCommentsPagination
);

module.exports = router;
