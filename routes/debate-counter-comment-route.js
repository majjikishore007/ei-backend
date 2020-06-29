const router = require("express").Router();
const authCheck = require("../middleware/check-auth");

/**controller functions */
const {
  getCounterCommentWithparentComment,
  addCounterComment,
} = require("../controllers/debatecountercomment");

router.get("/", (req, res) => {
  res.json("get All commnets");
});

/**
 * @description   this route is used to get debate counter comment
 * @route   GET      /api/debateCounterComment/parentComment/:id
 * @access  Public
 */
router.get("/parentComment/:id", getCounterCommentWithparentComment);

/**
 * @description   this route is used to add counter comment
 * @route   POST      /api/debateCounterComment
 * @access  Private
 */
router.post("/", authCheck, addCounterComment);

module.exports = router;
