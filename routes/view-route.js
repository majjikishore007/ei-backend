const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const checkAuthAdmin = require("../middleware/check-auth-admin");
const {
  getAllViews,
  saveView,
  getViewByArticleId,
  aggregateByArticleId,
  getViewArticleByUser,
} = require("../controllers/view");

router.post("/", checkAuth, saveView);

router.get("/article/:id", getViewByArticleId);

router.get("/article-view/:id", aggregateByArticleId);

router.get("/page/:page/limit/:limit", checkAuthAdmin, getAllViews);

router.get(
  "/article-view/page/:page/limit/:limit",
  checkAuth,
  getViewArticleByUser
);

module.exports = router;
