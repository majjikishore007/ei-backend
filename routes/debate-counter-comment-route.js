const router = require("express").Router();
const authCheck = require("../middleware/check-auth");

/**controller functions */
const {
  getCounterCommentWithparentComment,
  addCounterComment,
  updateDebateCounterCommentById,
  deleteCommentById,
} = require("../controllers/debatecountercomment");

router.get("/", (req, res) => {
  res.json("get All commnets");
});

/**
 * @description   this route is used to get debate counter comment
 * @route   GET      /api/debateCounterComment/parentComment/:id/page/:page/limit/:limit
 * @access  Public
 */
router.get(
  "/parentComment/:id/page/:page/limit/:limit",
  getCounterCommentWithparentComment
);

/**
 * @description   this route is used to add counter comment
 * @route   POST      /api/debateCounterComment
 * @access  Private
 */
router.post("/", authCheck, addCounterComment);

/**
 * @description   this route is used to update debateCounterComment by Id
 * @param id - debate counter comment id
 * @route   PATCH      /api/debateCounterComment/:id
 * @access  Private
 */
router.patch("/:id", authCheck, updateDebateCounterCommentById);

/**
 * @description   this route is used to delete counter comment to debate
 * @route   POST      /api/debateCounterComment/:id
 * @access  Private
 */
router.delete("/:id", authCheck, deleteCommentById);

module.exports = router;
