const router = require("express").Router();
const authCheck = require("../middleware/check-auth");

/**controller functions */
const {
  getDebateArticleById,
  getDebateAgainstById,
  getDebateForById,
  addDebateArticle,
  deleteDebateArticle,
  getDebateWitharticleIdDebateId,
} = require("../controllers/debatearticle");

/**
 * @description   this route is used to get debateArticle by Id
 * @route   GET      /api/debateArticle/:id
 * @access  Public
 */
router.get("/:id", getDebateArticleById);

/**
 * @description   this route is used to get debatefor articles by debate Id
 * @route   GET      /api/debateArticle/debatefor/:id
 * @access  Public
 */
router.get("/debatefor/:id", getDebateForById);

/**
 * @description   this route is used to get debateagainst articles debateArticle by debate Id
 * @route   GET      /api/debateArticle/:id
 * @access  Public
 */
router.get("/debateagainst/:id", getDebateAgainstById);

/**
 * @description   this route is used to add new debate article
 * @route   POST      /api/debateArticle
 * @access  Public
 */
router.post("/", authCheck, addDebateArticle);

/**
 * @description   this route is used to get delete debateArticle by Id
 * @route   DELETE      /api/debateArticle/:id
 * @access  Public
 */
router.delete("/:id", authCheck, deleteDebateArticle);

/**
 * @description   this route is used to get debateArticle by debateId & articleId
 * @route   GET      /api/debateArticle/debate/:id1/article/:id2
 * @access  Public
 */
router.get("/debate/:id1/article/:id2", getDebateWitharticleIdDebateId);

module.exports = router;
