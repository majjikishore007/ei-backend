const router = require("express").Router();
const Article = require("../models/article");
const Publisher = require("../models/publisher");
const images = require("../config/cloud-storage-setup");
const Usernotification = require("../models/usernotification");
const Follow = require("../models/follow");

const checkAuthAdmin = require("../middleware/check-auth-admin");
const checkAuthAuthor = require("../middleware/check-auth-author");
const checkAuthAuthorOrAdmin = require("../middleware/check-auth-authorOrAdmin");

/**
 * requiring controller functions from article controller
 */
const {
  getInitialArticles,
  getNextArticles,
  getToptenArticles,
  getArticlesForMobile,
  uploadArticleAdmin,
  editArticleCoverAdmin,
  uploadArticlePublisher,
  editArticleCover,
  getArticleById,
  getArticleByIdForMobile,
  getArticleByTitle,
  editArticleById,
  deleteArticleById,
  getArticlesByPublisherId,
  getArticlesByPublisherIdPagination,
  getNoOfArticleForPublisherId,
  getArticlesByCategoryFilter,
  getArticlesByCategoryFilterPagination,
  getArticlesByCategoryTotal,
  getArticlesByCategoryTotalPagination,
  getArticlesByPublisherIdAndCategory,
  getArticlesByPublisherIdAndCategoryPagination,
  getArticlesByPublisherIdAndCategoryForMobile,
  getArticlesByPublisherIdAndCategoryForMobilePagination,
  getArticlesWithCommentsAndRatings,
  getCountOfTotalArticles,
} = require("../controllers/article");

/**validation functions */
const { validateOnUploadArticle } = require("./validation/article");
/**
 * @description   this route is used to get top 10 articles
 * @route   GET      /api/article/topten
 * @access  Public
 */
router.get("/topten/device/:device", getToptenArticles);

/**
 * @description   this route is used to get articles for mobile
 * @route   GET      /api/article/page/:num/limit/:limit
 * @access  Public
 */
router.get("/page/:num/limit/:limit/device/:device", getArticlesForMobile);

/**
 * @description   this route is used to upload an article by admin
 * @route   POST      /api/article/admin
 * @access  Private
 */
router.post(
  "/admin",
  checkAuthAdmin,
  validateOnUploadArticle,
  uploadArticleAdmin
);

/**
 * @description   this route is used to update an article cover image
 * @route   PATCH      /api/article/admin/:articleId
 * @access  Private
 */
router.patch(
  "/admin/:articleId",
  checkAuthAdmin,
  images.multer.single("cover"),
  images.sendUploadToGCS,
  editArticleCoverAdmin
);

/**
 * @description   this route is used to upload an article by publisher
 * @route   POST      /api/article/
 * @access  Private
 */
router.post(
  "/",
  checkAuthAuthor,
  validateOnUploadArticle,
  uploadArticlePublisher
);

/**
 * @description   this route is used to update cover image of article by publisher
 * @route   PATCH      /api/article/updateCoverImage/:articleId
 * @access  Private
 */
router.patch(
  "/updateCoverImage/:articleId",
  checkAuthAuthor,
  images.multer.single("cover"),
  images.sendUploadToGCS,

  editArticleCover
);

/**
 * @description   this route is used to get an article by articleId
 * @route   POST      /api/article/:articleId
 * @access  Public
 */
router.get("/:articleId", getArticleById);

/**
 * @description   this route is used to get an article by articleId for mobile device
 * @route   POST      /api/article/mobile/:articleId
 * @access  Public
 */
router.get("/mobile/:articleId", getArticleByIdForMobile);

/**
 * @description   this route is used to get an article by title
 * @route   POST      /api/article/article/:title
 * @access  Public
 */
router.get("/article/:title", getArticleByTitle);

/**
 * @description   this route is used to update an article by articleId
 * @route   PATCH      /api/article/:articleId
 * @access  Private
 */
router.patch("/:articleId", checkAuthAuthorOrAdmin, editArticleById);

/**
 * @description   this route is used to delete an article by articleId
 * @route   DELETE      /api/article/:articleId
 * @access  Private
 */
router.delete("/:articleId", checkAuthAuthorOrAdmin, deleteArticleById);

/**
 * @description   this route is used to get list of articles by publisherId
 * @route   GET      /api/article/publisher/:publisherId
 * @access  Public
 */
router.get("/publisher/:publisherId/device/:device", getArticlesByPublisherId);

/**
 * @description   this route is used to get list of articles by publisherId
 * @route   GET      /api/article/publisher/:publisherId/page/:page/limit/:limit
 * @access  Public
 */
router.get(
  "/publisher/:publisherId/page/:page/limit/:limit/device/:device",
  getArticlesByPublisherIdPagination
);

/**
 * @description   this route is used to get number of articles by publisherId
 * @route   GET      /api/article/noOfArticleForPublisher/:publisherId
 * @access  Public
 */
router.get(
  "/noOfArticleForPublisher/:publisherId/device/:device",
  getNoOfArticleForPublisherId
);

/* select article as category*/

/**
 * @description   this route is used to get list of articles by category filter
 * @route   GET      /api/article/category/:categorySearch
 * @access  Public
 */
