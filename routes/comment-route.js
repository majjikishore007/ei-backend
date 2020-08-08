const router = require("express").Router();

const checkAuth = require("../middleware/check-auth");

/**controller functions */
const {
  getAllComments,
  saveComment,
  getCommentsByUrlStr,
  getCommentsByUserId,
  deleteCommentById,
  updateCommentById,
  getCommentsInAggregateByArticles,
  getCommentsByArticleId,
} = require("../controllers/comment");

/**validation function */
const { validateOnCommentSave } = require("./validation/comment");

/**
 * @description   this route is used to get all comments
 * @route   POST      /api/comment/
 * @access  Public
 */
router.get("/", getAllComments);

/**
 * @description   this route is used to post a comment
 * @route   POST      /api/comment/
 * @access  Private
 */
router.post("/", checkAuth, validateOnCommentSave, saveComment);

/**
 * @description   this route is used to update blogComment by Id
 * @route   PATCH      /api/comment/:id
 * @access  Private
 */
router.patch("/:id", checkAuth, updateCommentById);

/**
 * @description   this route is used to get a comment by article urlstr
 * @param urlStr - urlstr of the article
 * @route   GET      /api/comment/:urlStr
 * @access  Public
 */
router.get("/:urlStr", getCommentsByUrlStr);

/**
 * @description   this route is used to get a comment by userId
 * @param userId
 * @route   GET      /api/comment/user/userId
 * @access  Public
 */
router.get("/user/:userId", getCommentsByUserId);

/**
 * @description   this route is used to delete a comment by its id
 * @param id
 * @route   DELETE      /api/comment/:id
 * @access  Private
 */
router.delete("/:id", checkAuth, deleteCommentById);

/**
 * @description   this route is used to get all comments with grouped by article
 * @route   GET      /api/comment/aggregate/all
 * @access  Public
 */
router.get("/aggregate/all", getCommentsInAggregateByArticles);

/*
router.get("/article/:id", (req, res) => {
  const articleId = req.params.id;

  Comment.countDocuments({ article: articleId })
    .exec()
    .then((count) => {
      res.json({ success: true, count: count });
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});
*/

/**
 * @description   this route is used to get a comment by its articleId
 * @param articleId
 * @route   GET      /api/comment/article/:articleId/page:page/limit/:limit
 * @access  Public
 */
router.get(
  "/article/:articleId/page/:page/limit/:limit",
  getCommentsByArticleId
);
module.exports = router;
