const router = require("express").Router();
const BookMark = require("../models/bookmark");
const Publisher = require("../models/publisher");
const checkAuth = require("../middleware/check-auth");

/**controller functions for bookmark */
const {
  addBookmark,
  getBookmarks,
  getBookmarksPagination,
  getBookmarkById,
  deleteBookmarkById,
} = require("../controllers/bookmark");

/**validation function for bookmark */
const { validationOnAddbookmark } = require("./validation/bookmark");

/**
 * @description   this route is used to add a bookmark for an article
 * @route   POST      /api/bookmark/
 * @access  Private
 */
router.post("/", checkAuth, validationOnAddbookmark, addBookmark);

/**
 * @description   this route is used to get all bookmarks for loggedin user
 * @route   GET      /api/bookmark/
 * @access  Private
 */
router.get("/", checkAuth, getBookmarks);

/**
 * @description   this route is used to get all bookmarks paginationwise  for loggedin user
 * @route   GET      /api/bookmark/page/:page/limit/:limit
 * @access  Private
 */
router.get("/page/:page/limit/:limit", checkAuth, getBookmarksPagination);

router.get("/update/update", (req, res) => {
  BookMark.find()
    .exec()
    .then((result) => {
      for (var i = 0; i < result.length; i++) {
        BookMark.findByIdAndUpdate(result[i]._id, {
          $set: { paid: !result[i].paid },
        })
          .exec()
          .then((rrr) => {
            console.log(rrr);
          });
      }
      res.json(result);
    });
});

/**
 * @description   this route is used to get bookmark by articleId
 * @param articleId - article Id for which bookmark fetched
 * @route   GET      /api/bookmark/:articleId
 * @access  Private
 */
router.get("/:articleId", checkAuth, getBookmarkById);

/**
 * @description   this route is used to delete bookmark by articleId
 * @param articleId - article Id for which bookmark deleted
 * @route   DELETE      /api/bookmark/:articleId
 * @access  Private
 */
router.delete("/:articleId", checkAuth, deleteBookmarkById);

module.exports = router;
