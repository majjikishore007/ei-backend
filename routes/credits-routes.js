const router = require("express").Router();
const Article = require("../models/article");
const Credit = require("../models/credit");
const mongoose = require("mongoose");
const User = require("../models/user");
const Publisher = require("../models/publisher");
const checkAuth = require("../middleware/check-auth");
const checkCredits = require("../middleware/check-credits");

/**controller function for credits */
const {
  getAllCredits,
  saveCredit,
  getCreditByArticleId,
  getCreditByUserAndArticleId,
  getEarningWithArticleId,
  getCreditsForLoggedinuser,
  aggregateCreditForLoggedinUser,
  getPurchaseArticleDetailsForLoggedinUser,
  aggregateEarningOfPublisherId,
  gettingDetailsOfPublisherId,
  addPublisherPayment,
} = require("../controllers/credit");

/**
 * @description   this route is used to get all credits
 * @route   GET      /api/credit/
 * @access  Public
 */
router.get("/", getAllCredits);

/**
 * @description   this route is used to add a credit
 * @route   POST      /api/credit/
 * @access  Private
 */
router.post("/", checkAuth, checkCredits, saveCredit);

/**
 * @description   this route is used to get credit for a articleId for loggedin user
 * @param id
 * @route   POST      /api/credit/user/article/:id
 * @access  Private
 */
router.get("/user/article/:id", checkAuth, getCreditByUserAndArticleId);

//  credit detail for article

/**
 * @description   this route is used to get credit by articleId
 * @param id
 * @route   GET      /api/credit/article/:id
 * @access  Public
 */
router.get("/article/:id", getCreditByArticleId);

/**
 * @description   this route is used to get earning by articleId
 * @param id
 * @route   GET      /api/credit/earning/:id
 * @access  Public
 */
router.get("/earning/:id", getEarningWithArticleId);

/**
 * @description   this route is used to get credit for loggedin user
 * @route   GET      /api/credit/user
 * @access  Public
 */
router.get("/user", checkAuth, getCreditsForLoggedinuser);

/**
 * @description   this route is used to get credit aggregate for loggedin user
 * @route   GET      /api/credit/aggergate/user
 * @access  Public
 */
router.get("/aggergate/user", checkAuth, aggregateCreditForLoggedinUser);

/**
 * @description   this route is used to get purchase article for loggedin user
 * @route   GET      /api/credit/purchased/article
 * @access  Public
 */
router.get(
  "/purchased/article",
  checkAuth,
  getPurchaseArticleDetailsForLoggedinUser
);

/**
 * @description   this route is used to get aggregate earning of publisher id
 * @param id
 * @route   GET      /api/credit/earning/publisher/:id
 * @access  Public
 */
router.get("/earning/publisher/:id", aggregateEarningOfPublisherId);

/**
 * @description   this route is used to get cerdit details for a publisher id
 * @param id
 * @route   GET      /api/credit/details/publisher/:id
 * @access  Public
 */
router.get("/details/publisher/:id", gettingDetailsOfPublisherId);

/**
 * @description   this route is used to add publisher payment
 * @route   POST      /api/credit/payment/publisher
 * @access  Public
 */
router.post("/payment/publisher", checkAuth, addPublisherPayment);

module.exports = router;
