const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const {
  saveView,
  getViewByArticleId,
  aggregateByArticleId,
} = require("../controllers/view");

router.post("/", checkAuth, saveView);

router.get("/article/:id", getViewByArticleId);

router.get("/article-view/:id", aggregateByArticleId);

module.exports = router;
