const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

/**controller functions for payments */
const {
  getAllPayments,
  createPayment,
  createPaymentToSubscribe,
  paymentCallbackWithOrderId,
  paymentCallbackWithOrderIdToSubscribe,
} = require("../controllers/payment");

/**
 * @description   this route is used to get all payments
 * @route   GET      /api/payment
 * @access  Public
 */
router.get("/", getAllPayments);

/**
 * @description   this route is used to order with payment
 * @route   GET      /api/payment
 * @access  Private
 */
router.post("/", checkAuth, createPayment);

/**
 * @description   this route is used to buy subscription plan
 * @route   GET      /api/payment/subscribe
 * @access  Private
 */
router.post("/subscribe", checkAuth, createPaymentToSubscribe);

/**
 * @description   this route is used redirect payment completion/failure
 * @route   GET      redirect url callback
 * @access  Private
 */
router.get("/callback/:id", checkAuth, paymentCallbackWithOrderId);

/**
 * @description   this route is used redirect payment for subscription completion/failure
 * @route   GET      redirect url callback
 * @access  Private
 */
router.get(
  "/subscribe/callback/:id",
  checkAuth,
  paymentCallbackWithOrderIdToSubscribe
);

module.exports = router;
