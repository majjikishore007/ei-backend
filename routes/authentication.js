const router = require("express").Router();

/**controller function */
const {
  registerUser,
  loginUser,
  loginAsGuestUser,
  mobileGoogleLogin,
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

module.exports = router;