router.get(
  "/category/:categorySearch/device/:device",
  getArticlesByCategoryFilter
);

/**
 * @description   this route is used to get list of articles by category filter
 * @route   GET      /api/article/category/:categorySearch/page/:page/limit/:limit
 * @access  Public
 */
router.get(
  "/category/:categorySearch/page/:page/limit/:limit/device/:device",
  getArticlesByCategoryFilterPagination
);

/**
 * @description   this route is used to get list of articles by category in total
 * @route   GET      /api/article/category-total/:category
 * @access  Public
 */
router.get(
  "/category-total/:category/device/:device",
  getArticlesByCategoryTotal
);

/**
 * @description   this route is used to get list of articles by category in total
 * @route   GET      /api/article/category-total/:category/page/:page/limit/:limit
 * @access  Public
 */
router.get(
  "/category-total/:category/page/:page/limit/:limit/device/:device",
  getArticlesByCategoryTotalPagination
);

/**
 * @description   this route is used to get list of articles by with given publisher and given category
 * @route   GET      /api/article/publisher/:publisherId/category/:categorySearch
 * @access  Public
 */
router.get(
  "/publisher/:publisherId/category/:categorySearch/device/:device",
  getArticlesByPublisherIdAndCategory
);

/**
 * @description   this route is used to get list of articles by with given publisher and given category
 * @route   GET      /api/article/publisher/:publisherId/category/:categorySearch/page/:page/limit/:limit
 * @access  Public
 */
router.get(
  "/publisher/:publisherId/category/:categorySearch/page/:page/limit/:limit/device/:device",
  getArticlesByPublisherIdAndCategoryPagination
);

/**
 * @description   this route is used to get list of articles by with given publisher and given category
 *                for mobile device
 * @route   GET      /api/article/publisher/:publisherId/category/:categorySearch
 * @access  Public
 */
router.get(
  "/mobile/publisher/:publisherId/category/:categorySearch/device/:device",
  getArticlesByPublisherIdAndCategoryForMobile
);

/**
 * @description   this route is used to get list of articles by with given publisher and given category
 *                for mobile device
 * @route   GET      /api/article/publisher/:publisherId/category/:categorySearch/page/:page/limit/:limit
 * @access  Public
 */
router.get(
  "/mobile/publisher/:publisherId/category/:categorySearch/page/:page/limit/:limit/device/:device",
  getArticlesByPublisherIdAndCategoryForMobilePagination
);

router.get("/restruture/:id", async (req, res) => {
  category = [
    "business",
    "culture",
    "education",
    "entertainment",
    "enviornment",
    "general",
    "health",
    "lostintheclutter",
    "opinion",
    "politics",
    "sports",
    "startup",
    "technology",
  ];
  // const id = req.params.id;
  //const cat = req.params.paramp;
  data = [];
  news = {};
  for (x of category) {
    article = await Article.find({ category: new RegExp(x, "i") }).exec();
    news = {
      cat: x,
      data: data.push(article),
    };
  }
  publist = await Publisher.find().select("_id").exec();

  await res.json({ success: true, data: news });
  console.log(publist);
});

router.get("/somthing/somthing", (req, res) => {
  // Article.find()
  //        .exec()
  //        .then(result => {
  //            for(var i=0;i<result.length; i++) {
  //                Article.findByIdAndUpdate(result[i]._id, {$set: {urlStr: result[i].title.trim().replace(/[&\/\\#=, +()$~%.'":;*?<>{}]+/ig, '-')}})
  //                       .exec()
  //                       .then(rr => {
  //                           console.log(rr);
  //                       })
  //            }
  //            ress.json(result);

  //        })
  //        .catch(err => {
  //            res.json(err);
  //        })

  Article.updateMany({}, { $set: { public: true } })
    .exec()
    .then((result) => {
      res.json({ success: true, data: result });
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

router.put("/:id", async (req, res, next) => {
  /*
    const id = req.params.id;
    Article.update({_id:id}, {$set: req.body})
           .exec()
           .then(result => {
               res.json({success: true, code: 200, result : result});
           })
           .catch(err => {
               console.log(err);
               res.json({success: false, code: 500, message: err});
           });
*/

  try {
    var article = await Article.findById(req.params.id).exec();
    article.set(req.body);
    var result = await article.save();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * @description   this route is used to get list of  all articles with comments and ratings  for a user
 * @route   GET      /api/article/comment&rating/:userId
 * @access  Public
 */
router.get(
  "/comment&rating/:userId/device/:device",
  getArticlesWithCommentsAndRatings
);

/**
 * @description   this route is used to get count of  all articles
 * @route   GET      /api/article/count/article
 * @access  Public
 */
router.get("/count/article/device/:device", getCountOfTotalArticles);

/**
 * @description   this route is used to get inital limited articles
 * @route   GET      /api/article/getInitialArticles/:limitCount
 * @access  Public
 */
router.get(
  "/getInitialArticles/:limitCount/device/:device",
  getInitialArticles
);

/**
 * @description   this route is used to get every next limited articles
 * @route   GET      /api/article/nextbatch/:limitCount/:lastArticleId
 * @access  Public
 */
router.get(
  "/nextbatch/:limitCount/:lastArticleId/device/:device",
  getNextArticles
);

module.exports = router;
