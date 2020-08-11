const router = require("express").Router();

/**controller function */
const {
  registerUser,
  loginUser,
  loginAsGuestUser,
  mobileGoogleLogin,
  verifyEmail,
  resendOtpInEmail,
} = require("../controllers/authentication");

/**validation functions */
const { validateOnRegister } = require("./validation/authentication");

/**
 * @description   this route is used to register a new subscriber into the site
 * @route   POST      /authentication/register
 * @access  Public
 */
router.post("/register", validateOnRegister, registerUser);

/**
 * @description   this route is used to login a user
 * @route   POST      /authentication/login
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @description   this route is used to login as a guest user for 1 hour
 * @route   POST      /authentication/guest
 * @access  Public
 */
router.post("/guest", loginAsGuestUser);

/**
 * @description   this route is used to google loginfrom mobile
 * @route   POST      /authentication/mobileGoogleLogin
 * @access  Public
 */
router.post("/mobileGoogleLogin", mobileGoogleLogin);

/**
 * @description   this route is used to resend otp in email
 * @route   POST      /authentication/resendOtp/email/:email
 * @access  Public
 */
router.get("/resendOtp/email/:email", resendOtpInEmail);

/**
 * @description   this route is used to verify email with otp
 * @route   POST      /authentication/verifyEmail/otp/:otp/email/:email
 * @access  Public
 */
router.get("/verifyEmail/otp/:otp/email/:email", verifyEmail);

module.exports = router;
